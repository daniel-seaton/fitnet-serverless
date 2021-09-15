'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.WORKOUTINSTANCE_TABLE,
    Item: {
      iid: data.iid || uuid.v4(),
      uid: data.uid,
      wid: data.wid,
      start: data.start,
      end: data.end,
      steps: data.steps
    },
  };

  console.log(`adding instance ${data.iid}: ${JSON.stringify(params.Item)}`);

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
