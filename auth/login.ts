
import User from "../database/models/User.ts";
import { Status } from "jsr:@oak/commons@1/status";
import { UserSchemaLoginValidation } from "../utils/schema/loginSchema.ts";
import { verifyPassword } from "../utils/passwordHash.ts";
import { authRouter } from "../middleware/router.ts";


//? login endpoint
authRouter.post("/login" , async(context)=>{
  console.log("=== LOGIN ENDPOINT HIT ===");
  try {
    if(!context.request.hasBody){
      console.log("No request body");
      context.throw(Status.BadRequest , "bad request")
    }

    const body = context.request.body
    console.log("Body type:", body.type());

    if(body.type() === "json"){
      const data = await body.json()
      console.log("Received login data:", { ...data, password: "***" });


      const validatedLoginData = UserSchemaLoginValidation.safeParse(data)

      if(!validatedLoginData.success){
        console.log("Login validation failed:", validatedLoginData.error);
        context.response.status = 400 
        context.response.body = {
          error: "Invalid input",
          details: validatedLoginData.error.message.toString(),
        }
        return
      }
      const {email , password} = validatedLoginData.data

      console.log("Looking for user with email:", email);

      const loggedUser = await User.findOne({email})

      if(!loggedUser){
        console.log("User not found");
        context.response.status = Status.Unauthorized
        context.response.body = "Invalid email or password.";
        return
      }
      console.log("User found, verifying password...");

      const passwordMatch = await verifyPassword(password , loggedUser.password)
      if(!passwordMatch){
        console.log("Password verification failed");
        context.response.status = Status.Unauthorized;
        context.response.body = { error: "Invalid password" };
        return;
      }
      console.log("Login successful");
      context.response.status = Status.OK;
      context.response.body = {
        message: "Login successful",
        user: {
          id: loggedUser._id,
          email: loggedUser.email,
        },
      };
    }else{
      console.log("Request body is not JSON");
      context.response.status = 400;
      context.response.body = { error: "Request body must be JSON" };
    }
  }catch(error){
    if(error instanceof Error){
      console.error("=== LOGIN ERROR ===");
      console.error("Login error:", error);
      console.error("Error stack:", error.stack);
      context.response.status = Status.InternalServerError;
      context.response.body = { 
        message: "Something went wrong",
        error: error.message // Don't expose this in production
      };
    }
  }
})