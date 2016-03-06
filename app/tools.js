/**
 * Random function
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
function random (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}