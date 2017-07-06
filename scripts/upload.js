'use strict';
process.env.NODE_ENV = 'production';
const offline = require('./offline.js');

offline.uploadPosts();
