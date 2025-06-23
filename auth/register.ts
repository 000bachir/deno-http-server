import User from "../database/models/User.ts";
import { Status } from "jsr:@oak/commons@1/status";
import { UserSchemaValidation } from "../utils/schema/registerSchema.ts";
import { hashingPassword } from "../utils/passwordHash.ts"; 
import { authRouter } from "../middleware/router.ts"; 

//? register endpoint 
authRouter.post("/register", async (context) => {
  try {
  console.log("=== REGISTER ENDPOINT HIT ===");

  if (!context.request.hasBody) {
    context.throw(Status.BadRequest, "Bad Request");
  }
  const body = context.request.body;
  if (body.type() === "json") {
    const value = await body.json();
    console.log("Received data:", value);

    // Validate the data
    console.log("Validating data...");
    const validatedData = UserSchemaValidation.safeParse(value);
    if (!validatedData.success) {
      console.log("Validation failed:", validatedData.error);

      context.response.status = 400,
        context.response.body = {
          error: "Invalid input",
          details: validatedData.error.message,
        };
      return;
    }

    const { name, email, password } = validatedData.data;
    console.log("Validated data:", { name, email, password: "***" });

    const EmailTaken = await User.findOne({ email });  
    if (EmailTaken) {
      console.log("User already exists");

      context.response.status = 400;
      context.response.body = {
        error: "User with identical email already exists",
      };
      return
    }

     // Hash password
     console.log("Hashing password...");
    const hashedPassword = await hashingPassword(password);
    console.log("Password hashed successfully");
       // Create user
       console.log("Creating user...");
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    console.log("Saving user...");
    
      const savedUser = await user.save();
      console.log("User saved successfully:", savedUser);

      context.response.status = 201;
      context.response.body = {
        message: "User created successfully",
        savedUser,
      };
      console.log("user has been created", savedUser);
    }else{
      console.log("Request body is not JSON");
      context.response.status = 400;
      context.response.body = { error: "Request body must be JSON" };
    }
  }catch(err){
    if (err instanceof Error){
      console.error("=== REGISTER ERROR ===");
      console.error("Error details:", err);
      console.error("Error stack:", err.stack);
      
      context.response.status = 500;
      context.response.body = { 
        message: "Error creating user",
        error: err.message // Don't expose this in production
      };
    }
  }
});
