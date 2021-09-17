

module.exports.Validations = {
    iid: {
        required: true,
        type: 'string'
    },
    uid: {
        required: true,
        type: 'string'
    },
    wid: {
        required: true,
        type: 'string'
    },
    start: {
        type: 'number'
    },
    end: {
        type: 'number'
    },
    steps: {
        type: 'object'
    }
}

module.exports.TableName = process.env.WORKOUTINSTANCE_TABLE;

module.exports.EntityName = 'workoutInstances';