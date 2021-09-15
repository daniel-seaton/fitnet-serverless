'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const data = JSON.parse(event.body);
  const timestamp = new Date().getTime();

  let names = {},
      values = {},
      expressions = [];

  delete data.iid;
  data['updated'] = timestamp;

  Object.keys(data).forEach((key) => {
    names[`#workoutInstances_${key}`] = key;
    values[`:${key}`] = data[key];
    expressions.push(`#workoutInstances_${key} = :${key}`);
  });

  const params = {
    TableName: process.env.WORKOUTINSTANCE_TABLE,
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
