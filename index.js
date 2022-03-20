'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const studentRoutes = require('./routes/student-routes');
const sessionRoutes = require('./routes/session-routes');
const staticRoutes = require('./routes/static-routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(__dirname+'/static/'));
app.set('view engine', 'pug');

app.use('/', staticRoutes.routes);
app.use('/api', studentRoutes.routes);
app.use('/api', sessionRoutes.routes);

app.listen(3000, () => console.log("App is listening on url http://localhost:3000"));