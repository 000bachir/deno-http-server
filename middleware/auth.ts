import { Router } from "jsr:@oak/oak/router";
import User from "../database/models/User.ts";
import { Status } from "jsr:@oak/commons@1/status";
import { z } from "zod/v4";
import { hashingPassword, verifyPassword } from "../utils/passwordHash.ts";
// import * as djwt from "jsr:@zaubrik/djwt";

// initiate a router for auth endpoint
const authRouter = new Router();

const UserSchemaValidation = z.object({
  name: z.string().min(6).max(32),
  email: z.string().min(6).max(255).email({ pattern: z.regexes.email }),
  password: z.string().min(6).max(1024),
});

//? register endpoint
authRouter.post("/register", async (context) => {
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

//? login endpoint

authRouter.post("/login", async (context) => {
  if (!context.request.hasBody) {
    context.throw(Status.BadRequest, "Bad Request");
  }

  const body = context.request.body;

  if (body.type() === "json") {
    const data = await body.json();

    const validatedLoginData = UserSchemaValidation.safeParse(data);
    if (!validatedLoginData.success) {
      context.response.status = 400,
        context.response.body = {
          error: "Invalid input",
          details: validatedLoginData.error.message.toString(),
        };
      return;
    }
    const { email, password } = validatedLoginData.data;

    try {
      const loggedUser = await User.findOne({ email });
      if (!loggedUser) {
        context.response.status = Status.Unauthorized;
        context.response.body = "Invalid email or password.";
        return;
      }
      const passwordMatch = await verifyPassword(password, loggedUser.password);
      if (!passwordMatch) {
        context.response.status = Status.Unauthorized;
        context.response.body = { error: "Invalid password" };
        return;
      }
      context.response.status = Status.OK;
      context.response.body = {
        message: "Login successful",
        user: {
          id: loggedUser._id,
          email: loggedUser.email,
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      context.throw(Status.InternalServerError, "Something went wrong");
    }
  }
});
export default authRouter;
