import FollowModel from "./model.js";

export const incrementFollower = async (userId, followingId) => {
  try {
    let follows = await FollowModel.findOne({ user: userId });

    if (!follows) {
      follows = new FollowModel({
        user: userId,
        followings: [followingId],
      });
      await follows.save();
    } else {
      if (!follows.followings.includes(followingId)) {
        follows.followings.push(followingId);
        await follows.save();
      }
    }
    return follows;
  } catch (error) {
    // Handle any errors
    console.error(error);
    return error;
  }
};

export const userUnfollowsUser = async (userId, followingId) => {
  try {
    const follows = await FollowModel.findOne({ user: userId });

    if (follows && follows.followings.includes(followingId)) {
      follows.followings = follows.followings.filter(
        (id) => id.toString() !== followingId.toString()
      );
      await follows.save();
      return follows;
    } else {
      throw new Error("User not found or not following");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const findfollowingsOfUser = async (userId) => {
  return FollowModel.find({ user: userId }).populate("followings");
};
export const findFollowedUsersByUser = async (userId) => {
  try {
    const users = await FollowModel.find({ followings: userId }).populate(
      "user"
    );
    console.log(users);
    return users;
  } catch (error) {
    console.error(error);
    return error;
  }
};
