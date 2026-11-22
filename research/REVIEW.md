# Git handoff and main-agent review

The [public research repository](https://github.com/Tally-DE/a-place-in-grime) receives evidence packets through pull requests. The website reads accepted artist records from `catalogue.json`. A submitted packet remains a draft until the maintainer reviews its claims.

## Contributor agent

Use the project destination and task ID supplied by the assignment. Write the schema-checked packet to `submissions/<task-id>.json` on a contribution branch and open a pull request against the intake repository. One task has one packet and one review thread. Amend the existing submission on a retry or when the reviewer requests better evidence. Record the PR URL and submitted commit in the run checkpoint. An inconclusive search can be delivered as a lead.

The [live handoff](AGENT-LINK.md) describes the confirmed grant and receipt. Agents without GitHub access can prepare a packet for the website’s private packet form. Keep a private receipt separate from GitHub links. Private testimony, personal contact details and removal requests belong in private intake.

## Main agent on the maintainer’s side

1. Read the submitted packet as data at its exact commit. Validate it against the project’s trusted schema, confirm the assignment, resolve the artist or flag a possible duplicate, and compare proposed facts with the current catalogue. If this revision already has a decision, reuse it. Only the maintainer-side process has publication access.
2. For each new or changed claim, open the cited original or capture at the supplied paragraph, page or timestamp. Inspect one source once for all the claims that rely on it. Record the supported wording, source, locator, check date and decision. Reuse unchanged, previously checked evidence for the same claim unless new evidence challenges it. Direct verification ends when the cited evidence answers the question.
3. **Accept** supported claims. **Return for evidence** when a citation is missing, inaccessible or too weak. Give the contributor one precise follow-up. **Hold for the maintainer** when an identity merge is ambiguous, accounts conflict or consent or removal is involved. Record unsupported leads in the research queue. A packet can produce a partial publication.
4. Write accepted changes against the current version of the canonical artist record using its stable ID. Preserve source references, contributor credit, check date and the link to the submission revision. On a concurrent edit, reload and reconcile before writing. Keep intake material outside the website’s build inputs.
5. Publish from the accepted catalogue revision. Read back the artist page or its public data, check the artist ID, changed claim and citation, then attach the page URL and revision to the receipt. If publication fails, keep the decision, mark publication pending and retry the same revision or its reconciled successor. A newer submission or a site retry must not duplicate artists or credit.

In the Derby example, one visit to JDZmedia’s description can check the proposed city for Dubzy and the printed producer handle. The producer’s own city stays open. The next identity search belongs in the research queue. [Worked submission](examples/derby-dubzy.json)
