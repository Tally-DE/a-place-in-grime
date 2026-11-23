# Run a research session and keep its findings

The shared record holds the research. The agent can change, its context can fill up or a local volunteer can return months later. Anyone resuming should be able to answer four questions from the case alone. What is the scope? What can we already show? What has been tried? What is the next useful action?

| Work | When to use it | What to leave |
| --- | --- | --- |
| Quick check | One bounded question such as identifying the spelling on a flyer or checking whether a source gives a town. | The task ID, inspected item and locator, finding or failed lookup, open uncertainty and next action. A standalone check can end with a dated note. |
| Timed run | A volunteer wants their agent to work independently for up to a chosen duration. It can complete many ordinary discovery or verification tasks across artists during that time. | A checkpoint for the run and a dated update on each task. End with sourced discoveries, unresolved leads and where the work stopped. |
| Long investigation | A town across several eras, a lost station archive, a disputed alias or a collection of tapes still being indexed. | One stable case ID, the scope and coverage gaps, a short current summary, source and packet references, an append-only chronological log, and individually claimable questions. |

## Work for a chosen duration

1. Save the contributor’s geographical scope, purpose and duration. Record the run ID, start and absolute deadline with timezone. A contributor can give an agent a whole afternoon to check ordinary credits across several artists.
2. Select an available in-scope question, check the current case and reserve that question in the [GitHub research queue](https://github.com/Tally-DE/a-place-in-grime/issues?q=is%3Aissue+is%3Aopen). If the ready list runs dry, check the existing issues for a duplicate and use `python research/claim.py discover "AREA" "FOCUS"` for an unexamined collection or a newly evidenced name. Claim the returned open issue before starting.
3. Save the finding and source, or park the question with a reopening condition. Release or submit the task, update the run checkpoint and immediately pick the next eligible question. Editorial review can proceed independently. Check time before starting each lookup and keep enough time to save partial work.
4. The queue helper saves the run ID, scope, start, deadline, current issue and submission receipts under the checkout’s Git metadata. Keep the draft evidence packet beside your working case. Save a public checkpoint with the last item checked and the next action. On restart, compare the local run record with the current shared grant and remaining time. A replacement agent can take over the same checkout and account for the remainder of the original window.
5. On expiry, a stop request or loss of usable capacity, checkpoint the current item and return the results so far. If eligible work runs out early, report that. The final summary links the evidence for each proposed artist, distinguishes open leads, and records why the run ended. Unattended execution depends on the contributor’s agent staying active and having somewhere durable to write.

## Start or resume

### Private runs

Keep one folder for the run with a short `run.md` and a `packets/` folder. At the top of the note save the scope, start and absolute deadline. Check public issues, open PRs, accepted records and source coverage. If an open question is already reserved, pick another. Reuse an unreserved issue's task ID when answering it privately. For a new question use a local ID such as `private-derby-lox-grime-a-side`. Private IDs and receipts give the editor a way to match work. They do not reserve public questions.

After each useful or unsuccessful check, append the time, item, exact locator, finding and next action to the note. Save each question as its own v4 JSON in `packets/`. Save reusable collections or new coverage in `trail_note`. When resuming, read the last checkpoint, check the queue again and keep the original deadline.

For a local copy of this repo, install the validator dependency with `python -m pip install jsonschema==4.25.1` in a virtual environment. Run `python research/validate.py --packets PATH`, replacing PATH with the packet folder or individual files. The dated run note can link each filename to its artist, open questions and source. Keep the validator output as a local receipt. A site receipt confirms delivery separately.

A working checkpoint from the Derby trial, shortened for reuse:

> 23 November 2026, 01:21 UTC · private-derby-lox · Red Bull, Grime-A-Side final, watch ID i1rUeV51NxE. The organiser's preview frame at about 1:55 labels Lox and Derby. Saved the time in the Lox packet. Audio unchecked. Next, compare the team credit with the earlier solo JDZmedia billing.

When the time is up, send the contributor the packets, note and local receipt in one handoff. A subagent should message its parent on completion when the platform supports that. On the site, choose the JSON files together or paste one packet. Save the private receipt for each accepted file. Public assignments continue with the steps below.

1. Open the latest case revision and selected research issue. Search the case, existing pull requests and queue for the same person, alias, item ID or question. Reuse an existing record when they match.
2. Load the current summary, the last relevant dated update and the linked evidence for this question. Fetch older detail on demand. A prior agent’s summary points back to the source. It cannot establish a new claim.
3. Take one available question with a finish condition. Case ownership can span months. Only the active question needs a time-limited reservation. Other researchers can work other questions in the case.

## Save progress while working

After a material finding, failed search, change of branch or before a session ends, append a dated note. Include the task ID, query or item checked, what was observed, its locator, uncertainty and the exact next action. For a large collection, save the last item and next unexamined item. For a later visit, save the event that should prompt it, such as a new scan, a contributor reply or access to a collection. A waiting case consumes no agent time.

Save the current version 4 packet, including completed profile checks, URLs tried, source locators, unresolved fields and next lookup. A later session can reuse a confirmed check with its original date and source. Record whether the activity is a dated sighting or an explicitly stated career period, and whether a public booking page was actually found.

Update the short summary, task states and revision alongside the note. A lead can be ready, claimed, waiting, in review or closed. A waiting item names its reopening condition. Completed and inconclusive checks remain searchable. Only reviewed findings enter public profiles. Contact details, permission records and private material stay with the organiser.

Use the [agent handoff](AGENT-LINK.md) for the commands to claim, checkpoint, submit, release and resume. The issue stores public progress across contributors. A checkpoint from the active owner renews the grant for 48 hours. A later researcher can recover the notes after expiry. Keep sensitive material in the site’s private intake. A text-only chat can prepare a packet for the contributor to send through the site’s Agent research page.

## Derby example

Open the [Derby case](cases/derby.json). Its evidence references point to field notes and an example packet. Each unfinished question has its own ID and next action. A live assignment has a corresponding public issue labelled `research-task`. Check the issue for its present availability and latest checkpoint.
