/* eslint no-process-env: "off", no-console: "off", no-invalid-this: "off" */

import koa from "koa";
import koaViews from "koa-views";
import path from "path";

const DEFAULT_PORT = 3000;

const app = module.exports = koa();
const port = process.env.PORT || DEFAULT_PORT;
app.keys = [process.env.HAWK_APP_SECRET];

console.log(__dirname);
app.use(koaViews(path.join(__dirname, "/../dist/views"), {
  map: {
    html: "handlebars"
  }
}));

app.use(function *index() {
  yield this.render("index");
});

app.listen(port);
console.log(`Server started, listening on port: ${port}`);
console.log(`Server environment: ${app.env}`);
