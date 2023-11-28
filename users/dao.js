import model from "./model.js";
export const createUser = (user) => {
  try {
    // Code to insert new user
    model.create(user);
} catch (error) {
    if (error.code === 11000) {
        console.error('Username already exists:', error.keyValue);
        // Handle the duplicate username error
        // For example, send back a response to the client
    } else {
        // Handle other types of errors
    }
}
  
}
export const findAllUsers = () => model.find();
export const findUserById = (userId) => model.findById(userId);
export const findUserByUsername = (username) =>
  model.findOne({ username: username });
export const findUserByCredentials = (usr, pass) => model.findOne({ username: usr, password: pass });
export const updateUser = (userId, user) =>
  model.updateOne({ _id: userId }, { $set: user });
export const deleteUser = (userId) => model.deleteOne({ _id: userId });
export const findFriendsForUser = (userId) => model.findById(userId).populate("friends").then(user => user.friends);
