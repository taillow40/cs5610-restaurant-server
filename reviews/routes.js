
import * as dao from "./dao.js";
import mongoose from "mongoose";
import RestaurantModel from "../restaurants/model.js";

function ReviewRoutes(app) {
  const createReview = async (req, res) => {
    req.body.date = new Date();
    try{
    const review = await dao.createReview(req.body);

    if (!review) {
      return res.status(400).json({ message: "Failed to create review" });
    }

    // Assuming req.body contains restaurant_id
    const restaurantId = req.body.restaurant_id;
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    // Update the restaurant with the new review
    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
      restaurantId,
      { $push: { reviews: review._id } },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
  }



  const deleteReview = async (req, res) => {
    const status = await dao.deleteReview(req.params.reviewId);
    res.json(status);
  };

  const findAllReviews = async (req, res) => {
    const reviews = await dao.findAllReviews();
    res.json(reviews);
  };

  const findReviewById = async (req, res) => {
    const id = req.params.reviewId.toString();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("invalid id when finding review: " + id);
      res.status(400).send("invalid id");
      return;
    }
    const review = await dao.findReviewById(id);
    if (!review) {
      res.status(404);
    } else {
      res.json(review);
    }
  };

  const updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const status = await dao.updateReview(reviewId, req.body);
    const currentReview = await dao.findReviewById(reviewId);
    req.session["currentReview"] = currentReview;
    res.json(status);
  };


  

  app.post("/api/reviews", createReview);
  app.get("/api/reviews", findAllReviews);
  app.put("/api/reviews/:reviewId", updateReview);
  app.delete("/api/reviews/:reviewId", deleteReview);
  app.get("/api/reviews/:reviewId", findReviewById);
}
export default ReviewRoutes;
