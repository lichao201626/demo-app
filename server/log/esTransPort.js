const Transport = require('winston-transport');
const util = require('util');
const esClient = require('../es/esClient');
//
// Inherit from `winston-transport` so you can take advantage
// of the base functionality and `.exceptions.handle()`.
//
module.exports = class esTransport extends Transport {
	constructor(opts) {
		super(opts);
		//
		// Consume any custom options here. e.g.:
		// - Connection information for databases
		// - Authentication information for APIs (e.g. loggly, papertrail,
		//   logentries, etc.).
		//
	}

	log(info, callback) {
		setImmediate(() => {
			persistLogToEs(info);
			this.emit('logged', info);
		});

		// Perform the writing to the remote service
		callback();
	}
};

async function persistLogToEs(info) {
	try {
		let resObj = await esClient.indexExistP('winstonlog');
		console.log(resObj);
		if (!resObj.resp) {
			await esClient.createIndexP('winstonlog');
		}
		await esClient.savePromise('winstonlog', 'log', info);
	} catch (error) {
		console.log(error);
	}
}
