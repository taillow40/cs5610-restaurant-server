import { userSignUpValidation, loginValidation } from "./validation.js";
import { userAuthentication } from "../middlewares/authenticate.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwt.js";
import * as dao from "./dao.js";
import mongoose from "mongoose";
import { randomUUID } from "crypto";
import { projectConfig } from "../config.js";
import UserModel from "./model.js";
 
function UserRoutes(app) {
  const createUser = async (req, res) => {
    // console.log(req.body);
    const user = await dao.createUser(req.body);
    res.json(user);
  };
 
  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };
 
  const findAllUsers = async (req, res) => {
    const users = await dao.findAllUsers();
    res.json(users);
  };
 
  const findUserById = async (req, res) => {
    const id = req.params.userId.toString();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("invalid id when finding user: " + id);
      res.status(400).send("invalid id");
      return;
    }
    const user = await dao.findUserById(id);
    if (!user) {
      res.status(404);
    } else {
      res.json(user);
    }
  };
 
  const updateUser = async (req, res) => {
    const { userId } = req.params;
    console.log("req.body", req.body);
    const status = await dao.updateUser(userId, req.body);
    const currentUser = await dao.findUserById(userId);
    req.session["currentUser"] = currentUser;
    res.json(status);
  };
 
  const friends = async (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).send("invalid id when finding friends: " + userId);
      return;
    }
    const friends = await dao.findFriendsForUser(userId);
    friends.map((friend) => (friend = dao.findUserById(friend._id)));
    res.json(friends);
  };
 
  const signup = async (req, res) => {
    // Validate user information
    const validation = userSignUpValidation(req.body);
    if (validation.error) {
      return res
        .status(422)
        .json({ success: false, message: validation.error.details[0].message });
    }
 
    // Check if the user already exists
    const userExists = await dao.findUser({
      email: req.body.email,
      type: req.body.type,
    });
    console.log(userExists);
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });
    }
    // Save user into the database
    const user = await dao.createUser(req.body);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to sign up" });
    }
 
    return res.status(201).json({ success: true, data: user });
  };
 
  const signin = async (req, res) => {
    try {
      const { email, password, type } = req.body;
 
      // Validate login information
      const validation = loginValidation(req.body);
      if (validation.error) {
        return res.status(422).json({
          success: false,
          message: validation.error.details[0].message,
        });
      }
 
      // Find user with password
      const user = await dao.findUser({ email, type, password });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email or password" });
      }
 
      const sessionId = randomUUID();
 
      // Update user with session
      await dao.addSession({ _id: user._id }, { id: sessionId });
 
      // Generate a JWT token
      const token = generateToken({ ...user, session: sessionId });
      return res.json({ success: true, data: token });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  };
 
  const signout = async (req, res) => {
    try {
      const { _id, session } = req.user;
 
      // Delete the session
      dao.deleteSession(_id, session);
 
      // Return success response after destroying the session
      return res.json({ success: true, message: "Logout successful" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  };
 
  const account = async (req, res) => {
    const { _id, type } = req.user;
    try {
      const user = await dao.findUser({ _id, type });
      console.log(user);
      return res.status(200).send({ success: true, data: user });
    } catch (err) {
      console.log(err);
      return res.status(403).send({ success: false, message: "Invalid Token" });
    }
  };
 
  const checkAuth = async (req, res) => {
    const { token } = req.body;
 
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "A token is required for authentication",
      });
    }
    try {
      const decoded = jwt.verify(token, projectConfig?.jwt?.key);
      const user = await dao.findUser({ _id: decoded?._id });
      if (!user)
        return res
          .status(403)
          .send({ success: false, message: "Invalid Token" });
      return res.status(200).send({ success: true, data: "Verified" });
    } catch (err) {
      console.log(err);
      return res.status(403).send({ success: false, message: "Invalid Token" });
    }
  };
 
  const reviews = async (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res
        .status(400)
        .send("invalid id when finding reviews: " + restauranuserIdtId);
      return;
    }
    const reviews = await dao.reviews(userId);
    res.json(reviews);
  };
 
  const addFriend = async (req, res) => {
    console.log(req.body);
    const userId = req.body.userId;
    const friendId = req.body.friendId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: "Invalid friend ID" });
    }
 
    // Update the user with the new review
    const updatedFriend = await UserModel.findByIdAndUpdate(
      friendId,
      { $push: { friends: userId } },
      { new: true }
    );
 
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { friends: friendId } },
      { new: true }
    );
 
    res.json(updatedUser);
  };
 
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", userAuthentication, signout);
  app.get("/api/users/account", userAuthentication, account);
  app.post("/api/users/check-token", checkAuth);
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/:userId/friends", friends);
  // app.get("/api/users/:userId", findUserById);
}

export default UserRoutes;