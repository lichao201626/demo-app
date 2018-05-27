var Calc = {
    add: function (x, y) {
        return x + y;
    },
    substract: function (x, y) {
        return x - y;
    },
    multiply: function (x, y) {
        return x * y;
    },
    devide: function (x, y) {
        return x / y;
    }
};
Calc.calc = function (command) {
    return Calc[command.type](command.opt1, command.opt2);
};
console.log(Calc.calc({
    type: "add",
    opt1: 6,
    opt2: 2
}));
console.log(Calc.calc({
    type: "substract",
    opt1: 6,
    opt2: 2
}));
console.log(Calc.calc({
    type: "multiply",
    opt1: 6,
    opt2: 2
}));
console.log(Calc.calc({
    type: "devide",
    opt1: 6,
    opt2: 2
}));