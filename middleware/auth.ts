import { Router } from "jsr:@oak/oak/router";
import User from "../database/models/User.ts";
import { Status } from "jsr:@oak/commons@1/status";

const authRouter = new Router()
authRouter.post("/register" , async (context)=>{
    if (!context.request.hasBody){
        context.throw(Status.BadRequest , "Bad Request")
    }
    const body = context.request.body
    if(body.type() === "json"){
        const value = await body.json()
        const { name , email , password } = value
        const user = new User({
            name ,
            email, 
            password,     
        })
        try{
            const savedUser = await user.save()
            context.response.body = savedUser
            console.log("user has been created" , savedUser);
    
        } catch(err){ 
            context.response.status = 500;
            context.response.body = { message: "Error creating user"};
            console.log("error: ", err)
        }
    }

})
// authRouter.get("/login" , (contex)=>{
//     contex.response.body = "hello from login"
// })
export default authRouter