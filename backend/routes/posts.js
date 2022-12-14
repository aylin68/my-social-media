const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

//create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//comment on post
router.put("/comment/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.updateOne({ $push: { comments: req.body } });
    res.status(200).json("comment has been added");
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (req.body.userId === post.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("post has been updated");
    } else {
      res.status(403).json("you can update only your posts");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (req.body.userId === post.userId) {
      await post.deleteOne();
      res.status(200).json("post has been deleted");
    } else {
      res.status(403).json("you can deleted only your posts");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like/dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPost = await Post.find({ userId: currentUser._id });
    const friendsPost = await Promise.all(
      currentUser.followings.map((friendsId) => {
        return Post.find({ userId: friendsId });
      })
    );
    res.status(200).json(userPost.concat(...friendsPost));
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
