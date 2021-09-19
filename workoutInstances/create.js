'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const Constants = require('./constants');
const Utils = require('../utils');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const data = JSON.parse(event.body);

  let validationErrors;
  if(validationErrors = Utils.validateData(data, Constants.Validations)){
    console.error(validationErrors);
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain'},
      body: 'Unable to create workout instance: failed validations'
    });
    return;
  }

  const params = {
    TableName: Constants.TableName,
    Item: {
      iid: data.iid,
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
        body: `Unable to create workout instance: ${error}`,
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
