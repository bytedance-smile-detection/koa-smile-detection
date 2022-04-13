import qiniu from "qiniu";
import { ACCESS_KEY, SECRET_KEY, BUCKET_NAME } from "./config.js";

export const getQiniuUploadToken = (origin) => {
  const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);
  const options = {
    scope: BUCKET_NAME,
    returnBody: `{"key":"$(key)","hash":"$(etag)","fsize":$(fsize)}`,
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);

  return uploadToken;
};
