import RestaurantModel from "./model.js";

// Function to add a new restaurant to the database
export const createRestaurant = async (data) => {
  try {
    const createdRestaurant = await RestaurantModel.create(data);

    const newRestaurant = createdRestaurant?.toJSON();
    delete newRestaurant?.password;

    return newRestaurant;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const findAllRestaurants = () => RestaurantModel.find();
export const findRestaurantById = (restaurantId) =>
  RestaurantModel.findById(restaurantId);
export const findAllRestaurantsByCuisine = async (cuisines) => {
  try {
    if (!Array.isArray(cuisines)) return [];
    const restaurants = await RestaurantModel.find({
      cuisine: { $in: cuisines },
    });
    return restaurants;
  } catch (error) {
    console.log("error :: ", error);
    return Error(error);
  }
};
export const findRestaurantByRestaurantname = (restaurantname) =>
  RestaurantModel.findOne({ restaurantname: restaurantname });

export const updateRestaurant = (restaurantId, restaurant) =>
  RestaurantModel.updateOne({ _id: restaurantId }, { $set: restaurant });
export const deleteRestaurant = (restaurantId) =>
  RestaurantModel.deleteOne({ _id: restaurantId });
export const findReviewsForRestaurant = (restaurantId) =>
  RestaurantModel.findById(restaurantId)
    .populate("reviews")
    .then((restaurant) => restaurant.reviews);

export const findRestaurant = async (query) => {
  try {
    // Find a single restaurant that matches the provided query,
    return await RestaurantModel.findOne(query).lean();
  } catch (error) {
    console.log(error);
    return null; // Return null if an error occurs
  }
};
