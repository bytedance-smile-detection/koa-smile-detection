import Koa from "koa";
import path from "path";
import { fileURLToPath } from "url";
import logger from "koa-logger";
import cors from "@koa/cors";
import koaBody from "koa-body";
import koaParameter from "koa-parameter";
import koaStatic from "koa-static";
import Mongoose from "mongoose";
import jwt from "koa-jwt";
import authRouter from "./routes/auths.js";
import userRouter from "./routes/users.js";
import uploadRouter from "./routes/upload.js";
import { dbAddress, JWT_SECRET } from "./config.js";

const app = new Koa();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

Mongoose.connect(dbAddress, { useNewUrlParser: true }, (err) => {
  if (!err) {
    console.log("Connected to MongoDB!");

    app.use(logger());
    app.use(cors());
    app.use(koaStatic(path.join(__dirname, "public"))); // 静态资源目录
    app.use(koaParameter(app));
    app.use(
      koaBody({
        multipart: true,
        formidable: {
          // uploadDir: path.join(__dirname, "public/uploads"),
          // maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
          keepExtensions: true, // 保持文件的后缀
        },
      })
    );

    // 添加错误处理中间件
    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (error) {
        // 只返回 JSON 格式的响应
        ctx.status = 200;
        ctx.body = { code: error.status || 500, message: error.message };
      }
    });

    // 无需 JWT Token 即可访问
    app.use(authRouter.routes()).use(authRouter.allowedMethods());

    // 注册 JWT 中间件
    app.use(jwt({ secret: JWT_SECRET }));

    // 需要 JWT Token 才能访问
    app.use(userRouter.routes()).use(userRouter.allowedMethods());
    app.use(uploadRouter.routes()).use(uploadRouter.allowedMethods());

    app.listen(8000);
  } else {
    console.log(`MongoDB connection error: ${err}`);
  }
});
