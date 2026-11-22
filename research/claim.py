"""Coordinate public research issues. Requires Python 3.10+, Git and GitHub CLI."""

import argparse
from datetime import datetime, timedelta, timezone
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import uuid


REPO = "Tally-DE/a-place-in-grime"
BASE = f"repos/{REPO}"
MARKER = "A Place In Grime · research queue v1\n"
LEASE = timedelta(hours=48)


def now():
    return datetime.now(timezone.utc)


def timestamp(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def gh(endpoint, *, pages=False, body=None):
    args = ["gh", "api", "--hostname", "github.com", endpoint]
    if pages:
        args.extend(["--paginate", "--slurp"])
    if body is not None:
        args.extend(["--method", "POST", "--input", "-"])
    result = subprocess.run(args, input=json.dumps(body) if body else None,
                            capture_output=True, text=True, encoding="utf-8")
    if result.returncode:
        raise ValueError(result.stderr.strip())
    data = json.loads(result.stdout)
    return [entry for page in data for entry in page] if pages else data


def replay(comments, at):
    """Earliest eligible server ID wins. A losing claim never becomes active later."""
    state = {"status": "ready", "checkpoint": None}
    for comment in sorted(comments, key=lambda entry: entry["id"]):
        content = comment["body"] or ""
        if not content.startswith(MARKER):
            continue
        try:
            event = json.loads(content[len(MARKER):])
        except ValueError:
            continue
        if not isinstance(event, dict) or not re.fullmatch("[a-f0-9]{32}", str(event.get("run", ""))):
            continue
        author = comment["user"]["id"]
        instant = timestamp(comment["created_at"])
        if state["status"] == "claimed" and instant >= timestamp(state["expires"]):
            state = {"status": "ready", "checkpoint": state["checkpoint"]}
        action = event.get("action")
        if action == "claim" and state["status"] == "ready":
            state.update(status="claimed", user=author, owner=comment["user"]["login"],
                         run=event["run"], grant=comment["id"],
                         expires=(instant + LEASE).isoformat(), receipt=comment["html_url"])
        elif (state["status"] == "claimed" and author == state["user"]
              and event["run"] == state["run"] and event.get("grant") == state["grant"]):
            if action == "checkpoint" and isinstance(event.get("note"), str) and event["note"].strip():
                state.update(checkpoint=event["note"], expires=(instant + LEASE).isoformat(),
                             receipt=comment["html_url"])
            elif action == "release":
                state = {"status": "ready", "checkpoint": state["checkpoint"],
                         "receipt": comment["html_url"]}
            elif action == "submit" and pr_number(event.get("pr", "")) and valid_sha(event.get("sha", "")):
                state.update(status="in_review", pr=event["pr"], sha=event["sha"],
                             receipt=comment["html_url"])
    if state["status"] == "claimed" and at >= timestamp(state["expires"]):
        return {"status": "ready", "checkpoint": state["checkpoint"]}
    return state


def pr_number(url):
    match = re.fullmatch(rf"https://github\.com/{re.escape(REPO)}/pull/([1-9][0-9]*)", str(url), re.I)
    return int(match.group(1)) if match else None


def valid_sha(value):
    return bool(re.fullmatch(r"[0-9a-f]{40}", str(value)))


def run_path(run):
    if not re.fullmatch("[a-f0-9]{32}", run):
        raise ValueError("Use the run ID printed by start.")
    path = subprocess.check_output(["git", "rev-parse", "--git-path", "apig-runs"], text=True).strip()
    return Path(path) / f"{run}.json"


def save(path, run):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(f".{uuid.uuid4().hex}.tmp")
    temporary.write_text(json.dumps(run, indent=2) + "\n", encoding="utf-8")
    os.replace(temporary, path)


def issue_data(issue):
    body = (issue.get("body") or "").replace("\r\n", "\n")
    match = re.search(r"^Task ID:[ \t]*`?([a-z0-9][a-z0-9-]*)`?[ \t]*$", body, re.M)
    place = re.search(r"^Place:[ \t]*([^\n]+)$", body, re.M)
    if (issue.get("pull_request") or "research-task" not in {x["name"] for x in issue["labels"]}
            or not match):
        raise ValueError("Expected a research-task issue with a Task ID line.")
    return {"task": match[1], "place": place[1].strip() if place else "", "issue": issue["number"],
            "title": issue["title"], "url": issue["html_url"]}


def current(issue):
    comments = gh(f"{BASE}/issues/{issue}/comments?per_page=100", pages=True)
    return replay(comments, now())


def verify_submission(task, url, sha):
    number = pr_number(url)
    if not number or not valid_sha(sha):
        raise ValueError("Supply the project pull request URL and full lowercase head SHA.")
    pull = gh(f"{BASE}/pulls/{number}")
    if pull["state"] != "open" or pull["base"]["ref"] != "main" or pull["head"]["sha"] != sha:
        raise ValueError("The PR must be open against main at the specified revision.")
    files = gh(f"{BASE}/pulls/{number}/files?per_page=100", pages=True)
    if not any(f["filename"] == f"submissions/{task}.json" and f["status"] != "removed" for f in files):
        raise ValueError("The pull request does not include the packet for this task.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--run", help="Run ID returned by start (required for write actions)")
    subs = parser.add_subparsers(dest="action", required=True)
    start = subs.add_parser("start")
    start.add_argument("--minutes", type=int)
    start.add_argument("--place", default="")
    subs.add_parser("resume")
    subs.add_parser("list")
    for name in ["status", "claim", "checkpoint", "release", "submit"]:
        sub = subs.add_parser(name)
        sub.add_argument("issue", type=int)
        if name == "checkpoint":
            sub.add_argument("note", help="Public handoff with source, locator and next action")
        if name == "submit":
            sub.add_argument("pr")
            sub.add_argument("sha")
    args = parser.parse_args()
    if args.action == "start":
        if args.minutes is not None and args.minutes < 1:
            raise ValueError("Duration must be at least one minute.")
        run_id, started = uuid.uuid4().hex, now()
        run = {"run": run_id, "started": started.isoformat(), "place": args.place,
               "deadline": (started + timedelta(minutes=args.minutes)).isoformat() if args.minutes else None,
               "current": None, "completed": []}
        save(run_path(run_id), run)
        return run
    if args.action == "list":
        issues = gh(f"{BASE}/issues?labels=research-task&state=open&per_page=100", pages=True)
        return [issue_data(i) | current(i["number"]) for i in issues if not i.get("pull_request")]
    if args.action != "status":
        if not args.run:
            raise ValueError("Supply --run ID before the command. Use start to create one.")
        path = run_path(args.run)
        run = json.loads(path.read_text(encoding="utf-8"))
        if args.action == "resume":
            if run["current"]:
                run["shared_state"] = current(run["current"])
            return run
    issue = gh(f"{BASE}/issues/{args.issue}")
    info = issue_data(issue)
    state = current(args.issue)
    if args.action == "status":
        return info | state | {"issue_state": issue["state"]}
    if issue["state"] != "open":
        raise ValueError("This research issue is closed.")
    event = {"action": args.action, "run": args.run}
    owns = state.get("run") == args.run and state.get("user") == gh("user")["id"]
    if args.action == "claim":
        if run["current"] not in [None, args.issue]:
            other = current(run["current"])
            if other["status"] == "claimed" and other.get("run") == args.run:
                raise ValueError("Finish or release your current task first.")
            if other["status"] == "in_review" and other.get("run") == args.run and other["receipt"] not in run["completed"]:
                run["completed"].append(other["receipt"])
        if run["deadline"] and now() >= timestamp(run["deadline"]):
            raise ValueError("The run deadline has passed.")
        if not run["deadline"] and run["completed"]:
            raise ValueError("The single-task run is complete.")
        if run["place"] and run["place"].casefold() != info["place"].casefold():
            raise ValueError(f"Task place is {info['place']}; run scope is {run['place']}.")
        if state["status"] == "claimed" and owns:
            run["current"] = args.issue
            save(path, run)
            return info | state
        if state["status"] != "ready":
            raise ValueError(f"Task is {state['status']}.")
        # Persist the intent before posting, so resume can recover a lost response.
        run["current"] = args.issue
        save(path, run)
    else:
        if (args.action == "submit" and owns and state["status"] == "in_review"
                and state["pr"] == args.pr and state["sha"] == args.sha):
            if state["receipt"] not in run["completed"]:
                run["completed"].append(state["receipt"])
            run["current"] = None
            save(path, run)
            return info | state
        if not owns or state["status"] != "claimed":
            raise ValueError("The shared task has no active grant for this run and account.")
        event["grant"] = state["grant"]
        if args.action == "checkpoint":
            if not 1 <= len(args.note.strip()) <= 4000:
                raise ValueError("Write a public note of 1–4000 characters.")
            event["note"] = args.note.strip()
        if args.action == "submit":
            verify_submission(info["task"], args.pr, args.sha)
            event.update(pr=args.pr, sha=args.sha)
    posted = gh(f"{BASE}/issues/{args.issue}/comments", body={"body": MARKER + json.dumps(event, ensure_ascii=False)})
    state = current(args.issue)
    if state.get("receipt") != posted["html_url"]:
        raise ValueError("Grant or update was not confirmed. Read status before doing more work.")
    if args.action in ("submit", "release"):
        run["current"] = None
    if args.action == "submit":
        run["completed"].append(state["receipt"])
    save(path, run)
    return info | state


if __name__ == "__main__":
    try:
        print(json.dumps(main(), indent=2, ensure_ascii=True))
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        sys.exit(str(error))
