const db = require("../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createToken, verifyExpiration } = db.authToken;

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await db.User.findOne({
      where: { email },
    });
    if (userExists) {
      return res.status(400).send("Email is alredy associeted with an account");
    }
    await db.User.create({
      name,
      email,
      password: await bcrypt.hash(password, 15),
    });
    return res.status(200).send("Registration succesful");
  } catch (err) {
    return res.status(500).send("Error in registering user");
  }
};

const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(404).json("Email not found");
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    let refreshToken = await createToken(user);
    res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (err) {
    return res.status(500).send("Sign in error");
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).send("refresh Token is required!");
  }
  try {
    let refreshToken = await db.authToken.findOne({
      where: { token: requestToken },
    });
    if (!refreshToken) {
      res.status(403).send("Invalid refresh token");
      return;
    }
    if (verifyExpiration(refreshToken)) {
      db.authToken.destroy({ where: { id: refreshToken.id } });
      res
        .status(403)
        .send("Refresh token was expired. Please make a new sign in request");
      return;
    }
    const user = await db.User.findOne({
      where: { id: refreshToken.user },
      attributes: {
        exclude: ["password"],
      },
    });

    let newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).send("Internal server error");
  }
};

module.exports = {
  registerUser,
  signInUser,
  refreshToken,
};
