

/* validationParams should look like this: {
    key: {
        required: bool
        type: String
    }
}
we can add more params as we think of other validations we want to add
    - Maybe a jwt validation for the uid? this should probably be in the apigatewayauthorizer preauth lambda
    - Maybe a workout exists validation for wid on instance?
    - Maybe a id doesn't already exist validation (although dynamo might be able to handle this automatically)
    - Maybe a uuid validation for any uuids?
    - maybe a start date < end date validation?
*/
module.exports.validateData = (data, validations) => {
    const validationErrors = {};

    if (!data) {
        validationErrors['missingData'] = `Data cannot be null`;
        return validationErrors;
    }

    Object.keys(validations).forEach(key => {
        const validation = validations[key];
        if (validation.required && !data[key]) {
            validationErrors[`${key}Required`] = `Missing required value ${key}`;
        }

        if(data[key] && typeof data[key] != validation.type){
            validationErrors[`${key}TypeMismatch`] = `Expected ${validation.type} recieved ${typeof data[key]}`;
        }
    });

    const invalidProperties = Object.keys(data).filter((prop) => !Object.keys(validations).some((key) => key === prop));
    if (invalidProperties.length > 0) {
        validationErrors[`invalidProperty`] = `Invalid properties: ${invalidProperties.join(", ")}`;
    }

    return Object.keys(validationErrors) > 0 ? validationErrors : null;
};