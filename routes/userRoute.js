const router = require("express").Router();
const User = require("../models/userModel");

router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    //mencari teman-teman yang diikuti oleh pengguna. user.followings adalah array yang berisi ID teman-teman yang diikuti oleh pengguna
    const friends = await Promise.all(
      user.followings.map((fri_id) => {
        return user.findById(fri_id);
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
    return res.status(500).json(error);
  }
});

module.exports = router;
