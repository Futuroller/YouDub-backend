import { Request, Response, Router } from "express";
import { coursesRepository, CourseType } from "../controllers/courses-repository";
import { body } from "express-validator";
import { inputValidation } from "../middlewares/input-validation-middleware";
export const coursesRoute = Router();

const titleValidation = body('title').isLength({ min: 3, max: 25 })
    .withMessage('Title length should be from 3 to 25 symbols');

coursesRoute.post('/',
    titleValidation,
    inputValidation,
    async (req: Request, res: Response) => {//body-obj with middleware
        const newCourse: CourseType = await coursesRepository.createCourse(req.body.title?.toString());
        res.send(newCourse);
    });

coursesRoute.get('/', async (req: Request, res: Response) => {//query-params
    const result: CourseType[] = await coursesRepository.findCourses(req.query.title?.toString());
    res.json(result);
});

coursesRoute.get('/:id', async (req: Request, res: Response) => {
    const result: number | CourseType = await coursesRepository.findCourseById(+req.params.id);
    res.send(result);
});

coursesRoute.put('/:id', async (req: Request, res: Response) => {
    const isUpdated: boolean = await coursesRepository
        .updateCourse(+req.params.id, req.body.title?.toString());

    if (isUpdated) {
        const updatedCourse: number | CourseType = await coursesRepository
            .findCourseById(+req.params.id);
        console.log(updatedCourse);
        res.json(updatedCourse);
        return;
    }

    res.sendStatus(404);
});

coursesRoute.delete('/:id', async (req: Request, res: Response) => {
    const result: number | CourseType = await coursesRepository.deleteCourse(+req.params.id);
    res.send(result);
});
