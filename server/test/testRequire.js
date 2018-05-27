var a = 2;
var b = '2';
var c = -90;
var d = '10';
var e = 'asdfs';
console.log(' 600' > '200123');

console.log('600'.toString() > '200123'.toString());
console.log('600'.valueOf() > '200123'.valueOf());

console.log(isNaN(+'99999999999999999999999999999999999999999'));
var x = parseInt(99999999999999999999999999999999999999999);
console.log(x);
//afdal;
// console.log((99999999999999999999999999999999999999999));
var myAtoi = function(str) {
    //  return Math.max(Math.min(parseInt(str) || 0, 2147483647), -2147483648)

    var result = 0;
    var indicator = 1;
    for(var i = 0; i < str.length;) {
        i = str.find_first_not_of(' ');
        if(str[i] == '-' || str[i] == '+') {
            indicator = (str[i++] == '-') ? -1 : 1;
        }
        while('0' <= str[i] && str[i] <= '9') {
            result = result * 10 + (str[i++] - '0');
            if(result * indicator >= INT_MAX)
                return INT_MAX;
            if(result * indicator <= INT_MIN) return INT_MIN;
        }
        return result * indicator;
    }
};

var x = myAtoi(99999999999999999999999999999999999999999);
console.log(x);

console.log('99999999999999999999999999999999999999999'.valueOf());
