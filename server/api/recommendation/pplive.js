import sparqlTransformer from 'sparql-transformer';
import getJSON from 'get-json22';
import {
  EXT_URI
} from '../../../config/constants';

const RECOMMENDER = EXT_URI.RECOMMENDER;
const TYPE_MAP = {
  'concert': 'efrbroo:F31_Performance',
  'work': 'efrbroo:F22_Self-Contained_Expression'
};

function recs2obj(rec, key = 'similar') {
  return sparqlTransformer({
    proto: [{
      id: '?id',
      // track: '$efrbroo:R66_included_performed_version_of',
      match: key,
      score: rec.score + '',
      trackSet: {
        '@type': 'VideoObject',
        id: '?vo$required',
        pp_id: '$dct:identifier$required'
      }
    }],
    '$where': ['?vo mus:U51_is_partial_or_full_recording_of / mus:U54_is_performed_expression_of ?id'],
    '$values': {
      'id': rec.uri
    },
    '$limit': 1
  }, {
    endpoint: 'http://data.doremus.org/sparql',
    debug: true
  }).then(result => result[0]);
}

function reduceToTrackSet(results, id, n) {
  'use strict';
  var merged = results.item.reduce((acc, x) => {
    acc[x.id] = Object.assign(acc[x.id] || {}, x);
    return acc;
  }, {});

  delete merged[id];

  results.item = Object.values(merged).slice(0, n);
  return results;
}

function recNpack(_seed, id, n, focus) {
  'use strict';

  let _n = n ? _n = '&n=' + (n * 3) : '';
  let _focus = focus ? _focus = '&focus=' + focus : '';

  return getJSON(`${RECOMMENDER}/expression${_seed}?target=pp${_n}${_focus}`)
    .then(r => packGroup(r, focus))
    .then(r => reduceToTrackSet(r, id, n));
}


function packGroup(recs, focus) {
  'use strict';
  let _promises = recs.map(x => recs2obj(x, focus));
  return Promise.all(_promises)
    .then(results => {
      return {
        match: results[0].match,
        item: results.map(r => ({
          work: r.id,
          score: parseFloat(r.score),
          '@type': 'VideoObject',
          id: r.trackSet && r.trackSet.pp_id,
          'doremus_uri': r.trackSet && r.trackSet.id
        }))
      };
    });
}

export default class PPLiveRecommender {
  static recommend(req, res) {
    let id = req.params.id,
      type = req.params.type;

    var seed;
    sparqlTransformer({
        proto: {
          id: '?id',
          'pp_id': '$dc:identifier|dct:identifier$required$var:pp_id',
          works: '$efrbroo:R66_included_performed_version_of$sample'
        },
        '$where': [
          `?id a ${TYPE_MAP[type]}`
        ],
        '$values': {
          'pp_id': id
        },
        '$limit': 1
      }, {
        endpoint: 'http://data.doremus.org/sparql',
        debug: true
      }).then(rs => {
        if (!rs[0])
          throw Error(`id ${id} for type ${type.toUpperCase()} not found`);

        let doremusUri = rs[0].id;
        let works = rs[0].works || doremusUri;

        // for now 1 use the first work as seed
        seed = Array.isArray(works) ? works[0] : works;
        let _seed = seed.substring(seed.lastIndexOf('/'));

        var n = req.query.n;

        return Promise.all([
          recNpack(_seed, id, n),
          recNpack(_seed, id, n, 'genre'),
          recNpack(_seed, id, n, 'period'),
          recNpack(_seed, id, n, 'composer'),
          recNpack(_seed, id, n, 'casting'),
          recNpack(_seed, id, n, 'surprise'),
        ]);
      })
      .then(results =>
        res.json({
          seed,
          results
        }))
      .catch(e => {
        res.status(500);
        res.json({
          'error': e.message
        });
      });
  }
}
