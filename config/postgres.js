"use strict";

var PostgresConfig = {
  connect: {
    //host: "54.85.70.179",
    host: "172.30.1.209",
    user: "musicbrainz",
    password: "musicbrainz",
    database: "musicbrainz_db"
  },
  commands: {
    cleanup: "dropdb -U musicbrainz musicbrainz_db; rm -rf /tmp/MBImport*",
    downloadDumps: "ruby ~/musicbrainz_db_download/database_downloader.rb",
    createDatabase: "cd musicbrainz-server; nohup ./admin/InitDb.pl --createdb --import /tmp/dumps/mbdump*.tar.bz2 > initdb.log &",
    checkInitDbProcess: "ps aux | grep InitDb | grep -v grep | wc -l",
    getLastLineOfLog: "tail -n 1 ~/musicbrainz-server/initdb.log"
  }
};

module.exports = PostgresConfig;
