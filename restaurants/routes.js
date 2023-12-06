
import * as dao from "./dao.js";
import mongoose from "mongoose";
import {restaurantFromId} from "../yelp/functions.js"
import Database from "../Database/index.js"

function RestaurantRoutes(app) {
  const createRestaurant = async (req, res) => {
    const restaurant = await dao.createRestaurant(req.body);
    res.json(restaurant);
  };

  const deleteRestaurant = async (req, res) => {
    const status = await dao.deleteRestaurant(req.params.restaurantId);
    res.json(status);
  };

  const findAllRestaurants = async (req, res) => {
    const restaurants = await dao.findAllRestaurants();
    res.json(restaurants);
  };

  const findRestaurantById = async (req, res) => {
    const id = req.params.restaurantId.toString();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("invalid id when finding restaurant: " + id);
      res.status(400).send("invalid id");
      return;
    }

    try {

      const restaurant = await dao.findRestaurantById(id);
      if (!restaurant) {
        res.status(404).send("Restaurant Not found");
      } else {
        res.json(restaurant);
      }

    } catch(error){
      console.error("Error finding restaurant in MongoDB", error);
      try{

        const filteredRestaurant = Database.restaurants.filter((r) => r.id !== id) 
        if(!filteredRestaurant){
          res.status(404).send("Restaurant not found locally");
        }
        else{
          res.json(filteredRestaurant);
        }
      }
      catch(localDataError){
        console.error("Error reading local data:", localDataError);
        res.status(500).send("Internal Server Error");
      }
    }
  };

  const updateRestaurant = async (req, res) => {
    const { restaurantId } = req.params;
    const status = await dao.updateRestaurant(restaurantId, req.body);
    const currentRestaurant = await dao.findRestaurantById(restaurantId);
    req.session["currentRestaurant"] = currentRestaurant;
    res.json(status);
  };

  const reviews = async (req, res) => {
    const { restaurantId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      res.status(400).send("invalid id when finding reviews: " + restaurantId);
      return;
    }
    const reviews = await dao.findReviewsForRestaurant(restaurantId);
    res.json(reviews);
  };


  const createRestaurantFromYelp = async (req, res) => {
    //console.log(req)
    const response = await restaurantFromId(req.body.id);
    const restaurantData = {
      name: response.name,
      Lat: response.coordinates.latitude,
      Long: response.coordinates.longitude,
      streetAddress: response.location.address1,
      City: response.location.city,
      zipCode: response.location.zip_code,
      cuisine: response.categories.map(category => category.title)
  };
    const restaurant = await dao.createRestaurant(restaurantData);
    res.json(restaurant)
  };

  const filterRestaurants = async (searchCriteria) => {
    const { name, cuisine, zipCode, city, streetAddress } = searchCriteria;

    let restaurants = await dao.findAllRestaurants();

    if (!restaurants){
      restaurants = Database.restaurants;
    }

    return restaurants.filter((restaurant) => {
      const nameMatch = name ? restaurant.name.toLowerCase().includes(name.toLowerCase()) : true;
      const cuisineMatch = cuisine ? restaurant.cuisine.some(c => c.toLowerCase().includes(cuisine.toLowerCase())) : true;
      const zipCodeMatch = zipCode ? restaurant.zipCode.toLowerCase().includes(zipCode.toLowerCase()) : true;
      const cityMatch = city ? restaurant.city.toLowerCase().includes(city.toLowerCase()) : true;
      const streetAddressMatch = streetAddress ? restaurant.streetAddress.toLowerCase().includes(streetAddress.toLowerCase()) : true;
  
      return nameMatch && cuisineMatch && zipCodeMatch && cityMatch && streetAddressMatch;
    });
  };
  
  app.get('/api/search', async (req, res) => {
    try {
      const { name, cuisine, zipCode, city, streetAddress } = req.query;
  
      const searchCriteria = {
        name,
        cuisine,
        zipCode,
        city,
        streetAddress,
      };
  
      const searchResults = await filterRestaurants(searchCriteria);
      console.log("Search Results:", searchResults);
      res.json(searchResults);

    } catch (error) {
      console.error('Error in search endpoint:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  

  app.post("/api/restaurants", createRestaurant);
  app.get("/api/restaurants", findAllRestaurants);
  app.put("/api/restaurants/:restaurantId", updateRestaurant);
  app.delete("/api/restaurants/:restaurantId", deleteRestaurant);
  app.post("/api/restaurants/:restaurantId/reviews", reviews);
  app.get("/api/restaurants/:restaurantId", findRestaurantById);
  app.post("/api/restaurants/createFromYelp", createRestaurantFromYelp);
}
export default RestaurantRoutes;
