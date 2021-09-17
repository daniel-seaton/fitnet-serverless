

module.exports.Validations = {
    wid: {
        required: true,
        type: 'string'
    },
    uid: {
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

module.exports.TableName = process.env.WORKOUT_TABLE;

module.exports.EntityName = 'workouts';