import Images from "../models/images.js";

class UserController {
  static async getImages(ctx) {
    const { name } = ctx.state.user;
    const images = await Images.find({ name }, { url: 1, uploadTime: 1, size: 1, _id: 1 });

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: "get images successfully",
      data: {
        images,
      },
    };
  }
}

export default UserController;
