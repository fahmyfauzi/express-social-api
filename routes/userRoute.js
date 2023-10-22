const router = require("express").Router();
const User = require("../models/userModel");

router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    //mencari teman-teman yang diikuti oleh pengguna. user.followings adalah array yang berisi ID teman-teman yang diikuti oleh pengguna
    const friends = await Promise.all(
      user.followings.map((fri_id) => {
        return User.findById(fri_id);
      })
    );

    //deklarasikan sebagai array kosong yang akan digunakan untuk menyimpan daftar teman-teman yang akan dikirimkan sebagai respons.
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    return res.status(200).json(friendList);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//follow user
router.put("/:id/follow", async (req, res) => {
  console.log(req.body._id, req.params.id);
  if (req.body.userId != req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        return res.status(200).json("User has been followed");
      } else {
        return res.status(403).json("you already followed user");
      }
    } catch (err) {
      return res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("you can't follow yourself");
  }
});

module.exports = router;
