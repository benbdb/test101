import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const PARAMETER_NAME = "/cab432/n10795766/a2";
const REGION = "ap-southeast-2";

let config = null;

export async function loadConfig() {
  if (config) {
    return config;
  }

  try {
    const client = new SSMClient({ region: REGION });
    const response = await client.send(
      new GetParameterCommand({
        Name: PARAMETER_NAME,
      })
    );

    config = JSON.parse(response.Parameter.Value);
    console.log("Configuration loaded from Parameter Store");
    return config;
  } catch (error) {
    console.error("Failed to load config from Parameter Store:", error);
    throw error;
  }
}

export function getConfig() {
  if (!config) {
    throw new Error("Config not loaded. Call loadConfig() first.");
  }
  return config;
}
