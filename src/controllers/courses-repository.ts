let courses = [
    { id: 1, title: 'front-end' },
    { id: 2, title: 'back-end' },
    { id: 3, title: 'devops' },
    { id: 4, title: 'automation qa' }
];

export type CourseType = {
    id: number,
    title: string
}

export const coursesRepository = {
    async createCourse(title: string): Promise<CourseType> {
        const newCourse = {
            id: +courses.length + 1,
            title: title
        };

        courses.push(newCourse);
        return newCourse;
    },
    async findCourses(title: string | null | undefined): Promise<CourseType[]> {
        let foundCourses = courses;
        if (title) {
            foundCourses = foundCourses
                .filter(c => c.title.indexOf(title as string) > -1);
        }
        return foundCourses;
    },
    async findCourseById(id: number): Promise<number | CourseType> {
        const course = courses.find(c => c.id === id);
        if (!course) {
            return 404;
        }
        return course;
    },
    async updateCourse(id: number, title: string): Promise<boolean> {
        const course = courses.find(c => c.id === id);
        if (!course) {
            return false;
        }

        if (!title) {
            return false;
        }

        course.title = title;
        return true;
    },
    async deleteCourse(id: number): Promise<number | CourseType> {
        const course = courses.find(c => c.id === id);
        if (!course) {
            return 404;
        }

        courses = courses.filter(c => c.id !== course.id);
        return course;
    }
};