
import User from "../../database/models/User.ts";
import { Status } from "jsr:@oak/commons@1/status";
import { UserSchemaLoginValidation } from "../../utils/schema/loginSchema.ts";
import { verifyPassword } from "../../utils/passwordHash.ts";
import { authRouter } from "../router.ts";


//? login endpoint

authRouter.post("/login", async (context) => {
    if (!context.request.hasBody) {
      context.throw(Status.BadRequest, "Bad Request");
    }
  
    const body = context.request.body;
  
    if (body.type() === "json") {
      const data = await body.json();
  
      const validatedLoginData = UserSchemaLoginValidation.safeParse(data);
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
  