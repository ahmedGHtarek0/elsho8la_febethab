import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AllusersModel } from "../DB/Allusers";

export interface reqUser extends Request {
    user?: any;
}

const Usermiddlewares = async (req: reqUser, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.USER_SECRETE_KEY as string) as any;
        const user = await AllusersModel.findOne({ number: decoded.number });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;   

        next(); 
    } catch (err) {
        return res.status(401).json({ message: "Invalid token", err });
    }
};

export default Usermiddlewares;
