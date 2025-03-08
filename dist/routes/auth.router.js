"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.authRoute.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
exports.authRoute.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
