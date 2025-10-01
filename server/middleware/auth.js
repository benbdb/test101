import { getClient } from "../lib/cognito.js";

export const checkAuth = async (req, res, next) => {
  const client = getClient();
  if (req.session.userInfo) {
    req.isAuthenticated = true;
    req.user = req.session.userInfo;

    console.log(req.session);
    return next();
  }

  // Tokens for API calls (Postman)
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      const userInfo = await client.userinfo(token);
      req.isAuthenticated = true;
      req.user = userInfo;
      return next();
    } catch (error) {
      req.isAuthenticated = false;
    }
  } else {
    req.isAuthenticated = false;
  }

  next();
};
