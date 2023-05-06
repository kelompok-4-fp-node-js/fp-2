const { comment, user, photo } = require("../models");
const jwt = require("../helpers/jwt");
const bcrypt = require("../helpers/bcrypt");

module.exports = class {
  static async get(req, res) {
    try {
      const result = await comment.findAll({
        include: [
          {
            model: photo,
            attributes: { exclude: ["createdAt", "updatedAt", "UserId"] },
          },
          {
            model: user,
            attributes: ["id", "username", "profile_image_url", "phone_number"],
          },
        ],
      });
      res.json({
        message: result,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async create(req, res) {
    try {
      const commentt = req.body.comment;
      const PhotoId = req.body.PhotoId;
      const findPhoto = await photo.findOne({ where: { id: PhotoId } });
      console.log(findPhoto);
      // res.send("ok");
      if (!findPhoto) {
        res.status(404).json({ message: "Data with PhotoId " + PhotoId + " not found" });
        return;
      }
      const create = await comment.create({ UserId: req.userLogin.id, PhotoId: PhotoId, comment: commentt });

      res.status(201).json({ comment: create });
    } catch (error) {
      res.status(400).json({ message: error.errors[0].message });
    }
  }
  static async update(req, res) {
    try {
      const commentt = req.body.comment;
      const { commentId } = req.params;

      const updateTarget = await comment.findByPk(commentId);
      if (!updateTarget) {
        res.status(404).json({ message: "data with id " + commentId + " not found" });
        return;
      } else if (req.userLogin.id !== updateTarget.dataValues.UserId) {
        res.status(401).json({ message: "You're prohibited to access this data" });
        return;
      }

      const updateComment = await updateTarget.update({ comment: commentt });

      res.status(200).json({ comment: updateComment });
    } catch (error) {
      res.status(400).json({ message: error.errors[0].message });
    }
  }
  static async delete(req, res) {
    try {
      // res.send("ok");
      const { commentId } = req.params;

      const deleteTarget = await comment.findByPk(commentId);
      if (!deleteTarget) {
        res.status(404).json({ message: "data with id " + commentId + " not found" });
        return;
      } else if (req.userLogin.id !== deleteTarget.dataValues.UserId) {
        res.status(401).json({ message: "You're prohibited to access this data" });
        return;
      }
      const deleteComment = await deleteTarget.destroy({ returning: true });
      res.status(200).json({ message: "Your comment has been succesfuly deleted" });
    } catch (error) {
      res.status(500).json(error);
    }
  }
};
