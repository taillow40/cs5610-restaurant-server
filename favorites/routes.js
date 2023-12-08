
import * as dao from "./dao.js";
import mongoose from "mongoose";


function FavoritestRoutes(app) {
  const addToFavorites = async (req, res) => {
    const restaurant = await dao.addToFavorites(req.body);
    res.json(restaurant);
  };
  
  const getUserFavorites = async (req, res) => {
    const restaurant = await dao.getFavorites(req.params.id);
    res.json(restaurant);
  };
  const getUserFavoritesFull = async (req, res) => {
    const restaurant = await dao.getUserFavoritesFull(req.params.id);
    res.json(restaurant);
  };
  const removeFavorites = async (req, res) => {
    const restaurant = await dao.removeFavorites(req.body);
    res.json(restaurant);
  };
  

  app.post("/api/favorites", addToFavorites);
  app.get("/api/favorites/user-favorites/:id", getUserFavorites);
  app.get("/api/favorites/user-favorites-full/:id", getUserFavoritesFull);
  app.put("/api/favorites", removeFavorites);
}
export default FavoritestRoutes;
