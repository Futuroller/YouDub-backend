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
exports.coursesRepository = void 0;
let courses = [
    { id: 1, title: 'front-end' },
    { id: 2, title: 'back-end' },
    { id: 3, title: 'devops' },
    { id: 4, title: 'automation qa' }
];
exports.coursesRepository = {
    createCourse(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCourse = {
                id: +courses.length + 1,
                title: title
            };
            courses.push(newCourse);
            return newCourse;
        });
    },
    findCourses(title) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundCourses = courses;
            if (title) {
                foundCourses = foundCourses
                    .filter(c => c.title.indexOf(title) > -1);
            }
            return foundCourses;
        });
    },
    findCourseById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = courses.find(c => c.id === id);
            if (!course) {
                return 404;
            }
            return course;
        });
    },
    updateCourse(id, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = courses.find(c => c.id === id);
            if (!course) {
                return false;
            }
            if (!title) {
                return false;
            }
            course.title = title;
            return true;
        });
    },
    deleteCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = courses.find(c => c.id === id);
            if (!course) {
                return 404;
            }
            courses = courses.filter(c => c.id !== course.id);
            return course;
        });
    }
};
