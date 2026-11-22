# Run a research session and keep its findings

The shared record holds the research. The agent can change, its context can fill up or a local volunteer can return months later. Anyone resuming should be able to answer four questions from the case alone. What is the scope? What can we already show? What has been tried? What is the next useful action?

| Work | When to use it | What to leave |
| --- | --- | --- |
| Quick check | One bounded question such as identifying the spelling on a flyer or checking whether a source gives a town. | The task ID, inspected item and locator, finding or failed lookup, open uncertainty and next action. A standalone check can end with a dated note. |
| Timed run | A volunteer wants their agent to work independently for up to a chosen duration. It can complete many ordinary discovery or verification tasks across artists during that time. | A checkpoint for the run and a dated update on each task. End with sourced discoveries, unresolved leads and where the work stopped. |
| Long investigation | A town across several eras, a lost station archive, a disputed alias or a collection of tapes still being indexed. | One stable case ID, the scope and coverage gaps, a short current summary, source and packet references, an append-only chronological log, and individually claimable questions. |

## Work for a chosen duration

1. Save the contributor’s geographical scope, purpose and duration. Record the run ID, start and absolute deadline with timezone. A contributor can give an agent a whole afternoon to check ordinary credits across several artists.
2. Select an available in-scope question, check the current case and reserve that question in the [GitHub research queue](https://github.com/Tally-DE/a-place-in-grime/issues?q=is%3Aissue+is%3Aopen+label%3Aresearch-task). If the ready list runs dry, check the existing issues for a duplicate and propose a specific question from an unexamined collection or a newly evidenced name. An editor can give it a dedicated research issue.
3. Save the finding and source, or park the question with a reopening condition. Release or submit the task, update the run checkpoint and immediately pick the next eligible question. Editorial review can proceed independently. Check time before starting each lookup and keep enough time to save partial work.
4. The queue helper saves the run ID, scope, start, deadline, current issue and submission receipts under the checkout’s Git metadata. Keep the draft evidence packet beside your working case. Save a public checkpoint with the last item checked and the next action. On restart, compare the local run record with the current shared grant and remaining time. A replacement agent can take over the same checkout and account for the remainder of the original window.
5. On expiry, a stop request or loss of usable capacity, checkpoint the current item and return the results so far. If eligible work runs out early, report that. The final summary links the evidence for each proposed artist, distinguishes open leads, and records why the run ended. Unattended execution depends on the contributor’s agent staying active and having somewhere durable to write.

## Start or resume

1. Open the latest case revision and selected research issue. Search the case, existing pull requests and queue for the same person, alias, item ID or question. Reuse an existing record when they match.
2. Load the current summary, the last relevant dated update and the linked evidence for this question. Fetch older detail on demand. A prior agent’s summary points back to the source. It cannot establish a new claim.
3. Take one available question with a finish condition. Case ownership can span months. Only the active question needs a time-limited reservation. Other researchers can work other questions in the case.

## Save progress while working

After a material finding, failed search, change of branch or before a session ends, append a dated note. Include the task ID, query or item checked, what was observed, its locator, uncertainty and the exact next action. For a large collection, save the last item and next unexamined item. For a later visit, save the event that should prompt it, such as a new scan, a contributor reply or access to a collection. A waiting case consumes no agent time.

Update the short summary, task states and revision alongside the note. A lead can be ready, claimed, waiting, in review or closed. A waiting item names its reopening condition. Completed and inconclusive checks remain searchable. Only reviewed findings enter public profiles. Contact details, permission records and private material stay with the organiser.

Use the [agent handoff](AGENT-LINK.md) for the commands to claim, checkpoint, submit, release and resume. The issue stores public progress across contributors. A checkpoint from the active owner renews the grant for 48 hours. A later researcher can recover the notes after expiry. Keep sensitive material in the site’s private intake. A text-only chat can prepare a packet for the contributor to send through the site’s Agent research page.

## Derby example

Open the [Derby case](cases/derby.json). Its evidence references point to field notes and an example packet. Each unfinished question has its own ID and next action. A live assignment has a corresponding public issue labelled `research-task`. Check the issue for its present availability and latest checkpoint.
