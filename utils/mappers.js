


module.exports.mapDataToParams = (entityName, data) => {
    let names = {},
        values = {},
        expressions = [];

    Object.keys(data).forEach((key) => {
        names[`#${entityName}_${key}`] = key;
        values[`:${key}`] = data[key];
        expressions.push(`#${entityName}_${key} = :${key}`);
    });

    return {names, values, expressions};
};