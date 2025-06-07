import { model, Schema } from "npm:mongoose@^8.15.1";
const UserSchema = new Schema({
    name : {
        type: String  ,
        required : true , 
        min : 4 , 
        max : 20,
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

// validation 
UserSchema.path("name").required(true , "name cannot be blank.")
UserSchema.path("email").required(true , "email cannot be blank.")
UserSchema.path("password").required(true , "password cannot be blank.")



export default model("User" , UserSchema)