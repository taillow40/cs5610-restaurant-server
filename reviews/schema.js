import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  restaurant_id: mongoose.Schema.Types.ObjectId,
  content: String,
  content_accomodations: String,
  accomodations: {
      gluten_free: Number,
      nut_free: Number,
      dairy_free: Number,
      shellfish: Number,
      vegetarian: Number,
      vegan: Number
  },
  rating: Number,
  date: Date
},
  { collection: "reviews" });
export default reviewSchema;