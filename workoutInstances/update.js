'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const Utils = require('../utils');
const Constants = require('./constants');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const data = JSON.parse(event.body);
  const timestamp = new Date().getTime();

  let validationErrors;
  if(validationErrors = Utils.validateData(data, Constants.Validations)){
    console.error(validationErrors);
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain'},
      body: 'Unable to create the appUser: failed validations'
    });
    return;
  }

  delete data.iid;
  data['updated'] = timestamp;

  const {names, values, expressions} = Utils.mapDataToParams(Constants.EntityName, data);

  const params = {
    TableName: Constants.TableName,
    Key: {
      iid: event.pathParameters.iid,
    },
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    UpdateExpression: `SET ${expressions.join(', ')}`,
    ReturnValues: 'ALL_NEW',
  };

  console.log(`updating instance ${event.pathParameters.iid}: ${JSON.stringify(data)}`);

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: `Failed to update instance ${event.pathParameters.iid}: ${error}`,
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
