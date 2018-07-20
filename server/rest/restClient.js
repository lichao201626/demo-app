const http = require('http');

function prepareReqOptions(body) {
	const agent = new http.agent({ keepAlive: false });
	let options = {
		hostname: body.hostname,
		port: body.port,
		path: body.path,
		headers: body.headers,
		method: body.method || 'POST',
		agent
	};
	return options;
}

function postHttpRequestP(hostname, port, path, body) {
	return new Promise((resolve, reject) => {
		let postData = JSON.stringify(body);
		let headers = {
			'Content-Type': 'Application/json',
			'Content-Length': Buffer.byteLength(postData)
		};
		let postOptions = {
			hostname,
			port,
			path,
			headers
		};

		let options = prepareReqOptions(postOptions);
		if (options) {
			const request = http.request(options, (res) => {
				res.setEncoding('utf8');
				let body = '';
				res.on('data', (chunk) => {
					body += chunk;
				});
				res.on('end', () => {
					resolve({ body });
				});
			});
			request.on('error', (error) => {
				reject({ error });
			});
			// write data to request body
			request.write(postData);
			request.end();
		} else {
			reject({ options });
		}
	});
}
exports.postHttpRequestP = postHttpRequestP;
