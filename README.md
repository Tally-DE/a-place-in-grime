# A Place In Grime

The aim is to document every artist we can establish took part in UK grime, across all four nations, every era and every level of visibility. An MC who appeared at one local night, a producer remembered by a handle and an artist with a national career all belong within scope. A remembered name can enter as a lead immediately. A public profile can be brief. Release lists are optional.

The working catalogue includes artist and place pages, alias search, claim-level corrections and verification, and a private submissions inbox. The reviewed artist profiles are in [catalogue.json](catalogue.json). The website is currently an [owner-private pilot](https://a-place-in-grime.tally-de.chatgpt.site). The research repository and task queue are public.

## Take part

* **Give an agent one link.** Paste the [public agent brief](https://raw.githubusercontent.com/Tally-DE/a-place-in-grime/main/research/AGENT-LINK.md) into your agent and tell it any UK area and a time limit. It can open a focused question in a place missing from the queue. It handles claiming, finding sources, checkpointing and preparing a pull request.
* **Pick up a question.** The [research queue](https://github.com/Tally-DE/a-place-in-grime/issues?q=is%3Aissue+is%3Aopen) holds one question per issue. The claim helper reads the ordered issue comments to resolve competing claims.
* **Suggest someone or check a fact.** Read [how to contribute](CONTRIBUTING.md). Web submissions are private. Public research packets enter [submissions](submissions/) and need editorial review before publication.

## Run the site

With Node.js 24, run `node site/local.mjs` from the repository root and open `http://127.0.0.1:4173`. No package installation is needed. The local server writes receipts to the ignored site/.local directory. It builds from the same catalogue and worker as the hosted pilot. [Editorial inbox and decision process](site/EDITORIAL.md) · [Photograph credits and licences](site/public/photos.txt)

The sections below preserve the original research trial and the longer-term project plan. The links above describe the current implementation.

## Establish the method in Derby

Start with a source that names people. Follow one of those names into a different original source, explain the connection, and leave the next person a question they can actually investigate. In Derby, an interview with Eyez led to Dubzy. A JDZmedia upload then supplied a production credit for `@HekkersSnazz`. A separate route through a crew’s old Myspace address tested what survived from an earlier scene. The trial records the exact sources, the dates recovered from Wayback and the gaps. [Research rules and places to look](research/METHOD.md) · [Derby field notes](research/trials/derby.md) · [Agent brief](research/START.md)

## A later regional pilot

To reach people outside well-documented networks, track which towns, periods, roles and local collections have been searched. Record the bounds of each search and leave the rest open. One contributor can check a single billing while a scene investigation spans months and several researchers. Each working session saves its progress to the same case. [How to start and resume research](research/WORKING.md) · [Current Derby case](research/cases/derby.json)

I’d pilot Birmingham and Wolverhampton as two distinct places, with suggestions open across the UK from launch. There are local sources to start from and a good test of whether we can place someone accurately when the source describes a wider scene. Birmingham’s LEGACY project has first-hand accounts. The UK Rap Map already maps artists, including grime artists, and The Grime Archive indexes recorded sets. Link back to their work, credit the people who collected it, and discuss reuse before importing a collection. [LEGACY](https://www.legacybirmingham.com/) · [UK Rap Map](https://ukrapmap.com/about/) · [The Grime Archive](https://www.grimearchive.org/about)

An earlier example from Wolverhampton shows why alias searches matter. The producer Detz identifies Detonator as a former name. Either spelling should reach the same profile. [Detz’s biography](https://www.detz.online/)

## What goes on an artist page

| What a visitor sees | What an editor records |
| --- | --- |
| Stage name, former names and spellings | A permanent artist ID, the spelling on each source, and evidence connecting an alias to this person. Two people can use the same name. |
| A short introduction, roles and crews | A few sourced sentences. Include MCs, producers, DJs and other performers with a documented UK grime connection. Record crew membership and periods when known. |
| Places the artist is connected to | The relationship matters. Someone can grow up in one town, form a crew in another and work across both. Each place gets its own evidence. |
| Years documented and a few identifying sources | A dated appearance establishes activity at that time. Keep dates approximate when the evidence is approximate. A flyer, interview, tape sleeve or broadcast can be enough to start a page. |
| Evidence, open questions, credits and changes | Each factual claim has a source, a precise place to check it, its review status and the last check. Visitors can verify or correct that claim directly. |

Browse the catalogue directly by UK city or town. Publish each supported city or town connection with its source and explain what it means for that artist. Leave the location open when the source is too broad or uncertain. Stage names and aliases are searchable without choosing a place.

## Let people contribute in a minute

* **Suggest an artist** belongs on the homepage, every place page and empty search results. A remembered stage name is enough to start. Offer possible matches, let the person confirm it is someone else, and make place, era, source and public credit optional.
* **Verify the research** belongs on every artist page. Let the visitor pick a statement, open its source at the relevant paragraph or timestamp, and say whether it supports the statement, partly supports it, contradicts it or can no longer be checked. Record what they looked at. A reviewer can act on that check.
* **Suggest a correction** sits beside each fact and at the foot of the profile. Carry the artist ID, claim ID and version into the form. Ask what should change and how the contributor knows. Offer a private route for artists, sensitive corrections and removal requests.
* **Research with an agent** offers one task or a run lasting as long as the contributor chooses. They can pick a town or take available work across the UK. A timed run works through multiple artists, saves each result and keeps going. The proposed site gives the contributor one brief link with those choices. A paper sleeve or a first-hand memory can also go straight to a human editor.

All four routes should work on a phone. A person can use a handle or stay anonymous. Give them a private receipt to see the decision or add evidence. The project collects agent submissions in Git. A site submission service handles GitHub for beginners, while experienced contributors can submit directly. [Try the contribution forms in plain text](CONTRIBUTING.md)

## Give each research question one owner

During the pilot, one editor can keep the list and confirm each assignment. A live site should have **one shared queue** for the web form, agents and GitHub contributors.

1. Create a task around one question about a person or an unidentified credit. Keep the source, exact spelling, locator and relationship that led to the question. Include possible matches and previous checks. When several routes lead to the same open question, attach their evidence to one task.
2. Give the site a permanent, publicly readable guide at `/agents`. A capable agent can reserve a free task through the queue. A contributor using a read-only chat can tap **Give me a task** and paste the resulting public brief link. Serve the complete brief as plain text at `/tasks/<id>`. Opening or previewing the link only reads it. Keep the contributor’s private return or renewal link separate.
3. Have the queue reserve a task in one database transaction. If two people ask for the same one, only one gets it. Repeated clicks return the existing reservation. Start with a renewable 48-hour reservation and reopen expired work with its notes attached. Submitted work stays in review.
4. Before assigning or creating a record, search aliases, nearby places, crew links, known source IDs and completed tasks. Similar names flag a possible match for a human. Confirmed merges keep both spellings, evidence, credits and redirects from old IDs. Record inconclusive searches so the next person has a starting point.
5. A submitted packet goes to the project’s Git inbox for the maintainer-side main agent. If another contributor has already finished the question, attach any new evidence to that record and credit it once. Show open, reserved and reviewed work from the same queue everywhere.

## What earns publication

* A name with little surviving evidence is a **lead**. Keep it in the moderated queue. Open a public profile when a reviewer can connect that particular artist identity to UK grime. One attributable source can support a narrow claim, such as the billing on a grime flyer. Booking, attendance, crew membership and hometown are different claims.
* The main agent opens the supplied locator for each new claim, records its decision and publishes the supported change. It routes missing evidence back to the contributor and escalates ambiguous or sensitive cases to the maintainer. For an uncertain identity merge, disputed affiliation or contested location, look for independent evidence or direct confirmation from the artist. Two reposts of one account share one origin. Where the evidence still conflicts, label the question as disputed and preserve the reasons.
* First-hand recollections count. Record the speaker’s relationship to the scene, the date of the account, what they personally remember and the wording they consent to share. Keep private contact details outside the public repository. A public verification is evidence for the editor to assess. Vote totals confer no editorial status.
* Retain the original URL or platform ID, publisher or uploader, title, dates, locator, last check and any working archive reference. Separate the date of an event from the upload date, and the availability of a page from the playability of its media. If a link dies, keep the dated citation and open a task to find replacement evidence. A vanished Myspace page can still have a dated paper trail. If someone offers a tape or scan, record permission and credit privately before arranging any public copy. Store authorised preservation copies with checksums and a second backup. [Internet Archive’s guidance](https://help.archive.org/help/using-the-wayback-machine/)
* Corrections carry a reason and a record of the change. Recheck an edit against the version it was submitted on. An editor can fix, split, merge or withdraw a record. Use private intake for sensitive material before it reaches Git history. Define reuse terms for original text and cleared data before publishing exports.

## Build and fund the pilot

Use GitHub to receive agents’ evidence packets as pull requests. The main agent checks their citations and writes approved facts to the canonical catalogue. Generate search and artist pages from those approved records, verify the published revision and return a receipt. The project owns the one-link brief and the instructions for each stage. [Contributor-agent entry point](AGENTS.md) · [Main-agent review and publication](research/REVIEW.md) GitHub Pages is a static hosting option on GitHub Free for a public repository. A small server with a transactional database can handle guest submissions, private moderation and task reservations. Publish versioned JSON or CSV exports and keep a backup outside the hosting account. [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) · [GitHub review controls](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

Private donations can support the project, including research compute and the archivist’s time. Donor details, amounts, spending and hours stay private. Visitors can follow progress through the artist records, source recoveries and corrections. Keep a compute ceiling internally and slow new research when the review queue backs up. Funded tasks follow the same editorial rules as volunteer work.

Credit people on the change they helped make. An opt-in monthly leaderboard can show accepted discoveries, source checks and corrections, with shared credit for the finder and reviewer. Count each person once per accepted task and role. Anonymous work is welcome. Keep spending and donation amounts out of the rankings.

**First milestone.** An independent reader can retrace a real Derby chain, distinguish a credit from a peer recommendation, recognise a duplicate citation, and pick up a specific unfinished question. The field notes identify which parts still need an independent reader or local knowledge. After the methods trial, the proposed regional pilot can take ten suggestions through the public contribution workflow. Before wider rollout, test the phone journey, simultaneous reservations, corrections and backup recovery. Publish counts of documented artists and open leads by place, with space for towns where research has yet to begin.
