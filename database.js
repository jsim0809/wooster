const AWS = require('aws-sdk');
const secret = require('./secret.keys.js');

AWS.config.update({
  accessKeyId: secret.AWS_ACCESS_KEY_ID,
  secretAccessKey: secret.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2',
  endpoint: '',
});

// Create a table
const dynamodb = new AWS.DynamoDB();

const params = {
  TableName: "Wooster",
  KeySchema: [
    { AttributeName: "email", KeyType: "HASH" }
  ],
  AttributeDefinitions: [
    { AttributeName: "email", AttributeType: "S" }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 0,
    WriteCapacityUnits: 0
  }
};

dynamodb.createTable(params, (err, data) => {
  if (err) {
      console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
      console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
  }
});


// Write new user to table
const docClient = new AWS.DynamoDB.DocumentClient();

const writeData = (email, spotify_user_id) => {
  const params = {
    TableName: "Wooster",
    Item: {
        "email": email,
        "spotify_user_id": spotify_user_id,
    },
  };
  docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add user", email, ". Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("New user added:", email);
    }
 });
};
