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
const courses_repository_1 = require("../repositories/courses-repository");
const express_validator_1 = require("express-validator");
exports.authRoute = (0, express_1.Router)();
const titleValidation = (0, express_validator_1.body)('title').isLength({ min: 3, max: 25 })
    .withMessage('Title length should be from 3 to 25 symbols');
exports.authRoute.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(201);
}));
exports.authRoute.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield courses_repository_1.coursesRepository.findCourses((_a = req.query.title) === null || _a === void 0 ? void 0 : _a.toString());
    res.json(result);
}));
exports.authRoute.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courses_repository_1.coursesRepository.findCourseById(+req.params.id);
    res.send(result);
}));
exports.authRoute.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isUpdated = yield courses_repository_1.coursesRepository
        .updateCourse(+req.params.id, (_a = req.body.title) === null || _a === void 0 ? void 0 : _a.toString());
    if (isUpdated) {
        const updatedCourse = yield courses_repository_1.coursesRepository
            .findCourseById(+req.params.id);
        console.log(updatedCourse);
        res.json(updatedCourse);
        return;
    }
    res.sendStatus(404);
}));
exports.authRoute.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courses_repository_1.coursesRepository.deleteCourse(+req.params.id);
    res.send(result);
}));
