'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const memberRoutes = require('./routes/member-routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api', memberRoutes.routes);

app.listen(3000, () => console.log("App is listening on url http://localhost:3000"));