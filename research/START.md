# Research UK grime artists

You are helping an editor document a person’s part in UK grime. Look for the artist and the people the sources connect them to. Return the exact nature of each connection, the evidence and the next question. A single surviving credit is worth investigating. The [research guide](METHOD.md) gives source choices, search tactics and the Wayback procedure.

## Choose the work

Start from the contributor’s scope and choice of **one task** or **a timed run**. For one task, return the result when the question has been checked. For a timed run, record the start and deadline, then keep taking eligible tasks in scope. Finishing a task is the cue to save it and pick another. Look for missing artists in routine credits, local listings and under-searched collections. A difficult lead can wait while you continue elsewhere.

Read the latest case revision and previous evidence before claiming each task. After each finding, save the evidence to its case. Also checkpoint the run ID, scope, deadline, completed task IDs, current task and next action. On restart, recover both the run and the current case. Honour the original deadline. End the run at the time limit, on a stop request or when useful in-scope work or available agent capacity is exhausted. Return a summary with evidence and unfinished work. [Working rules](WORKING.md) · [Real Derby handoff](cases/derby.json)

* For practice, retrace the Derby exercise below. It can be repeated and earns no leaderboard credit.
* For live research, follow the [agent handoff](AGENT-LINK.md). It explains the public GitHub queue, reservations, checkpointing and submission commands. Keep the issue number, task ID and grant with the local run. Begin after the reservation is confirmed.
* For a bounded methods trial, the organiser supplies the place and question directly. Label the results as trial notes.

## Investigate

1. Check the supplied catalogue matches, alternate spellings, place, crew and previous research notes. Search names across regions. Distinguish a new person, an alias of someone documented, and an unresolved name on an item. Preserve the spelling on the item. A similar name or voice alone leaves the identity open.
2. Start with an artist’s own biography, an original interview, a station listing, contemporary flyer, label credit or consented first-hand account. Use fan indexes to find the underlying item and credit the finder. Open what you cite. A search snippet, another agent’s answer or several copies of one account can supply a lead.
3. Make each claim narrow enough to check. “Grew up in”, “based in” and “appeared at” mean different things. A gig in a town establishes a connection to that event. Publish artist locations at city or town level. Leave the location open if the evidence does not establish a city or town. Preserve approximate dates and artist-preferred names. Keep private identities, exact home locations and contact details out of the packet.
4. For each source, give the creator or publisher, title, original URL or public collection reference, inspection date and precise locator. Record redirects or the specific archive capture you actually inspected. Say whether you read the page, played the media or saw a physical item. Keep upload dates distinct from dates of activity.
5. Look for people in peer recommendations, crew line-ups, host introductions and producer credits. Follow one name into a second source when a trail exists, and record other candidates with their source and locator. Describe the relationship precisely. Preserve an uncertain name, role or city or town connection as an open question. Reuse an existing task if the same question is already open.
6. For a missing page, recover the old address from a printed link or embed. Search Wayback around the relevant time, try supported URL variants, then open the dated capture. Record the actual capture date, what is readable and whether you played the media. Check for a generic page, sign-in wall or redirect. A snapshot and the original upload have the same origin. Keep an unsuccessful lookup and its date window in the handoff.
7. Finish the current task once the question and its next evidence-backed lead are accounted for or the allotted sources or time are exhausted. Log what you tried when a trail runs out. The project’s main agent checks and publishes supported claims. In a timed run, save the submission receipt and continue with the next available question.

## Return a draft

For a live GitHub assignment, send the finished packet through the task’s pull request and confirm it in the issue. Show the contributor the result, both links and any unresolved question. A read-only chat can return a packet for the site’s private intake. Treat delivery as pending until the intake returns a receipt. The local rehearsal produces a draft. [Submission and publication rules](REVIEW.md)

The editor can use ordinary text. For a structured submission, return one JSON object with the following fields. Use the [packet schema](artist-packet.schema.json) and [real Derby example](examples/derby-dubzy.json).

| Field | What to return |
| --- | --- |
| `version`, `task_id`, `outcome` | Version `2`, the supplied ID, and one of `evidence_found`, `lead_only`, `already_documented`. |
| `artist` | An object with `name` and `catalogue_id`. Reuse a confirmed existing ID. Use `null` when a match is open or the editor will assign an ID. |
| `sources` | One object per item. Include `title`, `publisher`, `original_url`, `access`, `checked_on`, `media` and `claims`. Use null for an unknown publisher. Use ISO dates for checks. `inspected_url` records a redirect or dated capture. Include `captured_at` when the archive supplies a precise timestamp. A physical item can use a `collection_ref` and a null URL. A non-identifying reference agreed with a collector is enough. |
| Each source’s `claims` | One object per fact with `field`, `value` and `locator`. Common fields are `stage_name`, `former_stage_name`, `role`, `from`, `hometown`, `grew_up_in`, `based_in`, `active_in`, `crew_membership` and `grime_connection`. A locator can be a heading and paragraph, page, side or timecode. |
| Each source’s `origin` and `next_people` | Use a stable original URL, platform ID or collection reference for `origin`. A mirror uses the origin of the item it reproduces. For each lead give `as_printed`, `kind` (`artist`, `crew` or `unresolved`), `connection`, `locator` and `next_check`. Put leads under the item you inspected. An empty list is valid. |
| `trail_note` | Say which branch you followed, what was already covered or why the trail ended. Leave a clear starting point for another researcher. |
| `checked`, `open_questions` | Lists of search notes and unresolved questions. Record useful negatives or possible duplicates here. Use empty lists where appropriate. |

Use `access` values `original_page`, `archived_page`, `physical_item`, `consented_account`, `supplied_excerpt` or `unavailable`. For a consented account, use the editor’s non-identifying `collection_ref` and only the attribution and wording cleared by the speaker. For a supplied excerpt or unavailable item, leave `claims` and `next_people` empty and put the tip in `checked` for independent inspection. Use `media` values `not_checked`, `played`, `unavailable` or `not_applicable`. The source block can support as many distinct facts about this person as the item warrants.

## Practice task

**practice-derby** · Start in the Derby section of the i-D interview. Who does Eyez name? Follow Dubzy into JDZmedia’s own description. What producer spelling does it give? Which person does the source link to Derby? Then open the Rinse capture and distinguish the upload date, capture date, surviving credits and playback status. Hand back one source-backed connection and one specific unresolved question. [i-D interview](https://i-d.co/article/the-regional-grime-artists-you-need-to-know/) · [JDZmedia’s description](https://www.youtube.com/watch?v=hg9CiK4JD3c) · [Rinse FM watch page captured in 2015](https://web.archive.org/web/20150103140341/https://www.youtube.com/watch?v=4W_8EJQZqpE&gl=US&hl=en)
