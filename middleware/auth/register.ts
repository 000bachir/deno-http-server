import User from "../../database/models/User.ts";
import { Status } from "jsr:@oak/commons@1/status";
import { UserSchemaValidation } from "../../utils/schema/registerSchema.ts";
import { hashingPassword } from "../../utils/passwordHash.ts"; 

import { authRouter } from "../router.ts";


//? register endpoint 
authRouter.post("/auth/register", async (context) => {
  if (!context.request.hasBody) {
    context.throw(Status.BadRequest, "Bad Request");
  }
  const body = context.request.body;
  if (body.type() === "json") {
    const value = await body.json();

    const validatedData = UserSchemaValidation.safeParse(value);
    if (!validatedData.success) {
      context.response.status = 400,
        context.response.body = {
          error: "Invalid input",
          details: validatedData.error.message,
        };
      return;
    }

    const { name, email, password } = validatedData.data;

    const EmailTaken = await User.findOne({ email });
    if (EmailTaken) {
      context.response.status = 400;
      context.response.body = {
        error: "User with identical email already exists",
      };
      return
    }
    const hashedPassword = await hashingPassword(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    try {
      const savedUser = await user.save();
      context.response.status = 201;
      context.response.body = {
        message: "User created successfully",
        savedUser,
      };
      console.log("user has been created", savedUser);
    } catch (err) {
      context.response.status = 500;
      context.response.body = { message: "Error creating user" };
      console.log("error: ", err);
    }
  }
});
