import { AllusersModel, Role } from "../DB/Allusers";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { client } from "../elsho8la_febetha";
dotenv.config();
interface SignupAllUers{
    username?: string | undefined;
    number?: string | undefined;
    password?: string | undefined;
    address?: string| undefined;
    RestaurantName?: string | undefined;
    role?:Role | undefined;
    otp?:string | undefined;
    Loves?:string[] | undefined;
}
function generateOTP() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10); // 0–9
  }
  return otp;
}

const checkUser=async({number}:SignupAllUers)=>{
    try{
        if(!number){
    return {data:{message:"Number is required"},status:400};
}
const CheckUserIfExsit= await AllusersModel.findOne({number});
if(CheckUserIfExsit){
    return {data:{message:"User already exists"},status:400};
}
const otp = generateOTP();
/* 

 add but the otp varibale 
 here the code of the sms  abdo 


here we should  to sent otp to the number as sms , i will do soon :) 



*/
client.set(otp,number,{'EX': 300}); 
return {data:'otp sent',status:201};
    }catch(err){
        return {data:'err in the signup user function'+err,status:500};
    }
}
const login=async({number,password}:SignupAllUers)=>{
    try{
    const Knowhisrole= await AllusersModel.findOne({number,password});
    if(!Knowhisrole){
        return {data:{message:"Invalid number or password"},status:400};
    }
    const makeisonleine= await AllusersModel.findOneAndUpdate({number},{$set:{Isonline:true}});
    const role=Knowhisrole.role;
     if(!role){
            return {data:{message:"Invalid role"},status:400};
        }
    if(role===Role.USER){
        const accesstoken=await makeaccesstokenforuser({number:number,role:role});
        const refreshtoken=await makerefreshtokenforUser({number:number,role:role});
        const setrefreshtoken =  await client.set(refreshtoken, role, { EX: 7 * 24 * 60 * 60 });
        return {data:{accesstoken,refreshtoken},status:200};
    }
    else if(role===Role.SELLER){
        const accesstoken=await makeaccesstokenforseller({number:number,role:role});
        const refreshtoken=await makerefreshtokenforSeller({number:number,role:role});
         const setrefreshtoken =  await client.set(refreshtoken, role, { EX: 7 * 24 * 60 * 60 });
        return {data:{accesstoken,refreshtoken},status:200};
    }
    else if(role===Role.ADMIN){
        const accesstoken=await makeaccesstokenforadmin({number:number,role:role});
        const refreshtoken=await makerefreshtokenforAdmin({number:number,role:role});
         const setrefreshtoken =  await client.set(refreshtoken, role, { EX: 7 * 24 * 60 * 60 });
        return {data:{accesstoken,refreshtoken},status:200};
    }
    else{
        const accesstoken=await makeaccesstokenfordelivery({number:number,role:role});
        const refreshtoken=await makerefreshtokenforDelivery({number:number,role:role});
         const setrefreshtoken =  await client.set(refreshtoken, role, { EX: 7 * 24 * 60 * 60 });
        return {data:{accesstoken,refreshtoken},status:200};
    }
}catch(err){
    return {data:{err:'err in the login function'+err},status:500};
}
}
const signupUser = async ({ username, number, password, address, role ,otp}: SignupAllUers) => {
    try {
        if (!username || !number || !password || !address || !role || !otp) {
            return { data: { message: 'All fields are required' }, status: 400 };
        }
        const getotp= await client.get(otp);
        if (!getotp || getotp !== number) {
            return { data: { message: 'Invalid or expired OTP' }, status: 400 };
        }
        const NewUser = new AllusersModel({ username, number, password, address, role,Isonline:true });
        await NewUser.save();
        await client.del(otp);
        const accesstoken = await makeaccesstokenforuser({ number, role });
        const refreshtoken = await makerefreshtokenforUser({ number, role });
console.log({ accesstoken, refreshtoken })
        return { data: { accesstoken, refreshtoken }, status: 201 };

    } catch (err) {
        return { 
            data: { error: 'err in the signup user function ' + err }, 
            status: 500 
        };
    }
};
const lovesfunction=async(number:string,Loves:string[])=>{
    try{
    const user= await AllusersModel.findOne({number});
    if(!user){
        return {data:{message:"User not found"},status:404};
    }
    user.Loves=Loves;
    await user.save();
    return {data:{message:"Loves updated successfully"},status:200};
}catch(err){
    return {data:{error:'err in the loves function'+err},status:500};
}
}
const signupseller=async({username,number,password,address,role,RestaurantName,otp,Loves}:SignupAllUers)=>{
    try{
 
    if (!username || !number || !password || !address || !role || !RestaurantName || !otp) {
        return { data: { message: 'All fields are required' }, status: 400 };
    }
    const getotp= await client.get(otp);
    if (!getotp || getotp !== number) {
        return { data: { message: 'Invalid or expired OTP' }, status: 400 };
    }
    const NewUser=new AllusersModel({username,number,password,address,role,Loves,RestaurantName,Isonline:true});
    await NewUser.save();
    await client.del(otp); 
     const accesstoken=await  makeaccesstokenforseller({number:number,role:role});
    const refreshtoken=await makerefreshtokenforSeller({number:number,role:role});
    return {data:{accesstoken,refreshtoken},status:201};
    }catch(err){
        return {data:{error:'err in the signup  seller function' + err},status:500};
    }
}
const signupadmin=async({username,number,password,role,otp}:SignupAllUers)=>{
    try{
 
    if (!username || !number || !password || !role || !otp) {
        return { data: { message: 'All fields are required' }, status: 400 };
    }
    const getotp= await client.get(otp);
    if (!getotp || getotp !== number) {
        return { data: { message: 'Invalid or expired OTP' }, status: 400 };
    }
    const NewUser=new AllusersModel({username,number,password,role,Isonline:true});
    await NewUser.save();
    await client.del(otp);
     const accesstoken=await makeaccesstokenforadmin({number:number,role:role});
    const refreshtoken=await makerefreshtokenforAdmin({number:number,role:role});
    return {data:{accesstoken,refreshtoken},status:201};
    }catch(err){
        return {data:{error:'err in the signup admin function'+err},status:500};
    }
}
const signupdelivery=async({username,number,password,address,role,otp}:SignupAllUers)=>{
    try{

    if (!username || !number || !password || !address || !role || !otp) {
        return { data: { message: 'All fields are required' }, status: 400 };
    }
    const getotp= await client.get(otp);
    if (!getotp || getotp !== number) {
        return { data: { message: 'Invalid or expired OTP' }, status: 400 };
    }
    const NewUser=new AllusersModel({username,number,password,address,role,Isonline:true});
    await NewUser.save();
    await client.del(otp); 
     const accesstoken=await makeaccesstokenfordelivery({number:number,role:role});
    const refreshtoken=await makerefreshtokenforDelivery({number:number,role:role});
    return {data:{accesstoken,refreshtoken},status:201};
    }catch(err){
        return {data:{error:'err in the signup delivery function'+err},status:500};
    }
}
const makeaccesstokenforuser=async(data:any)=>{
    return(jwt.sign(data,process.env.USER_SECRETE_KEY as string,{expiresIn:'1h'}));
}
const makerefreshtokenforUser=async(data:any)=>{
    return(jwt.sign(data,process.env.USER_SECRETE_KEY as string,{expiresIn:'7d'}));
}
const makeaccesstokenforseller=async(data:any)=>{
    return(jwt.sign(data,process.env.SELLER_SECRETE_KEY as string,{expiresIn:'1h'}));
}
const makerefreshtokenforSeller=async(data:any)=>{
    return(jwt.sign(data,process.env.SELLER_SECRETE_KEY as string,{expiresIn:'7d'}));
}
const makeaccesstokenforadmin=async(data:any)=>{
    return(jwt.sign(data,process.env.ADMIN_SECRETE_KEY as string,{expiresIn:'1h'}));
}
const makerefreshtokenforAdmin=async(data:any)=>{
    return(jwt.sign(data,process.env.ADMIN_SECRETE_KEY as string,{expiresIn:'7d'}));
}   
const makeaccesstokenfordelivery=async(data:any)=>{
    return(jwt.sign(data,process.env.DELIVERY_SECRETE_KEY as string,{expiresIn:'1h'}));
}
const makerefreshtokenforDelivery=async(data:any)=>{
    return(jwt.sign(data,process.env.DELIVERY_SECRETE_KEY as string,{expiresIn:'7d'}));
}
export {checkUser,signupUser,lovesfunction,signupseller,signupadmin,signupdelivery,login,makeaccesstokenforadmin,makeaccesstokenforuser,makeaccesstokenforseller,makeaccesstokenfordelivery}