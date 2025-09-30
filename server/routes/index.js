import { Router } from "express";
import { checkAuth } from "../middleware/auth.js";
import authRoutes from "./auth.routes.js";
import videoRoutes from "./videos.routes.js";
import path from "path";
import { __dirname } from "../utils.js";

const router = Router();

router.get("/", checkAuth, (req, res) => {
  console.log("Session data:", req.session);
  console.log("Is authenticated:", req.isAuthenticated);
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  //res.render("home", {
  //isAuthenticated: req.isAuthenticated,
  //userInfo: req.session.userInfo,
  //});
});

router.use(authRoutes);
router.use(videoRoutes);

export default router;
