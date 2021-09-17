
module.exports.Validations = {
    uid: {
        required: true,
        type: 'string'
    },
    email: {
        required: true,
        type: 'string'
    },
    password: {
        required: true,
        type: 'string'
    },
    firstName: {
        type: 'string'
    },
    lastName: {
        type: 'string'
    },
    city: {
        type: 'string'
    },
    state: {
        type: 'string'
    },
    height: {
        type: 'number'
    },
    weightLogs: {
        type: 'object'
    },
    profileImageVersion: {
        type: 'number'
    }
};

module.exports.TableName = process.env.APPUSER_TABLE;

module.exports.EntityName = 'appUsers';