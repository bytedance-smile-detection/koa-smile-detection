import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import { SERVER_DOMAIN } from "../config.js";
// import qiniu from "qiniu";
import Image from "../models/images.js";
// import { QINIU_DOMAIN } from "../config.js";
// import { getQiniuUploadToken } from "../utils.js";

class UploadController {
  static async saveImage(ctx) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const { name } = ctx.state.user;
    const { file } = ctx.request.files;

    const fileName = `${name}_${nanoid()}.${file.name.split(".").pop()}`;
    const filePath = path.join(__dirname, "../public/uploads", fileName);
    const readableStream = fs.createReadStream(file.path);
    const writableStream = fs.createWriteStream(filePath);

    readableStream.pipe(writableStream);

    const url = `${SERVER_DOMAIN}/uploads/${fileName}`;
    const uploadTime = Date.now() + 8 * 3600 * 1000;
    const size = file.size;
    const newImage = new Image({ name, url, uploadTime, size });

    await newImage.save();

    ctx.status = 200;
    ctx.body = {
      code: 201,
      message: "upload successfully",
    };
  }

  // static async saveImage(ctx) {
  //   const { name } = ctx.state.user;

  //   const config = new qiniu.conf.Config();
  //   config.zone = qiniu.zone.Zone_z2;
  //   const formUploader = new qiniu.form_up.FormUploader(config);
  //   const putExtra = new qiniu.form_up.PutExtra();
  //   const uploadToken = getQiniuUploadToken(ctx.origin);

  //   console.log(ctx.request);
  //   const { file } = ctx.request.files;
  //   const key = `${name}_${nanoid()}.${file.name.split(".").pop()}`;
  //   const filePath = file.path;
  //   const readableStream = fs.createReadStream(filePath);

  //   const result = await new Promise((resolve) => {
  //     formUploader.putStream(uploadToken, key, readableStream, putExtra, (respErr, respBody, respInfo) => {
  //       if (respErr) {
  //         throw respErr;
  //       }

  //       resolve({ respBody, respInfo });
  //     });
  //   });

  //   const { respBody, respInfo } = result;

  //   if (respInfo.statusCode === 200) {
  //     const { key, fsize: size, hash } = respBody;
  //     const uploadTime = Date.now() + 8 * 3600 * 1000;
  //     const url = `${QINIU_DOMAIN}/${key}`;
  //     const newImage = new Image({ name, url, uploadTime, size, hash });

  //     await newImage.save();

  //     ctx.status = 200;
  //     ctx.body = {
  //       code: 201,
  //       message: "upload successfully",
  //     };
  //   } else {
  //     ctx.status = 200;
  //     ctx.body = {
  //       code: 500,
  //       message: "upload failed",
  //     };
  //   }
  // }
}

export default UploadController;
