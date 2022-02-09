import Mongoose from "mongoose";

const { Schema, model } = Mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default model("User", UserSchema);
