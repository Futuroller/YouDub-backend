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
exports.coursesRoute = void 0;
const express_1 = require("express");
const courses_repository_1 = require("../controllers/courses-repository");
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
exports.coursesRoute = (0, express_1.Router)();
const titleValidation = (0, express_validator_1.body)('title').isLength({ min: 3, max: 25 })
    .withMessage('Title length should be from 3 to 25 symbols');
exports.coursesRoute.post('/', titleValidation, input_validation_middleware_1.inputValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const newCourse = yield courses_repository_1.coursesRepository.createCourse((_a = req.body.title) === null || _a === void 0 ? void 0 : _a.toString());
    res.send(newCourse);
}));
exports.coursesRoute.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield courses_repository_1.coursesRepository.findCourses((_a = req.query.title) === null || _a === void 0 ? void 0 : _a.toString());
    res.json(result);
}));
exports.coursesRoute.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courses_repository_1.coursesRepository.findCourseById(+req.params.id);
    res.send(result);
}));
exports.coursesRoute.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.coursesRoute.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield courses_repository_1.coursesRepository.deleteCourse(+req.params.id);
    res.send(result);
}));
