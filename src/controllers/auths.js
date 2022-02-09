import User from "../models/users.js";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { JWT_SECRET } from "../config.js";
import {
  UnauthorizedException,
  ConflictException,
} from "../middlewares/exceptions.js";

class AuthController {
  static async login(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true },
    });

    const { name, password } = ctx.request.body;
    const user = await User.findOne({ name });

    if (!user) {
      throw new UnauthorizedException("User not found");
    } else if (await argon2.verify(user.password, password)) {
      const userInfo = { name: user.name, password: user.password };
      const token = jwt.sign(userInfo, JWT_SECRET);

      ctx.status = 200;
      ctx.body = { message: "Login successfully", data: token };
    } else {
      throw new UnauthorizedException("Invalid password");
    }
  }

  static async register(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true },
    });

    let { name, password } = ctx.request.body;
    const findResult = await User.findOne({ name });

    if (findResult) {
      throw new ConflictException("User already exists");
    } else {
      // 使用 Agron2 算法加密密码
      password = await argon2.hash(password);
      const newUser = new User({ name, password });

      const user = await newUser.save();

      ctx.status = 201;
      ctx.body = { message: "Register successfully", data: user };
    }
  }
}

export default AuthController;
