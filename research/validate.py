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
    chain = set()
    while place:
        assert place["id"] not in chain, "Circular place hierarchy"
        chain.add(place["id"])
        place = places[place["parent"]] if place["parent"] else None

artists = catalogue["artists"]
assert len({a["id"] for a in artists}) == len(artists)
for artist in artists:
    assert artist["name"] and artist["claims"] and set(artist["placeIds"]) <= places.keys()
    assert len({c["id"] for c in artist["claims"]}) == len(artist["claims"])
    for fact in artist["claims"]:
        assert all(fact.get(k) for k in ("id","text","source","publisher","url","locator","checked"))
        assert fact["url"].startswith(("https://","http://"))
print(f"Catalogue and research packets checked. {len(artists)} artist profiles.")
