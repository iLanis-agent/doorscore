/* DoorScore engine - multi-criteria decision math, pure functions.
   The problem: eight apartment viewings blur into "the one with the nice
   kitchen". Score every visit on weighted criteria the same day, and one
   deal-breaker flag beats a pretty average. */
(function (global) {
  'use strict';

  function round2(x) { return Math.round(x * 100) / 100; }

  // criteria: [{id, name, weight 1-5}]
  // scores: {criteriaId: 1-10}
  // Weighted score normalized to 0-100. Unscored criteria are excluded from
  // the denominator (scoring in progress shouldn't tank the total).
  function weightedScore(criteria, scores) {
    var num = 0, den = 0;
    criteria.forEach(function (c) {
      var s = scores[c.id];
      if (typeof s === 'number' && s >= 1 && s <= 10) {
        num += c.weight * s;
        den += c.weight;
      }
    });
    if (!den) return null;
    return round2(num / den * 10); // (weight*1..10)/(weight) -> 1..10 -> *10 = 10..100
  }

  // Any scored criterion at or below the threshold is a deal-breaker,
  // no matter how good the weighted total looks.
  function dealBreakers(criteria, scores, threshold) {
    threshold = threshold === undefined ? 3 : threshold;
    return criteria.filter(function (c) {
      var s = scores[c.id];
      return typeof s === 'number' && s <= threshold;
    }).map(function (c) { return c.name; });
  }

  // Rank apartments: [{id, name, scores}] -> sorted [{id, name, score, breakers, verdict}]
  function rank(criteria, apartments, threshold) {
    return apartments.map(function (a) {
      var score = weightedScore(criteria, a.scores);
      var breakers = dealBreakers(criteria, a.scores, threshold);
      return { id: a.id, name: a.name, score: score, breakers: breakers, verdict: verdict(score, breakers) };
    }).sort(function (x, y) {
      // apartments with deal-breakers sink below clean ones; then by score
      var bx = x.breakers.length ? 1 : 0, by = y.breakers.length ? 1 : 0;
      if (bx !== by) return bx - by;
      return (y.score === null ? -1 : y.score) - (x.score === null ? -1 : x.score);
    });
  }

  function verdict(score, breakers) {
    if (breakers && breakers.length) return 'flagged';
    if (score === null) return 'unscored';
    if (score >= 80) return 'contender';
    if (score >= 65) return 'maybe';
    if (score >= 50) return 'backup';
    return 'pass';
  }

  var api = { weightedScore: weightedScore, dealBreakers: dealBreakers, rank: rank, verdict: verdict };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.DoorScore = api;
})(typeof window !== 'undefined' ? window : globalThis);
