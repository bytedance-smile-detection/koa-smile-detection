import User from "../models/users.js";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { JWT_SECRET } from "../config.js";

class AuthController {
  static async login(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true },
    });

    const { name, password } = ctx.request.body;
    const user = await User.findOne({ name });

    ctx.status = 200;
    if (!user) {
      ctx.body = { code: 401, message: "User does not exist" };
    } else if (await argon2.verify(user.password, password)) {
      const userInfo = { name: user.name };
      const token = jwt.sign(userInfo, JWT_SECRET);

      ctx.body = { code: 200, message: "Login successfully", data: token };
    } else {
      ctx.body = { code: 401, message: "Wrong password" };
    }
  }

  static async register(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true },
    });

    let { name, password } = ctx.request.body;
    const findResult = await User.findOne({ name });

    ctx.status = 200;
    if (findResult) {
      ctx.body = { code: 409, message: "User already exists" };
    } else {
      // 使用 Agron2 算法加密密码
      password = await argon2.hash(password);
      const newUser = new User({ name, password });

      await newUser.save();

      ctx.body = { code: 201, message: "Register successfully" };
    }
  }
}

export default AuthController;
