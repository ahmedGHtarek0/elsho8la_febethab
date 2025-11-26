import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AllusersModel } from "../DB/Allusers";

export interface reqDelivaery extends Request {
    delivery?: any;
}

const Deliverymiddelware = async (req: reqDelivaery, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.DELIVERY_SECRETE_KEY as string) as any;
        const delivery = await AllusersModel.findOne({ number: decoded.number });
        if (!delivery) {
            return res.status(401).json({ message: "User not found" });
        }

        req.delivery = delivery;   

        next(); 
    } catch (err) {
        return res.status(401).json({ message: "Invalid token", err });
    }
};

export default Deliverymiddelware;
