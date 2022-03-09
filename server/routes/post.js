const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const Post = require("../models/Post");

// @route POST api/posts
// @desc Create post
// @access Private

router.post("/", verifyToken, async (req, res) => {
  const { title, description, url, status, user } = req.body;
  //Simple validation
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is required " });
  try {
    const newPost = new Post({
      title,
      description,
      url: url.startsWith("https://") ? url : `https://${url}`,
      status: status || "TO LEARN",
      user: req.userId
    });
    await newPost.save();
    res.json({ success: true, message: "happy learning!", post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/posts
// @desc Get post
// @access Private

router.get("/", verifyToken, async (req, res) => {
  try {
    const postList = await Post.find({ user: req.userId }).populate("user", [
      "username"
    ]);
    res.status(200).json({ success: true, message: "Successfully", postList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PUT api/posts
// @desc Update post
// @access Private

router.put("/:id", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is required " });
  try {
    let updatedPost = {
      title,
      description: description || "",
      url: (url.startsWith("https://") ? url : `https://${url}`) || "",
      status: status || "TO LEARN"
    };

    const postUpdateCondition = { _id: req.params.id, user: req.userId };
    updatedPost = await Post.findOneAndUpdate(
      postUpdateCondition,
      updatedPost,
      { new: true }
    );

    // user not authorised to update post
    if (!updatedPost)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorized"
      });

    res.json({
      success: true,
      message: "Excellent progress",
      post: updatedPost
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/posts
// @desc Delete post
// @access Private

router.delete("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    const postDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedPost = await Post.findOneAndDelete(postDeleteCondition);

    // user not authorised to update post
    if (!deletedPost)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorized"
      });

    res.json({
      success: true,
      message: "Delete success",
      post: deletedPost
    });
  } catch (error) {}
});

module.exports = router;
