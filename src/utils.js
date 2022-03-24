import qiniu from "qiniu";
import { ACCESS_KEY, SECRET_KEY, bucket } from "./config.js";

export const getQiniuUploadToken = (origin) => {
  const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);
  const options = {
    scope: bucket,
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize)}',
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);

  return uploadToken;
};
