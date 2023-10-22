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
  // Memeriksa apakah pengguna yang melakukan permintaan tidak sama dengan pengguna yang diikuti
  if (req.body.userId != req.params.id) {
    try {
      // Mencari pengguna yang diikuti berdasarkan ID yang diberikan
      const user = await User.findById(req.params.id);

      // Mencari pengguna yang melakukan permintaan berdasarkan ID yang diberikan
      const currentUser = await User.findById(req.body.userId);

      // Memeriksa apakah pengguna yang melakukan permintaan belum mengikuti pengguna yang diikuti
      if (!user.followers.includes(req.body.userId)) {
        // Mengikuti pengguna yang diikuti dengan menambahkan pengikut
        await user.updateOne({ $push: { followers: req.body.userId } });

        // Memperbarui pengguna yang melakukan permintaan dengan menambahkan yang diikuti
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

//unfollow user
router.put("/:id/unfollow", async (req, res) => {
  // Pengecekan apakah pengguna yang melakukan permintaan tidak sama dengan pengguna yang akan di-unfollow
  if (req.body.userId !== req.params.id) {
    try {
      // Mencari pengguna yang akan di-unfollow berdasarkan ID yang diberikan
      const user = await User.findById(req.params.id);

      // Mencari pengguna yang melakukan permintaan berdasarkan ID yang diberikan
      const currentUser = await User.findById(req.body.userId);

      // Memeriksa apakah pengguna yang melakukan permintaan sudah mengikuti pengguna yang akan di-unfollow
      if (!user.followers.includes(req.body.userId)) {
        // Melakukan unfollow dengan menghapus pengikut (followers)
        await user.updateOne({ $pull: { followers: req.body.userId } });

        // Menghapus pengguna yang melakukan permintaan dari daftar followers pengguna yang akan di-unfollow
        await currentUser.updateOne({ $pull: { followers: req.params.id } });
        return res.status(200).json("User has been unfollowed");
      } else {
        return res.status(403).json("You dont follow this user");
      }
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
});
module.exports = router;
