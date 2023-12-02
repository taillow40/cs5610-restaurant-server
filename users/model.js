import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["RESTAURANT", "USER", "MODERATOR"],
      default: "USER",
    },
    sessions: [
      {
        id: String,
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = mongoose.model("users", userSchema);
export default UserModel;
