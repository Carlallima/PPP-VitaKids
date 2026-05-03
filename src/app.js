const path = require("path");

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const apiRoutes = require("./routes");
const { errorHandler, notFoundHandler } = require("./middlewares/errorMiddleware");

function createApp() {
  const app = express();
  const swaggerDocument = YAML.load(path.join(__dirname, "..", "docs", "swagger.yaml"));

  app.use(express.json());
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/api/v1", apiRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp,
};
