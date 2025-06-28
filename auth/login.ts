import User from "../database/models/User.ts";
import { Status } from "jsr:@oak/commons@1/status";
import { UserSchemaLoginValidation } from "../utils/schema/loginSchema.ts";
import { verifyPassword } from "../utils/passwordHash.ts";
import { authRouter } from "../middleware/router.ts";
import { createJWT, verifyJWT } from "../services/jwt.ts";

const sendErrorResponse = (
  context: any,
  status: number,
  message: string,
  details?: string,
) => {
  context.response.status = status;
  context.response.body = {
    success: false,
    error: message,
    ...(details && { details }),
  };
};

const sendSuccessResponse = (
  context: any,
  status: any,
  message: string = "Success",
  data?: any,
) => {
  context.response.status = Status.OK,
    context.response.body = {
      success: true,
      message,
      data,
    };
};

//? login endpoint
authRouter.post("/login", async (context) => {
  console.log("=== LOGIN ENDPOINT HIT ===");
  try {
    if (!context.request.hasBody) {
      console.log("No request body");
      return sendErrorResponse(
        context,
        Status.BadRequest,
        "request body is required",
      );
    }

    const body = context.request.body;
    console.log("Body type:", body.type());

    if (body.type() === "json") {
      const data = await body.json();
      console.log("Received login data:", { ...data, password: "***" });

      const validatedLoginData = UserSchemaLoginValidation.safeParse(data);

      if (!validatedLoginData.success) {
        console.log("Login validation failed:", validatedLoginData.error);
        context.response.status = 400;
        context.response.body = {
          error: "Invalid input",
          details: validatedLoginData.error.message.toString(),
        };
        return;
      }
      const { email, password } = validatedLoginData.data;

      console.log("Looking for user with email:", email);

      const loggedUser = await User.findOne({ email });

      if (!loggedUser) {
        console.log("Authentication failed: User not found for email:", email);
        return sendErrorResponse(
          context,
          Status.Unauthorized,
          "Invalid email or password",
        );
      }
      console.log("User found, verifying password...");

      const passwordMatch = await verifyPassword(password, loggedUser.password);
      if (!passwordMatch) {
        console.log("Password verification failed");
        return sendErrorResponse(
          context,
          Status.Unauthorized,
          "Invalid email or password",
        );
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

      console.log("Password verified, generating JWT token...");

      let token: string;

      try {
        token = await createJWT({
          userId: loggedUser._id,
          name: loggedUser.name,
        });
      } catch (tokenError) {
        console.error("JWT creation failed:", tokenError);
        return sendErrorResponse(
          context,
          Status.InternalServerError,
          "Failed to generate authentication token",
        );
      }

      if (!token) {
        console.error("JWT creation returned empty token");
        return sendErrorResponse(
          context,
          Status.InternalServerError,
          "Failed to generate authentication token",
        );
      }

      try {
        const verifyToken = await verifyJWT(token);
        if (!verifyToken) {
          console.error("JWT verification failed immediately after creation");
          return sendErrorResponse(
            context,
            Status.InternalServerError,
            "Authentication token verification failed",
          );
        }
        console.log("JWT token created and verified successfully");
      } catch (verifyError) {
        console.error("JWT verification error:", verifyError);
        return sendErrorResponse(
          context,
          Status.InternalServerError,
          "Authentication token verification failed",
        );
      }

      // Set secure HTTP-only cookie (recommended for web apps)
      context.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: Deno.env.get("DENO_ENV") === "production", // Use secure cookies in production
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        path: "/",
      });

      console.log("Login successful for user:", email);

      // Send success response
      return sendSuccessResponse(context, {
        user: {
          id: loggedUser._id,
          email: loggedUser.email,
          name: loggedUser.name,
        },
        token, // Include token in response body as well
        expiresIn: "24h",
      }, "Login successful");
    } else {
      console.log("Request body is not JSON");
      context.response.status = 400;
      context.response.body = { error: "Request body must be JSON" };
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("=== LOGIN ERROR ===");
      console.error("Login error:", error);
      console.error("Error stack:", error.stack);
      context.response.status = Status.InternalServerError;
      context.response.body = {
        message: "Something went wrong",
        error: error.message, // Don't expose this in production
      };
    }
  }
});
