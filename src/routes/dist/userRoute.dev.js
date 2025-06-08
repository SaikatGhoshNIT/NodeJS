"use strict";

var express = require('express');

var userRouter = express.Router();

var _require = require('../middlewares/authMiddleware'),
    userAuth = _require.userAuth;

module.exports = userRouter;