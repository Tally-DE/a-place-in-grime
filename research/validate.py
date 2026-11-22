"""Check incoming packets separately from the published catalogue."""
import json
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker

root = Path(__file__).resolve().parents[1]
def read(path):
    return json.loads(path.read_text(encoding="utf-8"))

validator = Draft202012Validator(read(root / "research/artist-packet.schema.json"), format_checker=FormatChecker())
for folder in ["submissions", "research/examples"]:
    for path in (root / folder).glob("*.json"):
        packet = read(path)
        validator.validate(packet)
        if folder == "submissions" and (packet["task_id"] != path.stem or packet["version"] != 2):
            raise ValueError(f"{path} needs a matching task ID and version 2")

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
    assert artist["bio"], f"{artist['id']} needs a sourced profile"
    for paragraph in artist["bio"]:
        assert paragraph["text"].strip() and paragraph["claims"] and set(paragraph["claims"]) <= claims
    for connection in artist.get("connections", []):
        assert connection["id"] in {a["id"] for a in artists} - {artist["id"]}
        assert connection["label"] and connection["claims"] and set(connection["claims"]) <= claims
    for social in artist.get("socials", []):
        assert social["label"] and all(social[k].startswith("https://") for k in ("source", "url"))
    if photo := artist.get("photo"):
        assert all(photo.get(k) for k in ("alt", "credit", "licence", "changes"))
        assert all(photo[k].startswith("https://") for k in ("source", "licenceUrl"))
        assert photo["path"].startswith("/assets/artists/") and ".." not in photo["path"]
        assert (root / "site/public" / photo["path"].lstrip("/")).is_file()
print(f"Catalogue and research packets checked. {len(artists)} artist profiles.")
