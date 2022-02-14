import Router from "@koa/router";
import AuthController from "../controllers/auths.js";

const router = new Router({ prefix: "/api/auths" });

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

export default router;
