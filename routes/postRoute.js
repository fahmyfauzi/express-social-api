const router = require("express").Router();
const Post = require("../models/postModel");

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(201).json({
      message: "Post created successfully!",
      data: savedPost,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId == req.body.userId) {
      await Post.updateOne({ $set: req.body, new: true });
      return res.status(200).json({
        message: "Your post has been updated!",
        data: post,
      });
    } else {
      return res.status(403).json("You can only update your post!");
    }
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId == req.body.userId) {
      await Post.deleteOne({ $set: req.body }, { new: true });
      return res.status(200).json({
        message: "Your post has been deleted!",
        data: post,
      });
    } else {
      return res.status(403).json("You can only delete your post!");
    }
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const post = await Post.find();
    return res.status(200).json({
      message: "success get all your posts",
      data: post,
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//post like or dislike API
router.get("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await Post.updateOne({ $push: { likes: req.body.userId } });
      return res.status(200).json("the post has been liked!");
    } else {
      await Post.updateOne({ $pull: { likes: req.body.userId } });
      return res.status(200).json("the post has been disliked");
    }
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//get api by id
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    return res.status(200).json({
      message: "success get post by id",
      data: post,
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
});
module.exports = router;
