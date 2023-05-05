const jwt = require("../helpers/jwt");
const { user } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const payload = jwt.verifyToken(req.headers.token);
    if (!payload) {
      res.status(404).send({ message: "user not found payload" });
    }

    const userData = await user.findOne({
      where: { username: payload.username, password: payload.password },
    });
    // console.log(userData.dataValues, "ini user data di auth");

    if (!userData) {
      res.status(404).send({ message: "user not found" });
    } else {
      //   console.log(userData.dataValues, "ini user data di auth else");
      req.userlogin = userData.dataValues;
      //   console.log(req.userlogin);
      next();
    }
  } catch (err) {
    res.status(404).send({
      status: 404,
      message: "User not found",
    });
  }
};
