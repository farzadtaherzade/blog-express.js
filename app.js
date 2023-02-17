require("dotenv").config();
const Server = require("./server");
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

new Server(PORT, DB_URL);
