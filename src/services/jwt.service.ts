import jwt from 'jsonwebtoken';

export const jwtService = {
    async createJwt(user: any) {
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.id_role },
            process.env.JWT_SECRET || "SECRET_KEY",
            { expiresIn: "7d" }
        );
        return token;
    },
    async getUserIdByToken(token: string) {
        const secret = process.env.JWT_SECRET || 'SECRET_KEY';
        try {
            const result: any = jwt.verify(token, secret);
            return result.id;
        } catch (error) {
            return null;
        }
    },
}