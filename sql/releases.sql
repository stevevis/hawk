SELECT
  *
FROM
  (SELECT
    r.id            AS _id,
    r.gid           AS gid,
    r.name          AS name,
    rg.gid          AS rgid,
    rc.date_year    AS year,
    rc.date_month   AS month,
    rc.date_day     AS day,
    ROW_NUMBER()
      OVER (PARTITION BY r.name
        ORDER BY rc.date_year ASC NULLS LAST, rc.date_month ASC NULLS LAST, rc.date_day ASC NULLS LAST, r.id ASC)
      AS rank
  FROM musicbrainz.release AS r, musicbrainz.release_group AS rg, musicbrainz.release_country AS rc,
    musicbrainz.artist_credit_name AS acn
  WHERE
    r.release_group = rg.id AND
    rg.type IN (1, 3) AND
    r.artist_credit = acn.artist_credit AND
    r.id = rc.release AND
    acn.artist = $1 AND
    r.language = 120 AND
    r.status = 1 AND
    rc.date_year IS NOT NULL AND
    rc.date_month IS NOT NULL)
  AS s
WHERE s.rank = 1
ORDER BY s.year ASC, s.month ASC, s.day ASC;
