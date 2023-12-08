import schema from "./schema.js";
import mongoose from "mongoose";
const model = mongoose.model("favorites", schema);
export default model;
