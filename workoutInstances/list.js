'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const Constants = require('./constants');
const Utils = require('../utils');

module.exports.list = (event, context, callback) => {
  const params = {
    TableName: Constants.TableName,
    IndexName: 'wid_Index',
    KeyConditionExpression: 'wid = :wid',
    ExpressionAttributeValues: { ':wid': event.pathParameters.wid },
    ScanIndexForward: false
  };

  // fetch all todos from the database
  dynamoDb.query(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: `Couldn\'t fetch the instances: ${error}`,
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
