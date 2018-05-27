var Big = require('big.js');

/* console.log(isNaN('-0x100'));
console.log(parseInt('999999999999999999'));
console.log(Number.POSITIVE_INFINITY);
console.log(Number.POSITIVE_);
console.log(Number.isInteger(-0x5));
console.log(Number.isInteger('100')); */
var x = '-0x100';

var a = true;
var b = '';
var c = '99999999999999999999';
var d = '199999999999999999999';
var e = '-9999999999999999999911';
var f = '-9999999999999999995911'
console.log(isNaN(true));
console.log((typeof true) == 'boolean');


function auto(a, b, oper) {
    if (isNaN(+a) || isNaN(+b)) {
        return false;
    }
    console.log('wwwwwwwwwwwwwwwwww');
    if (oper == '>') {
        return a == b ? false : Big(a.toString()).gt(Big(b.toString()));
    }
    if (oper == '>=') {
        return a == b ? true : Big(a.toString()).gte(Big(b.toString()));
    }

    if (oper == '<') {
        return a == b ? false : Big(a.toString()).lt(Big(b.toString()));
    }
    if (oper == '<=') {

        return a == b ? true : Big(a.toString()).lte(Big(b.toString()));
    }
    return false;

}
console.log(auto(a, b, '>'));
console.log(auto(a, c, '>'));
console.log(auto(b, c, '>'));
console.log(auto(a, d, '>'));
console.log(auto(b, d, '>'));
console.log(auto(e, d, '>'));
console.log('########################');
console.log(auto(a, b, '<'));
console.log(auto(a, c, '<'));
console.log(auto(b, c, '<'));
console.log(auto(a, d, '<'));
console.log(auto(b, d, '<'));
console.log(auto(e, d, '<'));