/* let headerMapping = {
    'zqlx': 'zqlx',
    'zqmc': 'zqmc',
    'zqdm': 'zqdm',
    'fxjg': 'fxjg',
    'mz': 'mz',
    'fxr': 'fxr',
    'dqr': 'dqr',
    'zqcq': 'zqcq',
    'dcq': 'dcq',
    'zt': 'zt',
    'xyjgpj': 'xyjgpj',
    'xypj': 'xypj',
    'xydjyxr': 'xydjyxr',
    'xydjyxzzr': 'xydjyxzzr',
    'xpxx-xplx': 'xpxx-xplx',
    'xpxx-fxpl': 'xpxx-fxpl',
    'xpxx-jsff': 'xpxx-jsff',
    'xpxx-jjjz': 'xpxx-jjjz',
    'xpxx-qxr': 'xpxx-qxr',
    'xpxx-scfxr': 'xpxx-scfxr',
    'fxjgjc-zw': 'fxjgjc-zw',
    'tgjg': 'tgjg',
    'bz': 'bz',
    'ltfw': 'ltfw',
    'tsz': 'tsz',
    'dqwyz': 'dqwyz'
}
 */
/**
 * using steps:
 * 1. change the first line of the csv header to the name of the es 
 * 2. config the es host name, index name, type, mapper in this script
 * 3. change the originFile and tempFile in this script
 * 4. change the fromEncode and toEncode in this script
 * 5
 */

let hostName = 'localhost:9200';
let logLeverl = 'info';
// must be lower case
let indexName = 'tempindex';
let typeName = 'typename';
let mapper = {
    "properties": {
        "dqr": {
            "type": "text",
        },
        "fxr": {
            "type": "text",
        },
        "xpxx-qxr": {
            "type": "text",
        },
        "xpxx-scfxr": {
            "type": "text",
        }
    }
};
// the full path csv file
let originFile = '/home/jack/Downloads/zqxx.csv';
// the temp path csv file generated using utf8 encoding, delete the file after the script
let tempFile = '/home/jack/Downloads/abc.csv';

let fromEncode = 'gbk';
let toEncode = 'utf8';

const csv = require("csvtojson");
const _ = require('lodash');
const elasticsearch = require('elasticsearch');
let client = new elasticsearch.Client({
    host: hostName,
    log: logLeverl
});

let fs = require('fs');
let iconv = require("iconv-lite");

async function importJsonArrayToES() {
    console.log('start import!!');
    // skip this if there is no encoding issue
    await changeFileEncode(fromEncode, toEncode);
    // let jsonArray = await csvToJson(tempFile);
    let jsonArray = await csv().fromFile(tempFile);
    let ifExist = await indexExist(indexName);
    if(!ifExist) {
        await creatIndex(indexName);
        // skip this is there is no date mapping issue
        await setMapper();
    }
    console.log(jsonArray.length);
    await saveES(jsonArray);
    console.log('import success!!');
}
importJsonArrayToES();

function readFile(file) {
    return new Promise((resole, reject) => {
        fs.readFile(file, (error, data) => {
            if(error) {
                reject(error);
            } else {
                resole(data);
            }
        });
    });
}

function writeFile(file, data, encode) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, iconv.encode(data, 'utf8'), (error) => {
            if(error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function changeFileEncode(fromEncode, toEncode) {
    let buffer = await readFile(originFile);
    let data = iconv.decode(buffer, fromEncode);
    await writeFile(tempFile, data, toEncode);
}

function saveES(jsonArray) {
    return new Promise((resolve, reject) => {
        let result = splitArraysByBulkSize(jsonArray);
        result.forEach(res => {
            let preparedJsonArray = prepareBulk(res);
            bulkSave(preparedJsonArray);
        });
        resolve();
    });
}

function splitArraysByBulkSize(jsonArray) {
    let total = jsonArray.length;
    let bulkSize = 3000;
    let result = [];
    for(i = 0; i <= total; i += bulkSize) {
        if(i + bulkSize > total) {
            result.push(jsonArray.slice(i, total));
        } else {
            result.push(jsonArray.slice(i, i + bulkSize));
        }
    }
    return result;
}

/* { "index" : { "_index" : "test", "_type" : "_doc", "_id" : "1" } }
{ "field1" : "value1" } */
function prepareBulk(jsonArray) {
    let preparedJsonArray = [];
    let headerLine = { "index": { "_index": indexName, "_type": typeName } };
    for(let i = 0; i < jsonArray.length; i++) {
        preparedJsonArray.push(headerLine);
        preparedJsonArray.push(jsonArray[i]);
    }
    return preparedJsonArray;
}

function creatIndex(indexName) {
    return new Promise((resolve, reject) => {
        client.indices.create({ index: indexName }, (error, resp, status) => {
            if(error) {
                reject(error);
            } else {
                resolve(resp);
            }
        });
    });
}

// used for data time format 
function setMapper() {
    return new Promise((resolve, reject) => {
        client.indices.putMapping({
                updateAllTypes: true,
                index: indexName,
                type: typeName,
                allowNoIndices: true,
                body: mapper
            },
            (error, resp, status) => {
                if(error) {
                    reject(error);
                } else {
                    resolve(resp);
                }
            });
    });
}

function indexExist(indexName) {
    return new Promise((resolve, reject) => {
        client.indices.exists({ index: indexName }, (error, resp, status) => {
            if(error) {
                reject(error);
            } else {
                resolve(resp);
            }
        });
    });
}

function bulkSave(records) {
    return new Promise((resolve, reject) => {
        flattenRecords = _.flatten(records);
        client.bulk({
            maxRetries: 5,
            index: indexName,
            type: typeName,
            body: flattenRecords,
            refresh: "true"
        }, (err, resp, status) => {
            if(err) {
                reject(err);
            } else {
                resolve(resp);
            }
        });
    });
}
