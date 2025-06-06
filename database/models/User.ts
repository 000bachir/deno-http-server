import { model, Schema } from "npm:mongoose@^8.15.1";
const UserSchema = new Schema({
    name : {
        type: String  ,
        required : true , 
        min : 6 , 
        max : 120,
        unique : true
    },
    email : {
        type:String ,
        min : 16 ,
        max : 255 , 
        required : true ,
        unique : true
    },
    password : {
        type:String ,
        min : 16 ,
        max : 1024 , 
        required : true ,
        unique : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})
export default model("User" , UserSchema)