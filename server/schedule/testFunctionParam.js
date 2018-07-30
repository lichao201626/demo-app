/* var fm = require('./functionM');
let callback = (x) => {
	console.log(x);
};
fm.getAll(undefined, null, callback);
 */

let error = new Error('sdfasdfa');
let x = {
	err: error
};
let res = { message: x };
console.log(res.message);

/* function getAllP() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			new Exception('test error');
			console.log('123');
			resolve({});
		}, 600);
	});
}

async function getP() {
	try {
		setTimeout(() => {
			console.log('hello world');
		}, 7700);
		// let res = await getAllP();
		if (res.error) {
			reject(res);
		} else {
			resolve(res);
		}
	} catch (x) {
		console.log('XXXXXXXXXXXXXXXx', x);
	}
}

async function ff() {
	try {
		await getP();
		console.log('ZZZZZZZZZZZZZZZZZZZZZ');
	} catch (y) {
		console.log('YYYYYYYYYYY', y);
	}
}

ff();
 */
