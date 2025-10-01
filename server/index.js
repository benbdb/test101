import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import { initCognitoClient } from "./lib/cognito.js";
import { __dirname } from "./utils.js";
import routes from "./routes/index.js";
import { upload } from "./lib/multer.js";
import { loadConfig, getConfig } from "./config.js";
import secret from "./secrets.js";

// Load configuration from Parameter Store
await loadConfig();
const config = getConfig();

const PORT = config.PORT;
const app = express();

await initCognitoClient();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(routes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
