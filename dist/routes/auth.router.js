"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_controller_1 = require("../controllers/user.controller");
exports.authRoute = (0, express_1.Router)();
const titleValidation = (0, express_validator_1.body)('title').isLength({ min: 3, max: 25 })
    .withMessage('Title length should be from 3 to 25 symbols');
exports.authRoute.post('/signup', user_controller_1.UserController.addUser); //registration
exports.authRoute.post('/login', user_controller_1.UserController.authUser); //auth
exports.authRoute.get('/activate/:token', user_controller_1.UserController.activateUser); //activation link
