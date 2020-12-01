require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let id = 0;
const urls = [];
let urlsList = [];
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

const dns = require('dns');
const options = {
  family: 6,
};
// Basic Configuration
const port = process.env.PORT || 3000;
// const logger = (req, res, next) => {
//   //console.log(`${req.method} ${req.path} - ${req.ip}`)
//   console.log('queryString: ',req.params('id'));
//   next();
// }

// app.use(logger);
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`)); 

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl/:shorturl', function(req, res) {
 //res.json(urls[req.params.shorturl]);
 console.log(urls[req.params.shorturl]);
 res.redirect(urls[req.params.shorturl].original_url);
});

app.post('/api/shorturl/new', function(req, res) {
  let url = req.body.url;
  let verifyUrl = url;
  if (url.indexOf('http') > -1) {
    verifyUrl = url.slice(8);
    if (verifyUrl.indexOf('/') > -1) {
      verifyUrl = verifyUrl.slice(0, verifyUrl.indexOf('/'))
    }
  } console.log("verified url: ", verifyUrl);
  dns.lookup(verifyUrl, (err) => {
    
    if (err) {
      res.json({ error: 'invalid url' });
    } else { console.log('Valid url -------------');
      let resObj = {};
      resObj = { "original_url" : url, "short_url" : id};
      if (urlsList.indexOf(url) < 0) {
        id = id + 1;
        urls.push(resObj);
        urlsList.push(url);
        res.json(resObj);
      } else {
        res.json(urls[urlsList.indexOf(url)]); 
      }
    }
  });
  
  
      // let resObj = {};
      // resObj = { "original_url" : url, "short_url" : id};
      // if (urlsList.indexOf(url) < 0) {
      //   id = id + 1;
      //   urls.push(resObj);
      //   urlsList.push(url);
      //   res.json(resObj);
      // } else {
      //   res.json(urls[urlsList.indexOf(url)]); 
      // }
  
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
