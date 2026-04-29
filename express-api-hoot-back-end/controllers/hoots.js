const express = require("express");
const verifyJwt = require("../middlewares/verify-jwt");
const Hoot = require("../models/hoot");
const router = express.Router();

// Get All Hoots Index
 router.get("/", verifyJwt, async (req, res) => {
  try {
    const hoots = await Hoot.find({})
      .populate("author")
      .sort({ createdAt: "desc" });

    res.status(200).json(hoots);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Create Hoot
router.post("/", verifyJwt, async (req, res) => {
  try {
    req.body.author = req.user._id;

    const hoot = await Hoot.create(req.body);

    hoot._doc.author = req.user;

    res.status(201).json(hoot);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// SHOW Hoot (show one hoot)
router.get("/:hootId", verifyJwt, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId).populate([
      "author",
      "comments.author",
    ]);

    res.status(200).json(hoot);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Update Hoot
router.put("/:hootId", verifyJwt, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId);

    if (!hoot.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const updatedHoot = await Hoot.findByIdAndUpdate(
      req.params.hootId,
      req.body,
      { new: true }
    );

    updatedHoot._doc.author = req.user;

    res.status(200).json(updatedHoot);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Delete Hoot
router.delete("/:hootId", verifyJwt, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId);

    if (!hoot.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const deletedHoot = await Hoot.findByIdAndDelete(req.params.hootId);

    res.status(200).json(deletedHoot);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Create Comment
router.post("/:hootId/comments", verifyJwt, async (req, res) => {
  try {
    req.body.author = req.user._id;

    const hoot = await Hoot.findById(req.params.hootId);

    hoot.comments.push(req.body);

    await hoot.save();

    const newComment = hoot.comments[hoot.comments.length - 1];

    newComment._doc.author = req.user;

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Update Comment
router.put("/:hootId/comments/:commentId", verifyJwt, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId);
    const comment = hoot.comments.id(req.params.commentId);

    if (comment.author.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this comment" });
    }

    comment.text = req.body.text;

    await hoot.save();

    res.status(200).json({ message: "Comment updated successfully" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Delete Comment
router.delete("/:hootId/comments/:commentId", verifyJwt, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId);
    const comment = hoot.comments.id(req.params.commentId);

    if (comment.author.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }

    hoot.comments.remove({ _id: req.params.commentId });

    await hoot.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;