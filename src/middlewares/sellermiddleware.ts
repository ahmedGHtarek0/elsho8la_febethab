import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AllusersModel } from "../DB/Allusers";

export interface reqSeller extends Request {
    seller?: any;
}

const Sellermiddleware = async (req: reqSeller, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.SELLER_SECRETE_KEY as string) as any;
        const seller = await AllusersModel.findOne({ number: decoded.number });
        if (!seller) {
            return res.status(401).json({ message: "User not found" });
        }

        req.seller = seller;   

        next(); 
    } catch (err) {
        return res.status(401).json({ message: "Invalid token", err });
    }
};

export default Sellermiddleware;
