'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const superagent = require('superagent');
// Esoteric Resources
const errorHandler = require( './middleware/error.js');
const notFound = require( './middleware/404.js' );
const authRouter = require( './auth/router.js' );

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes
app.use(authRouter);

// Catchalls
app.use(notFound);
app.use(errorHandler);

// const linkedinTokenServerUrl = '';
// const linkedinAPI = '';
// const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
// const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

const linkedinToken = 'https://www.linkedin.com/oauth/v2/accessToken'
const linkedinAPI = 'https://api.linkedin.com/v2/me'
const LINKEDIN_CLIENT_SECRET= 'rRp7S37b6gSLVwXH';
const LINKEDIN_CLIENT_ID = '86p5hspkb9vrbl';
const API_URL = 'http://localhost:3000/oauth';

app.get('/oauth', authorize);

function authorize(request, response) {

  let code = request.query.code;
  console.log(request.query.code);
  console.log('1) coderecieved: ', code);
  return superagent.post(linkedinToken)
    .type('form')
    .send({
      code: code,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
      redirect_uri: API_URL,
      grant_type: 'authorization_code',
    })
    .then(response => {
      let access_token = response.body.access_token;
      console.log('access token recieved', access_token);
      return access_token;
    })
    .then(token => {
      return superagent.get(linkedinAPI)
        .set('Authorization', `Bearer ${token}`)
    })
    .then(response => {
      let user = response.body;
      console.log('3) here is our user', user);
      response.status(200).json(user);

    })
    .catch(e => response.send(e));
}




const port = 3000;






module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
