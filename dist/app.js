"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_router_1 = require("./routes/auth.router");
const main_router_1 = require("./routes/main.router");
exports.app = (0, express_1.default)();
const port = 3000;
BigInt.prototype.toJSON = function () {
    return Number(this);
};
const jsonBodyMiddleware = express_1.default.json();
exports.app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
exports.app.use(jsonBodyMiddleware);
exports.app.use('/api/auth', auth_router_1.authRoute);
exports.app.use('/api/main', main_router_1.mainRoute);
exports.app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
