var express = require('express');
var path = require('path');
var router = express.Router();
var zoo = require('./zoo.js');

router.use('/zoo', zoo);

router.get('/*', function(req, res){
    var file = req.params[0] || "/views/index.html";
    res.sendFile(path.join(__dirname, "../public/" + file));
});

module.exports = router;
