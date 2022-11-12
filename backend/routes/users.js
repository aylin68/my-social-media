const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//get all users
router.get("/all", async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get friends
router.get("/friends/:id", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const friendsOnlineFriends = await Promise.all(
      currentUser.followings.map((friendsId) => {
        return User.find({ _id: friendsId });
      })
    );
    //const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(friendsOnlineFriends);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("you can not update only your account!");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.params.id === req.body.userId || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("you can not delete only your account!");
  }
});

//find user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });

    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.params.id !== req.body.userId) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(currentUser._id)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow your self");
  }
});

//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.params.id !== req.body.userId) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(currentUser._id)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow your self");
  }
});

module.exports = router;
