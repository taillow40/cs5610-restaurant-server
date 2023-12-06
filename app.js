// const express = require("express");
import "dotenv/config"
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
const CONNECTION_STRING = process.env.DB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/kanbas'

mongoose.connect(CONNECTION_STRING);
import UserRoutes from "./users/routes.js";
import YelpRoutes from "./yelp/routes.js";
import cors from "cors";
const app = express();
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
  })
);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  next();
});
const sessionOptions = {
  secret: "any string",
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}
app.use(session(sessionOptions));



UserRoutes(app);
YelpRoutes(app);

app.listen(process.env.PORT || 4000, () => {
  console.log('listening on port 4000');
});