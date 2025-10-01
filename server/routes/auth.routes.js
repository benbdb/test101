import { Router } from "express";
import { getClient, openidClient } from "../lib/cognito.js";

const router = Router();

router.get("/login", (req, res) => {
  const client = getClient();
  const nonce = openidClient.generators.nonce();
  const state = openidClient.generators.state();

  req.session.nonce = nonce;
  req.session.state = state;

  const authUrl = client.authorizationUrl({
    scope: process.env.OAUTH_SCOPES,
    state: state,
    nonce: nonce,
  });

  res.redirect(authUrl);
});

router.get("/me", (req, res) => {
  if (req.session.userInfo) {
    res.json({ authenticated: true, user: req.session.userInfo });
  } else {
    res.json({ authenticated: false });
  }
});

router.get("/callback", async (req, res) => {
  try {
    const client = getClient();
    const params = client.callbackParams(req);
    const tokenSet = await client.callback(process.env.REDIRECT_URI, params, {
      nonce: req.session.nonce,
      state: req.session.state,
    });

    const claims = tokenSet.claims();
    console.log("ID Token Claims:", claims);
    console.log("User Groups:", claims["cognito:groups"]);

    const userInfo = await client.userinfo(tokenSet.access_token);
    req.session.userInfo = userInfo;
    req.session.userInfo.userGroups = claims["cognito:groups"];

    res.redirect("/");
  } catch (err) {
    console.error("Callback error:", err);
    res.redirect("/");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  const logoutUrl = process.env.LOGOUT_URL;
  res.redirect(logoutUrl);
});

export default router;
