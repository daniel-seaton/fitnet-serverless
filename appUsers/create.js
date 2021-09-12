'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.APPUSER_TABLE,
    Item: {
      uid: data.uid || uuid.v4(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      username: data.username,
      city: data.city,
      state: data.state,
      height: data.height,
      weightLogs: data.weightLogs,
      profileImageVersion: data.profileImageVersion,
      created: timestamp,
      updated: timestamp,
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: `Couldn\'t create the appUser: ${error}`,
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
