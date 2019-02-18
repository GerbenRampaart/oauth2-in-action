import { Application } from "express";
import path from "path";
import { serve, setup } from "swagger-ui-express";
import { parse } from "yaml";
import * as fs from "fs";

export default function(app: Application, routes: (app: Application) => void) {
  const data = fs.readFileSync(path.join(__dirname, "Api.yaml"), {
    encoding: "UTF8"
  });

  const openApiYaml = parse(data);

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(openApiYaml, null, 2));
  });

  app.get("/api-docs.yaml", (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send(data);
  });

  app.use("/api-docs", serve, setup(openApiYaml));

  app.enable("case sensitive routing");
  app.enable("strict routing");
  // Error handler to display the validation error as HTML
  app.use(function(err, req, res, next) {
    res.status(err.status);
    res.send(
      "<h1>" + err.status + " Error</h1>" + "<pre>" + err.message + "</pre>"
    );
  });

  routes(app);
}
