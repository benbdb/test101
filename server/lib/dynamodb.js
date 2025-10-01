import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const tableName = "a2-pair91";
const sortKey = "userId";

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const docClient = DynamoDBDocumentClient.from(client);

export const addVideoToTable = async (userid, id, fileName) => {
  const command = new PutCommand({
    TableName: tableName,
    Item: {
      userId: userid,
      videoId: id,
      filename: fileName,
    },
  });
  try {
    const response = await docClient.send(command);
  } catch (err) {
    console.log(err);
  }
};

export const getVideoList = async (userid) => {
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: "#partitionKey = :username",
    ExpressionAttributeNames: {
      "#partitionKey": "userId",
    },
    ExpressionAttributeValues: {
      ":username": userid,
    },
  });

  try {
    const response = await docClient.send(command);
    return response.Items;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
