import jwt from 'jsonwebtoken';
import { projectConfig } from '../config.js';
import * as dao from "../users/dao.js";

export const userAuthentication = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"] || req.header('Authorization');

    if (!token || token === '') {
        return res.status(401).send({ err: "A token is required for authentication" });
    }
    try {
        const decoded = jwt.verify(token, projectConfig?.jwt?.key);
        const user = await dao.findUser({ _id: decoded?._id, 'sessions.id': decoded.session });
        if (!user) return res.status(403).send({ err: "Invalid Token" });
        req.user = decoded;
    } catch (err) {
        console.log(err)
        return res.status(403).send({ err: "Invalid Token" });
    }
    return next();
}