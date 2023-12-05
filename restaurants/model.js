import schema from "./schema.js";
import mongoose from "mongoose";
const model = mongoose.model("restaurants", schema);
export default model;
