import * as openidClient from "openid-client";

let client;
// Initialize OpenID Client
export const initCognitoClient = async () => {
  const issuer = await openidClient.Issuer.discover(process.env.ISSUER_URL);
  client = new issuer.Client({
    client_id: process.env.CLIENT_ID,
    //client_secret: "long secret",
    redirect_uris: [process.env.REDIRECT_URI],
    response_types: ["code"],
    token_endpoint_auth_method: "none",
  });
};

export const getClient = () => client;

export { openidClient };
