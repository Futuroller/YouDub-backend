"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
exports.authRoute = (0, express_1.Router)();
const titleValidation = (0, express_validator_1.body)('title').isLength({ min: 3, max: 25 })
    .withMessage('Title length should be from 3 to 25 symbols');
exports.authRoute.post('/signup', auth_controller_1.AuthController.addUser); //registration
exports.authRoute.post('/login', auth_controller_1.AuthController.authUser); //auth
exports.authRoute.get('/activate/:token', auth_controller_1.AuthController.activateUser); //activation link
