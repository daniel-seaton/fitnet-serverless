'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const Constants = require('./constants');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  let validationErrors;
  if(validationErrors = Utils.validateData(data, Constants.Validations)){
    console.error(validationErrors);
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain'},
      body: 'Unable to create workout: failed validations'
    });
    return;
  }

  const params = {
    TableName: Constants.TableName,
    Item: {
      wid: data.wid || uuid.v4(),
      uid: data.uid,
      name: data.name,
      steps: data.steps || [],
      defaultFormat : data.defaultFormat,
      created: timestamp,
      updated: timestamp,
    },
  };

  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: `Unable to create workout: ${error}`,
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
