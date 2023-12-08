import FavoriteModel from "./model.js";

// Function to add a new restaurant to the database
export const addToFavorites = async (body) => {
  try {
    const { userId, restaurantId } = body;
    let favorite = await FavoriteModel.findOne({ user: userId });

    if (!favorite) {
      // If the user doesn't exist, create a new favorite entry
      favorite = new FavoriteModel({
        user: userId,
        restaurants: [restaurantId],
      });
      await favorite.save();
    } else {
      // If the user exists, update the existing favorite entry
      if (!favorite.restaurants.includes(restaurantId)) {
        favorite.restaurants.push(restaurantId);
        await favorite.save();
      }
    }

    return favorite;
  } catch (error) {
    // Handle any errors
    console.error(error);
    throw error;
  }
};

export const removeFavorites = async (body) => {
  try {
    const { userId, restaurantId } = body;
    let favorite = await FavoriteModel.findOne({ user: userId });
    let filtered = favorite.restaurants
      .slice()
      .filter((rid) => rid != restaurantId);
    favorite.restaurants = filtered;
    await favorite.save();

    return favorite;
  } catch (error) {
    // Handle any errors
    console.error(error);
    throw error;
  }
};

export const getFavorites = async (id) => {
  try {
    let favorite = await FavoriteModel.findOne({ user: id });

    if (!favorite) return [];
    return favorite;
  } catch (error) {
    // Handle any errors
    console.error(error);
    throw error;
  }
};

export const getUserFavoritesFull = async (id) => {
  try {
    let favorite = await FavoriteModel.findOne({ user: id }).populate("restaurants");

    if (!favorite) return [];
    return favorite;
  } catch (error) {
    // Handle any errors
    console.error(error);
    throw error;
  }
};
