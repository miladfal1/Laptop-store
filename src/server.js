require("dotenv").config();
const fs = require("fs");
const https = require("https");
const express = require("express");
const path = require("path");
const cookieparser = require("cookie-parser");
const flash = require("connect-flash");
const helmetConfig = require("./config/helmet.config");
const connectDB = require("./config/db.config");
const {
  categoryRouter,
  itemRouter,
  orderRouter,
  uploadRouter,
  userRouter,
  adminRouter,
  tokenRouter,
} = require("./routes/index");
const { loadCategories } = require("./middleware/auth.middleware");
const sessionConfig = require("./config/session.config");

const app = express();
const PORT = 3000;

const privateKey = fs.readFileSync("C:\\Program Files\\OpenSSL-Win64\\bin\\private.key", "utf8");
const certificate = fs.readFileSync("C:\\Program Files\\OpenSSL-Win64\\bin\\certificate.crt", "utf8");

const credentials = { key: privateKey, cert: certificate };

app.use(helmetConfig(process.env.NODE_ENV));

connectDB();

require("./cronJobs/clearEpiredIps");
require("./cronJobs/backup");
require("./config/cors.config")(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(sessionConfig);
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(loadCategories);

// Route definitions
app.use("/", adminRouter);
app.use("/", userRouter);
app.use("/", itemRouter);
app.use("/", categoryRouter);
app.use("/", orderRouter);
app.use("/", tokenRouter);
app.use("/uploads", uploadRouter);

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`server is runing on port ${PORT}`);
});
