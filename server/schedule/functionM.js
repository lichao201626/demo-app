async function getAll(topic, req, callback) {
	try {
		if (!req) {
			console.log('req is not exist');
		}
		if (!topic) {
			console.log('req is not exist');
		}
		callback({ code: 0, message: 'success', data: [ '1' ] });
	} catch (error) {
		callback({ code: 1, message: 'error' });
	}
}
module.exports.getAll = getAll;
