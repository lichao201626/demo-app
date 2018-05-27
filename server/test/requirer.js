console.log('inside requirer');

exports.add = function(a, b) {
    console.log('inside add');
    return a + b;
}

var tt = function() {
    setTimeout(() => {
        console.log('setTimeout');
    }, 300);
}
tt();

var arr = ['1', '2', '3', '4', '5'];
console.log(arr.slice(0, 2));
console.log(arr.slice(2, 4));
console.log(arr.slice(4, 5));
