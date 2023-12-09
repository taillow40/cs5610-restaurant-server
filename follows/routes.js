import * as dao from "./dao.js";

function FollowsRoutes(app) {
  const incrementFollow = async (req, res) => {
    const { userId, followingId } = req.body;
    const follows = await dao.incrementFollower(userId, followingId);
    res.json(follows);
  };
  const userUnfollowsUser = async (req, res) => {
    const { userId, followingId } = req.body;
    const status = await dao.userUnfollowsUser(userId, followingId);
    res.json(status);
  };
  const findFollowersOfUser = async (req, res) => {
    const followers = await dao.findfollowingsOfUser(req.params.id);
    res.json(followers);
  };
  const findFollowedUsersByUser = async (req, res) => {
    const followed = await dao.findFollowedUsersByUser(req.params.id);
    res.json(followed);
  };

  app.post("/api/follows", incrementFollow);
  app.put("/api/follows", userUnfollowsUser);
  app.get("/api/follows/:id/followers", findFollowersOfUser);
  app.get("/api/follows/:id/following", findFollowedUsersByUser);
}

export default FollowsRoutes;
