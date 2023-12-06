import jwt from 'jsonwebtoken';
import { projectConfig } from '../config.js';

export const generateToken = (user) => {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        session: user.session,
        type: user.type,
    }, projectConfig?.jwt?.key, {
        expiresIn: projectConfig?.jwt?.expire
    })
}