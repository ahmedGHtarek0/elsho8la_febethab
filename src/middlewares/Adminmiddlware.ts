import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AllusersModel } from "../DB/Allusers";

export interface reqAdmin extends Request {
    admin?: any;
}

const Adminmiddelware = async (req: reqAdmin, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.ADMIN_SECRETE_KEY as string) as any;
        const admin = await AllusersModel.findOne({ number: decoded.number });
        if (!admin) {
            return res.status(401).json({ message: "User not found" });
        }

        req.admin = admin;   

        next(); 
    } catch (err) {
        return res.status(401).json({ message: "Invalid token", err });
    }
};

export default Adminmiddelware;
