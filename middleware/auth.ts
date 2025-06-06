import { Router } from "jsr:@oak/oak/router";
import User from "../database/models/User.ts";
import { Status } from "jsr:@oak/commons@1/status";
import { z } from "zod/v4"; 


// initiate a router for auth endpoint
const authRouter = new Router()

const UserSchemaValidation = z.object({
    name : z.string().min(6).max(32),
    email : z.string().min(6).max(255).email({pattern : z.regexes.email }),
    password : z.string().min(6).max(1024),
})


authRouter.post("/register" , async (context)=>{
    if (!context.request.hasBody){
        context.throw(Status.BadRequest , "Bad Request")
    }
    const body = context.request.body
    if(body.type() === "json"){

        const value = await body.json()

        const validatedData = UserSchemaValidation.safeParse(value);
        if(!validatedData.success){
                context.response.status = 400 ,
                context.response.body = {
                    error: "Invalid input",
                    details: validatedData.error.message
                } 
                return
            }
        const { name , email , password } = validatedData.data

        const user = new User({
            name ,
            email ,
            password ,
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