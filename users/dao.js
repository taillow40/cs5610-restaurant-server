import UserModel from "./model.js";

// Function to add a new user to the database
export const createUser = async (data) => {
  try {
      // Create a new user using the UserModel schema
      const createdUser = await UserModel.create(data);

      // Extract the user data as a plain JavaScript object,
      const newUser = createdUser?.toJSON();
      delete newUser?.password;

      return newUser;
  } catch (error) {
      console.log(error);
      return null; // Return null if an error occurs
  }
}

export const findAllUsers = () => UserModel.find();
export const findUserById = (userId) => UserModel.findById(userId);
export const findUserByUsername = (username) =>
  UserModel.findOne({ username: username });
export const findUserByCredentials = (usr, pass) => UserModel.findOne({ username: usr, password: pass });
export const updateUser = (userId, user) =>
  UserModel.updateOne({ _id: userId }, { $set: user });
export const deleteUser = (userId) => UserModel.deleteOne({ _id: userId });
export const findFriendsForUser = (userId) => UserModel.findById(userId).populate("friends").then(user => user.friends);

// Function to find a single user based on the provided query
export const findUser = async (query) => {
  try {
      // Find a single user that matches the provided query,
      return await UserModel.findOne(query).lean();
  } catch (error) {
      console.log(error);
      return null; // Return null if an error occurs
  }
}

// Function to update a user session on the provided query and session, excluding the password field
export const addSession = async (query, session) => {
  try {
      // Find and update the user that matches the provided query, excluding the password field
      return await UserModel.findOneAndUpdate(query, { $push: { sessions: session } }, { new: true }).select('-password').lean();
  } catch (error) {
      console.log(error);
      return null; // Return null if an error occurs
  }
}

// Function to delete user session
export const deleteSession = async (userId, sessionId) => {
  try {
      // Find and update the cart to remove the specified item
      return await UserModel.findOneAndUpdate({ userId, 'sessions.id': sessionId }, { $pull: { sessions: { id: sessionId } } }, { new: true });
  } catch (error) {
      console.log(error);
      return null; // Return null if an error occurs
  }
}