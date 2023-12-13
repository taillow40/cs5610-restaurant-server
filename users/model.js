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
      enum: ["RESTAURANT", "USER", "ADMIN"],
      default: "USER",
    },
    sessions: [
      {
        id: String,
        _id: false,
      },
    ],
    cuisine: {
      type: [String],
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "reviews" }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'restaurants' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = mongoose.model("users", userSchema);
export default UserModel;
