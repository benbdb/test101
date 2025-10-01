import { Router } from "express";
import { getClient, openidClient } from "../lib/cognito.js";
import { getConfig } from "../config.js";

const router = Router();

router.get("/login", (req, res) => {
  const config = getConfig();
  const client = getClient();
  const nonce = openidClient.generators.nonce();
  const state = openidClient.generators.state();

  req.session.nonce = nonce;
  req.session.state = state;

  const authUrl = client.authorizationUrl({
    scope: config.OAUTH_SCOPES,
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
    const config = getConfig();
    const client = getClient();
    const params = client.callbackParams(req);
    const tokenSet = await client.callback(config.REDIRECT_URI, params, {
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
  const config = getConfig();
  req.session.destroy();
  const logoutUrl = config.LOGOUT_URL;
  res.redirect(logoutUrl);
});

export default router;
