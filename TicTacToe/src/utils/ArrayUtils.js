/**
 * Gets a random object element
 *
 * @returns {Object} - returns a random element out of the target object
 */
Array.prototype.getRandomElement = function () {
    return this[Math.floor(Math.random() * this.length)];
}

/**
 * Gets the number of duplicate elements of the specified char
 *
 * @param char {string} - the char to be filtered
 * @returns {int} - number of duplicates
 */
Array.prototype.getNumberOfDuplicates = function (char) {
    var counts = {};
    this.forEach(function(item) {
        if (item === char) {
            counts[item] = ++counts[item] || 1;
        }

    });
    return counts[char];
}

/**
 * Gets the values based on the prop name in the target object
 *
 * @param name {string} - property name
 * @returns {Array} - Returns the list of the values
 */
Array.prototype.getValuesByPropName = function (name) {
    var values = [];
    this.forEach(function(item) {
        if (item.hasOwnProperty(name)) {
            values.push(item[name]);
        }

    });
    return values;
}

/**
 * Gets the index of the first occurrence of the specified property value
 *
 * @param name {string} - the property name
 * @param value {Object} - the value to be searched
 * @returns {number} - the value index
 */
Array.prototype.getFirstIndex = function (name, value) {
    var targetIndex = -1;
    this.forEach(function(item, index) {
        if (item.hasOwnProperty(name) && item[name] === value) {
            targetIndex = index;
        }

    });
    return targetIndex;
}
