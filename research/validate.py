"""Check incoming packets separately from the published catalogue."""
import json
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit
from jsonschema import Draft202012Validator, FormatChecker

root = Path(__file__).resolve().parents[1]
def read(path):
    return json.loads(path.read_text(encoding="utf-8"))

def web(value):
    url = urlsplit(value)
    return url.scheme in {"http", "https"} and url.hostname and not (url.username or url.password)

validator = Draft202012Validator(read(root / "research/artist-packet.schema.json"), format_checker=FormatChecker())
media_validator = validator.evolve(schema=validator.schema["$defs"]["profile_media"])
for folder in ["submissions", "research/examples"]:
    for path in (root / folder).glob("*.json"):
        packet = read(path)
        validator.validate(packet)
        if folder == "submissions" and (packet["task_id"] != path.stem or packet["version"] != 4):
            raise ValueError(f"{path} needs a matching task ID and version 4")

catalogue = read(root / "catalogue.json")
places = {p["id"]: p for p in catalogue["places"]}
assert len(places) == len(catalogue["places"])
for place in places.values():
    assert place["kind"] in {"city", "town"}, "Catalogue places must be cities or towns"
    assert not place.get("parent"), "The city and town index is flat"

artists = catalogue["artists"]
assert len({a["id"] for a in artists}) == len(artists)
for artist in artists:
    assert artist["name"] and artist["claims"] and set(artist["placeIds"]) <= places.keys()
    assert len({c["id"] for c in artist["claims"]}) == len(artist["claims"])
    for fact in artist["claims"]:
        assert all(fact.get(k) for k in ("id","text","source","publisher","url","locator","checked"))
        assert fact["url"].startswith(("https://","http://"))
    claims = {c["id"] for c in artist["claims"]}
    activity = artist.get("activity", {})
    booking = artist.get("booking")
    if activity or booking:
        checked = date.fromisoformat(artist["activityChecked"])
        assert set(activity) <= {"first", "last", "start", "end", "current"}
        assert not ("end" in activity and "current" in activity)
        for kind, evidence in activity.items():
            assert web(evidence["source"]) and evidence["locator"].strip()
            if kind == "current":
                assert date.fromisoformat(evidence["asOf"]) <= checked
            else:
                assert type(evidence["year"]) is int and 1900 <= evidence["year"] <= checked.year
        for earlier, later in [("first", "last"), ("start", "end")]:
            if earlier in activity and later in activity:
                assert activity[earlier]["year"] <= activity[later]["year"]
        if booking:
            assert set(booking) == {"url", "source", "locator"}
            assert web(booking["url"]) and web(booking["source"]) and booking["locator"].strip()
    assert artist["bio"], f"{artist['id']} needs a sourced profile"
    for paragraph in artist["bio"]:
        assert paragraph["text"].strip() and paragraph["claims"] and set(paragraph["claims"]) <= claims
    for connection in artist.get("connections", []):
        assert connection["id"] in {a["id"] for a in artists} - {artist["id"]}
        assert connection["label"] and connection["claims"] and set(connection["claims"]) <= claims
    accounts = artist.get("socials", [])
    assert len({account["label"].casefold() for account in accounts}) == len(accounts)
    visual = None
    if photo := artist.get("photo"):
        assert photo["path"].startswith("/assets/artists/") and ".." not in photo["path"]
        assert (root / "site/public" / photo["path"].lstrip("/")).is_file()
        visual = {k: v for k, v in photo.items() if k not in ("path", "originalSource")}
    media_validator.validate({**artist["mediaResearch"], "visual": visual, "accounts": accounts})
print(f"Catalogue and research packets checked. {len(artists)} artist profiles.")
