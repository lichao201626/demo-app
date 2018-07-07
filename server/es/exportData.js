let esClient = require('./esClient');



async function getData() {
    try {
        let res = await esClient.searchPromise('user', 'name', {});

        console.log(res.resp.hits.hits);
        console.log(res.resp.hits.total);
        console.log(res.resp.hits.hits.length);
    } catch (error) {
        console.log(error);
    }
}
getData();

let XLSX = require('xlsx');
var wb = XLSX.utils.book_new();
var new_ws_name = "SheetJS";

/* make worksheet */
var ws_data = [
    ["S", "h", "e", "e", "t", "J", "S"],
    [1, 2, 3, 4, 5]
];

var ws = XLSX.utils.aoa_to_sheet(ws_data);

/* Add the worksheet to the workbook */
XLSX.utils.book_append_sheet(wb, ws, new_ws_name);
/* output format determined by filename */
XLSX.writeFile(wb, 'out.xlsx');
/* at this point, out.xlsb is a file that you can distribute */