var arrayLeak = [];

var leakFunction = function() {
    arrayLeak.push(new Date());
};

module.exports = leakFunction;
