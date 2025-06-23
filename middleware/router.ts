import { Router } from "jsr:@oak/oak/router";


// initiate a router for auth endpoint
export const authRouter = new Router({prefix:"/auth"});