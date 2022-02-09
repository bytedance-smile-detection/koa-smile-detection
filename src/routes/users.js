import Router from "@koa/router";
import UserController from "../controllers/users.js";

const router = new Router({ prefix: "/api/users" });

export default router;
