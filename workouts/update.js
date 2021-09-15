'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  let names = {},
      values = {},
      expressions = [];

  delete data.wid;
  data['updated'] = timestamp;

  Object.keys(data).forEach((key) => {
    names[`#workouts_${key}`] = key;
    values[`:${key}`] = data[key];
    expressions.push(`#workouts_${key} = :${key}`);
  });

  const params = {
    TableName: process.env.WORKOUT_TABLE,
    Key: {
      wid: event.pathParameters.wid,
    },
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    UpdateExpression: `SET ${expressions.join(', ')}`,
    ReturnValues: 'ALL_NEW',
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: `Couldn't update workout instane ${event.pathParameters.wid}: ${error}`,
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
