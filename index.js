'use strict';

require('dotenv').config();

// Start up DB Server
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://Avrey125:Peaches125@cluster0-adwlw.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser:true,
  useCreateIndex: true,
  useUnifiedTopology: true,

});

// Start the web server
require('./src/app.js').start(8080);

