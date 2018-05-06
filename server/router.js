var express = require('express');
var router = express.Router();

// 中间件
router.use((req, res, next)=>{
    console.log('In the midware of router');
    next();
});

// router.get
router.post('/rest/header', (req, res)=>{
    console.log('In the router');
    res.send('This is response of server');
});
// router.post();

module.exports = router;
