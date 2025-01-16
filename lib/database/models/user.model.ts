
import { model, models, Schema } from "mongoose";

export interface IUser extends Document{
    email: string;
    username: string;
    photo: string;
    firstName: string;
    lastName: string;
    planId?: number; // Optional since it has a default value
    creditBalance?: number; // Optional since it has a default value
  }
  

const UserSchema = new Schema({
    email:{type:String, required:true, unique:true},
    username:{type:String,required:true, unique:true},
    photo:{type:String, required:true},
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    planId:{type:Number, default:1},
    creditBalance:{type:Number, deault:10}
    
});

const User = models.User || model('User', UserSchema);

export default User;
