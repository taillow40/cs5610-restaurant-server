import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    friends: {type: Array, default: []},
    first_name: { type: String, required: true },
    email: { type: String, required: true },
    last_name: { type: String, required: true },
    phone: String,
    reviews : {type: Array, default: []},
  },
  { collection: "users" });
export default userSchema;