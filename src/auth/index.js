const express = require("express");
const crypto = require("crypto");
const cookie = require("cookie");
const { getTokens, refreshTokenTokenAge } = require("./utils");
const { passwordSecret, fakeUser } = require("./data");

const authRouter = express.Router();

authRouter.post("/login", (req, res) => {
  const { login, password } = req.body;

  const hash = crypto
    .createHmac("sha256", passwordSecret)
    .update(password)
    .digest("hex");
  const isVerifiedPassword = hash === fakeUser.passwordHash;

  if (login !== fakeUser.login || !isVerifiedPassword) {
    return res.status(401).send("Login fail");
  }

  const { accessToken, refreshToken } = getTokens(login);

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenTokenAge,
    })
  );
  res.send({ accessToken });
});

module.exports = authRouter;
