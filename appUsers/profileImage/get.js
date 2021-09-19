'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const s3Bucket = new AWS.S3({ 
    params: {Bucket: process.env.S3_PROFILE_IMAGE_BUCKET},
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,   
});

module.exports.get = (event, context, callback) => {

    const params = {
        Key: `${event.pathParameters.uid}/${event.pathParameters.version}/img`,
    }
  
    s3Bucket.getObject(params, (error, results) => {
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: `Failed to get profile image for appUser ${event.pathParameters.uid}: ${error}`,
            });
            return;
        }

        console.log(results.Body.toString('base64'));

        callback(null, {
            statusCode: 200,
            body: `${results.Body.toString('base64')}`
        });
    });
};