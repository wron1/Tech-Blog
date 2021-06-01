const router = require("express").Router();
const { User, Comment, Post } = require("../models/");

// Dashboard Post route
router.post("/dashboard", async (req, res) => {
  console.log(req.body);
  const thePost = req.body;
  try {
    const newPost = Post.create({
      title: thePost.title,
      content: thePost.content,
      user_id: req.session.user_id,
    });
    res.send(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Login route
router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const userCheck = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (userCheck.length === 0) {
      res.status(400).json({ message: "Wrong email or password, try again" });
      return;
    }

    const correctPassword = await userCheck.checkPassword(req.body.password);

    if (!correctPassword) {
      res.status(400).json({ message: "Wrong email or password, try again" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userCheck.id;
      req.session.logged_in = true;
      console.log("Youre logged in");
      res.json({ user: userCheck, message: "You are logged in!" });
      res.send("okay");
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    }).then((newUser) => {
      res.json(newUser);
      res.send("okay");
    });
  } catch (err) {
    console.log(err);
  }
});

// Logout route
router.post("/logout", async (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end;
      res.send("okay");
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
