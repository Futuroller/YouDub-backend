"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueName = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateUniqueName = (username) => {
    return username + '-' + crypto_1.default.randomBytes(2).toString('hex').slice(0, 4);
};
exports.generateUniqueName = generateUniqueName;
