const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config - -grabs mongoURI from config keys.js
const db = require('./config/keys').mongoURI;

// connect to mongoDB
mongoose
   .connect(
      db,
      { useNewUrlParser: true }
   )
   .then(() => console.log('mongoDB connected'))
   .catch(err => console.log(err));

app.get('/', (req, res) => res.send('hello world'));

// user routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port ${port}`));
