"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_URL = void 0;
exports.API_URL = process.env.NODE_ENV === 'production'
    ? ''
    : 'http://localhost:5173';
