import mongoose from "mongoose";
const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'restaurants' }]
},
  { collection: "favorites" });
export default favoriteSchema;