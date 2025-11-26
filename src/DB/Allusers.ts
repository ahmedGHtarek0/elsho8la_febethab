import mongoose,{Document,Schema} from "mongoose";
import zod from "zod";
enum Role{
    USER="USER",
    ADMIN="ADMIN",
    SELLER="SELLER",
    DRIVER="DRIVER"
}
interface Allusers extends Document{
    username:string;
    number:string;
    password:string;
    address?:string;
    RestaurantName?:string;
    role?:Role;
}
const AllusersSchema:Schema=new Schema<Allusers>({
    username:{type:String,required:true},
    number:{type:String,required:true,unique:true}, 
    password:{type:String,required:true},
    address:{type:String,required:false},
    RestaurantName:{type:String,required:false},
    role:{type:String,enum:Role,default:Role.USER}
});
const AllusersModel=mongoose.model<Allusers>("Allusers",AllusersSchema);
const  SellerZod=zod.object({
     username:zod.string().min(3,'the name must be more than 2 and less than 31').max(30,'the name must be more than 2 and less than 31'),
    number:zod.string(),
    password:zod.string().min(6,'the password must be more than 5 and less than 101').max(100,'the password must be more than 5 and less than 101'),
    address:zod.string().min(10,' the address must be more than 9 char and less than 101').max(100,'the address must be more than 9 char and less than 101').optional(),
    RestaurantName:zod.string().min(3,' the name or Resturant must be more than 2 and less than 51 ').max(50,' the name or Resturant must be more than 2 and less than 51 ').optional()
});
const UserZod=zod.object({
    username:zod.string().min(3,'the name must be more than 2 and less than 31').max(30,'the name must be more than 2 and less than 31'),
    number:zod.string(),
    password:zod.string().min(6,'the password must be more than 5 and less than 101').max(100,'the password must be more than 5 and less than 101'),
    address:zod.string().min(10,' the address must be more than 9 char and less than 101').max(100,'the address must be more than 9 char and less than 101').optional(),
});
const AdminZod=zod.object({
    username:zod.string().min(3,'the name must be more than 2 and less than 31').max(30,'the name must be more than 2 and less than 31'),
    number:zod.string(),
    password:zod.string().min(6,'the password must be more than 5 and less than 101').max(100,'the password must be more than 5 and less than 101'),
});
const DriverZod=zod.object({    
     username:zod.string().min(3,'the name must be more than 2 and less than 31').max(30,'the name must be more than 2 and less than 31'),
    number:zod.string(),
    password:zod.string().min(6,'the password must be more than 5 and less than 101').max(100,'the password must be more than 5 and less than 101'),
   address:zod.string().min(10,' the address must be more than 9 char and less than 101').max(100,'the address must be more than 9 char and less than 101').optional(),
});
export {SellerZod,UserZod,AdminZod,DriverZod,Role,AllusersModel};