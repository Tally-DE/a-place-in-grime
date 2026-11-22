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
