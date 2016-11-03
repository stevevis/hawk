/* eslint no-process-env: "off" */
/* eslint max-len: "off" */

const _ = require("lodash");
const pg = require("pg");

const env = process.env.NODE_ENV = process.env.NODE_ENV || "development";

const base = {
  connect: {
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

const specific = {
  development: {
    connect: {
      host: "52.33.43.252"
    }
  },
  production: {
    connect: {
      host: "172.31.32.22"
    }
  }
};

// Increase the Postgres connection pool size
pg.defaults.poolSize = 40;

module.exports = _.merge(base, specific[env]);
