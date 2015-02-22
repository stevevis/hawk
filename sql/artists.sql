SELECT
  a.id    AS _id,
  a.gid   AS gid,
  a.name  AS name
FROM musicbrainz.release AS r, musicbrainz.artist_credit_name AS acn, musicbrainz.artist AS a,
  musicbrainz.release_group AS rg
WHERE
  r.artist_credit = acn.artist_credit AND a.id = acn.artist AND
  r.language = 120 AND r.status = 1 AND r.release_group = rg.id AND rg.type IN (1, 3)
GROUP BY a.id, a.gid, a.name
ORDER BY a.id ASC
LIMIT 100;
