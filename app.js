var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var restify = require('express-restify-mt-mongoose');

//App initialization and setting default handlers
var app = express();
app.use(bodyParser.json());
app.use(methodOverride());

//Initialization of tenant specific default db and global db
var mongoose = require('mongoose');
var tenantDBUri = 'mongodb://localhost/test1'; //this should come from config
defaultTenantDb = mongoose.createConnection(tenantDBUri);
var globalDBUri = 'mongodb://localhost/global'; //this should come from config
globalDb = mongoose.createConnection(globalDBUri);
var mt_mongoose = require("mt-mongoose");
mt_mongoose.setDefaultTenantDB(defaultTenantDb); //Set default tenant specific DB
mt_mongoose.setGlobalDB(globalDb); //Set global db across tenants

// Multi tenant middleware
app.use(function (req, res, next) {
    req._tid = req.query.tid;//example of fetching tenant id from a query parameter, this can be from use object , session etc.
    mt_mongoose.setTenantId(req, res, next);
});


//App's routes
app.get('/index', function (req, res, next) {
    User().find(function (err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
});


var router = express.Router();
var User = require('./models/User');
//var util = require("./util/util");
restify.serve(router, User(), {
    preMiddleware: function (req, res, next) {
        //mongoose.useDb('test');
        console.log('Contact Incoming %s request', req.body);
        console.log('pre tenant id : %s ',mt_mongoose.getTenantId());
        return next();
    },
    postRead:function (req, res, next) {
        //mongoose.useDb('test');
        console.log('post tenant id : %s ',mt_mongoose.getTenantId());
        return next();
    }
});
app.use('/', router);

module.exports = app;
app.listen(3001);