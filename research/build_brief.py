"""Assemble one portable rehearsal brief from the project's current public files."""

import argparse
import json
from pathlib import Path


def build(case_file: Path) -> str:
    research = Path(__file__).resolve().parent
    case = json.loads(case_file.read_text(encoding="utf-8"))
    parts = [
        "# UK Grime Database contributor brief",
        "Local rehearsal. Follow the project instructions below and prepare the "
        "finished evidence packet for the contributor. Live Git submission requires "
        "a project-issued assignment with a destination. For this exercise, do one "
        "task unless the contributor has chosen a duration.",
    ]
    files = [
        research.parent / "AGENTS.md",
        research / "START.md",
        research / "METHOD.md",
        research / "WORKING.md",
        research / "REVIEW.md",
        research / "artist-packet.schema.json",
        case_file,
        *(case_file.parent / ref for ref in case["evidence_files"]),
    ]
    for path in dict.fromkeys(file.resolve() for file in files):
        label = path.relative_to(research.parent).as_posix()
        content = path.read_text(encoding="utf-8").strip()
        if path.suffix == ".json":
            content = f"```json\n{content}\n```"
        parts.extend([f"## Project file {label}", content])
    return "\n\n".join(parts) + "\n"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("case", type=Path, help="Project case JSON")
    parser.add_argument("output", type=Path, help="Markdown attachment to create")
    args = parser.parse_args()
    brief = build(args.case)
    with args.output.open("x", encoding="utf-8") as output:
        output.write(brief)
