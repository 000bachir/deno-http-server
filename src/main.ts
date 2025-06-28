import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { authRouter } from "../middleware/router.ts";
import { DatabaseConnection } from "../database/mongodbConnection.ts";
import "../auth/register.ts";
import "../auth/login.ts";

//connction to the database
const run = async () => {
  try {
    console.log("Attempting to connect to database...");
    await DatabaseConnection();
    console.log("✅ Database connection successful!");
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (err) {
    console.log("couldn't connect to the database : ", err);
    console.error("Error details:", err);
    console.error(
      "Make sure your MongoDB connection string is correct and the database is running",
    );
  }
};
run().catch(console.dir);

// initiate the router
const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = "hello world";
});
// start the application
const app = new Application();
const port = 8000;
app.use(router.routes());
app.use(router.allowedMethods());

// authroute will help to simplify the creation of other api endpoints like /register or /login
app.use(authRouter.routes());
app.use(authRouter.allowedMethods());

app.addEventListener("listen", () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log("Available endpoints:");
  console.log("  GET  http://localhost:8000/");
  console.log("  POST http://localhost:8000/auth/register");
  console.log("  POST http://localhost:8000/auth/login");
});
await app.listen({
  port: port,
});
