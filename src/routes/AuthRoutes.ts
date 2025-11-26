import express from "express";
import { AdminZod, DriverZod, Role, SellerZod, UserZod } from "../DB/Allusers";
import { checkUser, login, makeaccesstokenforadmin, makeaccesstokenfordelivery, makeaccesstokenforseller, makeaccesstokenforuser, signupadmin, signupdelivery, signupseller, signupUser } from "../services/AuthServices";
import Adminmiddelware, { reqAdmin } from "../middlewares/Adminmiddlware";
import Sellermiddleware, { reqSeller } from "../middlewares/sellermiddleware";
import Usermiddlewares, { reqUser } from "../middlewares/usermiddlewares";
import Deliverymiddelware, { reqDelivaery } from "../middlewares/deliverymiddelware";
import { client } from "../elsho8la_febetha";
const router=express.Router();
router.post('/checkAllusers',async(req,res)=>{
    try{
    const NumBer=req.body
    const number=NumBer.number.toString();
    console.log(number);
    const {data,status}=await checkUser({number});
    return res.status(status).json(data);
}catch(err){
    return res.status(500).json({message:"Internal server error"});
}
});
router.post('/signupUser',async(req,res)=>{
    try{
    const Data= UserZod.safeParse(req.body);
    if(!Data.success){
        return res.status(400).json({message:"Invalid data",errors:Data.error});
    }
    const {username,number,password,address}=Data.data;
    const role=Role.USER;
    const Otp= req.body.otp 
    const otp = Otp.toString();
    const {data,status}=await  signupUser({username,number,password,address,role,otp});
      if (!data.accesstoken || !data.refreshtoken) {
            return res.status(500).json({ message: "Error generating tokens" });
        }
   res.cookie("refreshToken", data.refreshtoken, {
    httpOnly: true,
    secure: false, 
    sameSite: "strict",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
});
const setrefreshtoken =  await client.set(data.refreshtoken, role, { EX: 7 * 24 * 60 * 60 });
    return res.status(status).send(data.accesstoken);

}catch(err){
    return res.status(500).json({message:"Internal server error"}); 
}

});

router.post('/signupSeller',async(req,res)=>{
    try{
    const Data= SellerZod.safeParse(req.body);
    if(!Data.success){
        return res.status(400).json({message:"Invalid data",errors:Data.error});
    }
    const {username,number,password,address,RestaurantName}=Data.data;
    const role=Role.SELLER;
    const Otp= req.body.otp 
    const otp = Otp.toString();
    const {data,status}=await  signupseller({username,number,password,address,role,RestaurantName,otp});
      if (!data.accesstoken || !data.refreshtoken) {
            return res.status(500).json({ message: "Error generating tokens" });
        }
       res.cookie("refreshToken", data.refreshtoken, {
    httpOnly: true,
    secure: false, 
    sameSite: "strict",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
});
const setrefreshtoken =  await client.set(data.refreshtoken, role, { EX: 7 * 24 * 60 * 60 });
    return res.status(status).send(data.accesstoken);
}catch(err){
    return res.status(500).json({message:"Internal server error"}); 
}

});
router.post('/signupadmin',async(req,res)=>{
    try{
    const Data= AdminZod.safeParse(req.body);
    if(!Data.success){
        return res.status(400).json({message:"Invalid data",errors:Data.error});
    }
    const {username,number,password}=Data.data;
    const role=Role.ADMIN;
    const Otp= req.body.otp 
    const otp = Otp.toString();
    const {data,status}=await  signupadmin({username,number,password,role,otp});
    if (!data.accesstoken || !data.refreshtoken) {
            return res.status(500).json({ message: "Error generating tokens" });
        }
       res.cookie("refreshToken", data.refreshtoken, {
    httpOnly: true,
    secure: false, 
    sameSite: "strict",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
});
const setrefreshtoken =  await client.set(data.refreshtoken, role, { EX: 7 * 24 * 60 * 60 });
    return res.status(status).send(data.accesstoken);
}catch(err){
    return res.status(500).json({message:"Internal server error"}); 
}

});
router.post('/signupdelivery',async(req,res)=>{
    try{
    const Data= DriverZod.safeParse(req.body);
    if(!Data.success){
        return res.status(400).json({message:"Invalid data",errors:Data.error});
    }
    const {username,number,password,address}=Data.data;
    const role=Role.DRIVER;
    const Otp= req.body.otp 
    const otp = Otp.toString();
    const {data,status}=await  signupdelivery({username,number,password,role,address,otp});
    if (!data.accesstoken || !data.refreshtoken) {
            return res.status(500).json({ message: "Error generating tokens" });
        }
       res.cookie("refreshToken", data.refreshtoken, {
    httpOnly: true,
    secure: false, 
    sameSite: "strict",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
});
const setrefreshtoken =  await client.set(data.refreshtoken, role, { EX: 7 * 24 * 60 * 60 });
    return res.status(status).send(data.accesstoken);
}catch(err){
    return res.status(500).json({message:"Internal server error"}); 
}
});
router.post('/login',async(req,res)=>{
    try{
    const {number,password}=req.body;
    const {data,status}=await login({number,password});
    if(!data.accesstoken || !data.refreshtoken){
        return res.status(500).json({message:"Error generating tokens"});
    }
     res.cookie("refreshToken", data.refreshtoken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
     });
    res.status(status).send(data.accesstoken);
    }catch(err){
    return res.status(500).json({message:"Internal server error"});     
}
});
router.delete('/logout',(req,res)=>{
    res.clearCookie("refreshToken");
    res.status(200).json({message:"Logged out successfully"});
});

router.get('/refreshToken', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }
    const role = await client.get(refreshToken);
    if (!role) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
    try {
        let accesstoken;
        if (role === Role.USER) {
            accesstoken = await makeaccesstokenforuser({ number: req.body.number, role });
        }
        else if (role === Role.SELLER) {
            accesstoken = await makeaccesstokenforseller({ number: req.body.number, role });
        }
        else if (role === Role.ADMIN) {
            accesstoken = await makeaccesstokenforadmin({ number: req.body.number, role });
        }
        else if (role === Role.DRIVER) {
            accesstoken = await makeaccesstokenfordelivery({ number: req.body.number, role });
        }
        res.status(200).json({ accesstoken });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }

})
export default router;