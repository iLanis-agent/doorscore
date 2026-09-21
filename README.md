# DoorScore

Apartment hunting fails on memory, not math: by the eighth viewing, every place is
"the one with the nice kitchen" and the actual deal-breakers are gone. DoorScore is a
viewing-day scorecard - define your criteria and their weights, rate each apartment
1-10 right after the visit, and the leaderboard ranks them on weighted score with one
important rule: a 3-or-less on any single criterion flags the whole place as a
deal-breaker, no matter how pretty the average.

- Custom criteria with 1-5 weights (defaults: price, commute, space, light, noise, vibe)
- Weighted score normalized to 0-100; partial scoring waits instead of tanking totals
- Deal-breaker flags beat weighted average
- No signup, nothing to install - pure static HTML/JS; everything persists in `localStorage`
- `engine.js` holds the scoring and ranking math as pure functions, shared between the
  app and node tests

## Use it

Open `index.html`, or visit the deployed site.

## Run locally

Any static server works:

```
python3 -m http.server
```

Then open http://localhost:8000/.

## Engine tests

The node suite covers weighted scoring (full, partial, equal-weight, empty),
deal-breaker detection (threshold edges, multiples, unscored-is-clean), ranking
(flagged sinks below clean regardless of score), and all verdict tiers.
