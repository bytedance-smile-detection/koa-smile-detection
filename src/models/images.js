import Mongoose from "mongoose";

const { Schema, model } = Mongoose;

const ImageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploadTime: {
    type: Date,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
});

export default model("Image", ImageSchema);
