import mongoose from "mongoose";
const restaurantSchema = new mongoose.Schema({
  name: String,
  Lat: Number,
  Long: Number,
  streetAddress: String,
  City: String,
  zipCode: String,
  cuisine: [String],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'reviews' }]
},
  { collection: "restaurants" });
export default restaurantSchema;