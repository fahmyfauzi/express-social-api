const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

//register api
router.post("/register", async (req, res) => {
  try {
    //generate password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const user = await newUser.save();

    //success create user
    return res.status(201).json({
      message: "Account created successfully!! please verify..",
      user: user,
    });
  } catch (err) {
    //error create user
    return res.status(500).json(err);
  }
});

//login api
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("email is not found!");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(422).json("Wrong credentials!");

    const { password, ...others } = user._doc;
    res.status(200).json({
      message: "Logged in successfully!!",
      user: others,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
