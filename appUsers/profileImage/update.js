'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const s3Bucket = new AWS.S3({ 
    params: {Bucket: process.env.S3_PROFILE_IMAGE_BUCKET},
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,   
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const Utils = require('../../utils');
const Constants = require('../constants');

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  const buf = Buffer.from(data.base64Encoded.replace(/^data:image\/\w+;base64,/, ""),'base64');

  const params = {
        Key: `${event.pathParameters.uid}/${event.pathParameters.version}/img`,
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    };

    s3Bucket.putObject(params, (error, results) => {
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: `Failed to upload image for user ${event.pathParameters.uid}: ${error}`,
            });
            return;
        }

        console.log(results);

        // update appuser in dynamo db
        const {names, values, expressions} = Utils.mapDataToParams(Constants.EntityName, {
            profileImageVersion: Number(event.pathParameters.version),
            updated: timestamp
        });

        const params = {
            TableName: Constants.TableName,
            Key: {
                uid: event.pathParameters.uid,
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
                    body: `Failed to update appUser ${event.pathParameters.uid}: ${error}`,
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
    });
};
