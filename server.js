class Server {
  #express = require("express");
  #app = this.#express();
  constructor(port, dbUrl) {
    this.configureDatabase(dbUrl);
    this.configureApp();
    this.configureRoutes();
    this.start(port);
    this.errorHandler();
  }
  configureApp() {
    const path = require("path");
    const morgan = require("morgan");
    const bodyParser = require("body-parser");

    this.#app.use(this.#express.static(path.join(__dirname, "public")));
    this.#app.use(morgan("dev"));
    this.#app.use(bodyParser.json());
    // this.#app.use(bodyParser.urlencoded({ extended: true }));
  }
  configureDatabase(dbUrl) {
    const mongoose = require("mongoose");
    mongoose
      .connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // autoIndex: true,
        useCreateIndex: true,
      })
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((error) => {
        console.log("Database connection error:", error);
      });
  }
  errorHandler() {
    this.#app.all("*", (req, res, next) => {
      const err = new Error(`Cant't find ${req.originalUrl} on this server!`);
      err.status = "fail";
      err.statusCode = 404;

      next(err);
    });
    this.#app.use((err, req, res, next) => {
      err.statusCode = err.statusCode || 500;
      err.status = err.status || "error";

      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    });
  }
  configureRoutes() {
    const authRoutes = require("./routes/auth");
    const userRoutes = require("./routes/user");

    this.#app.use("/v1/users/auth", authRoutes);
    this.#app.use("/v1/users/", userRoutes);
  }
  start(port) {
    this.#app.listen(port, () => {
      console.log(`App listening on port http://localhost:${port}`);
    });
  }
}

module.exports = Server;
