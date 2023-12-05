import ReviewModel from "./model.js";

// Function to add a new review to the database
export const createReview = async (data) => {
  try {
    const createdReview = await ReviewModel.create(data);

    const newReview = createdReview?.toJSON();
    delete newReview?.password;

    return newReview;
  } catch (error) {
    console.log(error);
    return null; 
  }
};

export const findAllReviews = () => ReviewModel.find();
export const findReviewById = (reviewId) => ReviewModel.findById(reviewId);
export const findReviewByReviewname = (reviewname) =>
  ReviewModel.findOne({ reviewname: reviewname });

export const updateReview = (reviewId, review) =>
  ReviewModel.updateOne({ _id: reviewId }, { $set: review });
export const deleteReview = (reviewId) => ReviewModel.deleteOne({ _id: reviewId });
export const findReviewsForReview = (reviewId) =>
  ReviewModel.findById(reviewId)
    .populate("reviews")
    .then((review) => review.reviews);

export const findReview = async (query) => {
  try {
    // Find a single review that matches the provided query,
    return await ReviewModel.findOne(query).lean();
  } catch (error) {
    console.log(error);
    return null; // Return null if an error occurs
  }
};

