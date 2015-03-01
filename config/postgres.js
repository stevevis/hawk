"use strict";

var pg = require("pg");

var PostgresConfig = {
  connect: {
    host: "172.30.1.209",
    //host: "52.0.223.32",
    user: "musicbrainz",
    password: "musicbrainz",
    database: "musicbrainz_db"
  },
  commands: {
    cleanup: "dropdb -U musicbrainz musicbrainz_db; rm -rf /tmp/MBImport*",
    downloadDumps: "download_mbdumps", // This lives in the gem mbdump_downloader
    createDatabase: "cd musicbrainz-server; nohup ./admin/InitDb.pl --createdb --import /tmp/dumps/mbdump*.tar.bz2 > initdb.log &",
    checkInitDbProcess: "ps aux | grep InitDb | grep -v grep | wc -l",
    getLastLineOfLog: "tail -n 2 ~/musicbrainz-server/initdb.log"
  }
};

// Increase the Postgres connection pool size
pg.defaults.poolSize = 40;

module.exports = PostgresConfig;
