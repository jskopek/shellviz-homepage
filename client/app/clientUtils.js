var _ = require('underscore');

var isValid = function(data, validatorFunction) {
    // takes an array of true/false boolean values and return true if every item is true, false otherwise
    return _.find(_.map(data, validatorFunction), function(validationResult) { return validationResult == false; }) != false;
}
var isJSONObject = function(data) { return _.isObject(data) && !_.isArray(data); }
var isArrayOfObjects = function(data) { return _.isArray(data) && _.every(data, function(val) { return _.isObject(val); }); }
var isArrayOfJSONObjects = function(data) { return _.isArray(data) && _.every(data, function(val) { return isJSONObject(val); }); }
var isArrayOfLabelValuePairs = function(data) { return _.isArray(data) && isValid(data, function(val) { return (val.length == 2) && _.isNumber(val[1]) }); }

/////////////
// Exports //
/////////////
module.exports = {
    'isValid': isValid,
    'isJSONObject': isJSONObject,
    'isArrayOfObjects': isArrayOfObjects,
    'isArrayOfJSONObjects': isArrayOfJSONObjects,
    'isArrayOfLabelValuePairs': isArrayOfLabelValuePairs
}
