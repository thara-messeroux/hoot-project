const router = require("express").Router();
const User = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "username");
    res.json(users);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});


router.get("/me", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

module.exports = router;
