let esClient = require('./esClient');
let i = 0;
// reateIndexP('user');

async function testUser() {
	/* 	await esClient.createIndexP('user');
	addUsers(); */
	try {
		let resObj = await esClient.indexExistP('user');
		console.log(resObj);
		let resObj2 = await esClient.indexExistP('xxx');
		console.log(resObj2);
	} catch (error) {
		console.log(error);
	}
}

function addUsers(number) {
	let j = 0;
	while (j < 100) {
		let body = generateUser();
		esClient.savePromise('user', 'name', body).catch((e) => {
			console.log(e);
		});
		j++;
	}
}

function generateUser(user) {
	let sf = {
		user: 'username',
		age: i++
	};
	return user || sf;
}

testUser();
