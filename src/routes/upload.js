import Router from "@koa/router";
import UploadController from "../controllers/upload.js";

const router = new Router({ prefix: "/api/upload" });

router.post("/saveImage", UploadController.saveImage);

export default router;
