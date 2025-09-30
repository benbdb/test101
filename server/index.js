import express from "express";
import session from "express-session";
import path from "path";
import { initCognitoClient } from "./lib/cognito.js";
import { __dirname } from "./utils.js";
import routes from "./routes/index.js";
import { upload } from "./lib/multer.js";

const PORT = process.env.PORT;
const app = express();

await initCognitoClient();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
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
