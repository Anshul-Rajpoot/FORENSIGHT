require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const { router: authRoutes } = require("./routes/auth");
const { router: apiRoutes } = require("./routes/api");
const { requireAuth, requireAdmin } = require("./routes/middleware");

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "dev-only-change-this",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

if (process.env.MONGO_CONNECTION_STRING) {
  sessionOptions.store = MongoStore.create({
    mongoUrl: process.env.MONGO_CONNECTION_STRING,
    collectionName: "sessions",
    dbName: process.env.MONGO_DB_NAME || "face_recognition_db",
  });
}

app.use(session(sessionOptions));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

app.get("/login", (req, res) =>
  res.render("login", { queryError: req.query.error, created: req.query.created }),
);
app.get("/signup", (req, res) => res.render("signup", { queryError: req.query.error }));

app.get("/", requireAuth, (req, res) => res.render("home"));
app.get("/app", requireAuth, (req, res) => res.render("editor"));
app.get("/results", requireAuth, (req, res) => res.render("results"));
app.get("/members", requireAuth, (req, res) => res.render("members"));
app.get("/upload", requireAdmin, (req, res) => res.render("admin-upload"));

app.get("/api/health", async (req, res) => {
  res.json({ ok: true, mongo: mongoose.connection.readyState === 1 });
});

app.use((req, res) => res.status(404).send("Page not found"));

async function start() {
  if (process.env.MONGO_CONNECTION_STRING) {
    try {
      await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
        serverSelectionTimeoutMS: 5000,
        dbName: process.env.MONGO_DB_NAME || "face_recognition_db",
      });
      console.log("MongoDB connected");
    } catch (err) {
      console.error("MongoDB connection failed:", err.message);
      console.log("Server will still start, but database features will not work.");
    }
  } else {
    console.log("MONGO_CONNECTION_STRING is not set.");
  }

  app.set("trust proxy", 1);
  if (process.env.NODE_ENV === "production") sessionOptions.cookie.secure = true;

  app.listen(PORT, () => {
    console.log(`FORENSIGHT running at http://localhost:${PORT}`);
  });
}

start();
