# The private editorial inbox

The hosted worker keeps website submissions in its private BUCKET storage. Each form submission gets an unguessable receipt. The public receipt exposes its type, date and decision. The original testimony is available only through authenticated editor access. Only accepted facts go into the public catalogue.

The editor API accepts a bearer token named REVIEW_KEY. To use the pilot from its original Windows account, decrypt the local editor key into the current PowerShell session. For local development set REVIEW_KEY before starting the server. The owner-private hosted Site also requires its normal owner access. The deployment audience is independent of editor authorization.

```powershell
$protectedKey = Get-Content -LiteralPath 'site/.local/editor-key.dpapi' | ConvertTo-SecureString
$env:REVIEW_KEY = [Net.NetworkCredential]::new('', $protectedKey).Password
```

* GET /editor/inbox returns receipt IDs and the next cursor. Send the returned cursor as the cursor query parameter for the next page.
* GET /editor/inbox/{receipt} returns the private packet and its revision.
* POST /editor/inbox/{receipt} accepts JSON with the revision and a status of Accepted, Needs more evidence or Closed. A concurrent edit returns HTTP 409. Read the receipt again before retrying.
* Include an Authorization header containing Bearer followed by the review key. Keep the key and sensitive content outside research issues and public Git history.

Review the original evidence for each proposed public claim, put the accepted wording and locator in catalogue.json and rebuild. Update the receipt after confirming the published revision. Grant public credit only where the contributor supplied a credit name and the work was accepted. The initial hosted deployment is owner-private. Configure DONATION_URL with the project owner's HTTPS payment link to enable donations.

## Artist page claims

An artist or authorised booking representative starts at the claim link on the artist page. Their reply address and account details go to the private inbox. Their receipt shows a short proof code. The receipt itself is a private management link. Never ask the claimant to publish it.

1. Open the claim in the authenticated inbox. Independently find an established artist account or the agency's official roster using the catalogue sources. Check the identity and, for a representative, their authority to handle the artist's bookings.
2. Look for the exact proof code on that account. If a public post is impractical, agree a private challenge through a booking channel you found independently. A screenshot, display name or reply from the address on the form cannot establish control by itself.
3. Record where and when you verified control in the private `proofNote`. Send it with `status: "Accepted"` and the current `revision` to the receipt's editor endpoint. Use `Needs more evidence` when the evidence is inconclusive. Accepting a claim publishes only a booking contact explicitly selected for publication.
4. After approval the artist can change or remove that contact using the receipt. A claim also works without any public contact. If someone loses access, verify a fresh claim. Resolve competing claims through an independently established channel, close the earlier approval, then reread and approve the replacement. Closing a claim immediately revokes its management link.

Claims and proof notes stay in private storage. Public research can identify a professional booking page before anyone claims an artist page. A booking page is an invitation to enquire, not confirmation that the artist is available.
