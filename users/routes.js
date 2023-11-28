import * as dao from "./dao.js";
import mongoose from 'mongoose'
function UserRoutes(app) {
    const createUser = async (req, res) => {
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
    if(!mongoose.Types.ObjectId.isValid(id)){
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
    const status = await dao.updateUser(userId, req.body);
    const currentUser = await dao.findUserById(userId);
    req.session['currentUser'] = currentUser;
    res.json(status);
  };

  const friends = async (req, res) => {
    const {userId} = req.params;
    if(!mongoose.Types.ObjectId.isValid(userId)){
      res.status(400).send("invalid id when finding friends: " + userId);
      return;
    }
    const friends = await dao.findFriendsForUser(userId);
    friends.map(friend => friend = dao.findUserById(friend._id));
    res.json (friends);
  };
  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(
      req.body.username);
    if (user) {
      res.status(400).json(
        { message: "Username already taken" });
    }
    const currentUser = await dao.createUser(req.body);
    req.session['currentUser'] = currentUser;
    res.json(currentUser);
  };

  const signin = async (req, res) => { 
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    req.session['currentUser'] = currentUser;

    res.json(currentUser);
    app.post("/api/users/signin", signin);
  };
  const signout = (req, res) => {
    req.session.destroy();
    res.json(200);
  };

  const account = async (req, res) => {
    if(!req.session || !req.session['currentUser']){
      res.status(400);
    } else {
      res.json(req.session['currentUser']);
    }
   
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/account", account);
  app.post("/api/users/:userId/friends", friends);
}
export default UserRoutes;