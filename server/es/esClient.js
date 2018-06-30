const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
    hosts: ['localhost:9200']
});

exports.createIndexP = (index) => {
    return new Promise((resolve, reject) => {
        client.indices.create({ index }, (err, resp, status) => {
            if (err && !err.message.indexOf('index_already_exist_exception') > 0) {
                reject({ err, resp, status });
            } else {
                resolve({ err, resp, status });
            }
        });
    });
}

exports.savePromise = (index, type, body, refresh) => {
    return new Promise((resolve, reject) => {
        client.index({
            index, type,
            body: {
                ...body,
                '@timestamp': Date.now()
            },
            refresh: refresh || 'true'
        }, (err, resp, status) => {
            if (err) {
                reject({ err, resp, status });
            } else {
                resolve({ err, resp, status });
            }
        });
    });
}

exports.updatePromise = (index, type, id, body, refresh) => {
    return new Promise((resolve, reject) => {
        client.index({
            index, type, id,
            body: {
                ...body,
                '@timestamp': Date.now()
            },
            refresh: refresh || 'true'
        }, (err, resp, status) => {
            if (err) {
                reject({ err, resp, status });
            } else {
                resolve({ err, resp, status });
            }
        });
    });
}

exports.deletePromise = (index, type, id, refresh) => {
    return new Promise((resolve, reject) => {
        client.delete({
            index, type, id,
            refresh: refresh || 'true'
        }, (err, resp, status) => {
            if (err) {
                reject({ err, resp, status });
            } else {
                resolve({ err, resp, status });
            }
        });
    });
}

exports.searchPromise = (index, type, body) => {
    return new Promise((resolve, reject) => {
        client.search({
            index, type, body
        }, (err, resp, status) => {
            if (err) {
                reject({ err, resp, status });
            } else {
                resolve({ err, resp, status });
            }
        });
    });
}