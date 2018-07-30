var schedule = require('node-schedule');

// method 1
/* var j = schedule.scheduleJob('1 * * * * *', () => {
	console.log('XXXXXXXXXXXXXXXXXX');
}); */

// j.invoke();
// j.schedule();
// method 2
/* var j = schedule.scheduleJob({ hour: 13, minute: 38, dayOfWeek: 0 }, function() {
	console.log('Time for tea!');
});
 */
/* var j1 = schedule.scheduleJob({ hour: 13, minute: 53, dayOfWeek: 0 }, function() {
	console.log('Time for tea!');
});
j1.cancel();
var j2 = schedule.scheduleJob({ hour: 14, minute: 19, dayOfWeek: 0 }, function(fireDate) {
	console.log('Time for tea! j2');
	console.log(fireDate);
});

console.log(new Date().toJSON());
for (let i = 0; i < 1000000; i++) {
	for (let j = 0; j < 200000; j++) {}
}
console.log(new Date().toJSON()); */

var date = new Date(2018, 06, 29, 14, 33, 0);
console.log(date);
var x = 'Tada!';
var j = schedule.scheduleJob(
	date,
	function(y) {
		console.log(y);
	}.bind(null, x)
);
var j2 = schedule.scheduleJob({ hour: 14, minute: 19, dayOfWeek: 0 }, function(fireDate) {
	console.log('Time for tea! j2');
	console.log(fireDate);
});
x = 'Changing Data';

// j.cancel();
console.log(j2);
let map1 = new Map();
map1.set('xx', j2);
console.log(map1);
let obj = map1.get('xx');
console.log(obj);
obj.cancel();
