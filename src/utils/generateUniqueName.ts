import crypto from 'crypto';

export const generateUniqueName = (username: string) => {
    return username + '-' + crypto.randomBytes(2).toString('hex').slice(0, 4);
}