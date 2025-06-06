import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import authRouter from "./middleware/auth.ts";
// import client from "./database/mongodbConnection.ts";
import { DatabaseConnection } from "./database/mongodbConnection.ts"
//connction to the database
const run  = async() => {
  try {
      await DatabaseConnection()
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }catch(err){
      console.log("couldn't connect to the database : ", err)
  }
}

run().catch(console.dir)

// initiate the router
const router = new Router()
router.get("/ " , (ctx)=> {
  ctx.response.body = `
    <html>
      <head><title>Hello bachir</title><head>
      <body>
        <h1>hello from the home page</h1>
      </body>
    </html>
  
  `
})


// start the application 

const app = new Application()
const port = 8000
app.use(router.routes())
app.use(router.allowedMethods())


// authroute will help to simplify the creation of other api endpoints like /register or /login
app.use(authRouter.routes());         // <--- Add this
app.use(authRouter.allowedMethods()); // <--- And this


app.addEventListener("listen" , ()=>{
  console.log(`Server running on http://localhost:${port}`);
})
await app.listen({
  port : port
})

