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

module.exports = router;
