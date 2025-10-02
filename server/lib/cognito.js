import * as openidClient from "openid-client";
import { getConfig } from "../config.js";

let client;
export const initCognitoClient = async () => {
  const config = getConfig();
  const issuer = await openidClient.Issuer.discover(config.ISSUER_URL);
  client = new issuer.Client({
    client_id: config.CLIENT_ID,
    redirect_uris: [config.REDIRECT_URI],
    response_types: ["code"],
    token_endpoint_auth_method: "none",
  });
};

export const getClient = () => client;

export { openidClient };
