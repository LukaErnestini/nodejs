const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const Post = require("../models/post");
const { throwError } = require("../util/errors");

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  try {
    fs.unlink(filePath, (err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
};

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res.status(200).json({ message: "Fetched posts.", posts, totalItems });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) throwError(404, "Could not find post");
      res.status(200).json({ message: "Post fetched.", post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const error = validationResult(req).array()[0];
  if (error) throwError(422, "Validation failed.", { error });
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path.replace("\\", "/");
  const post = new Post({
    title,
    content,
    creator: { name: "Luka" },
    imageUrl,
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post created successfully!",
        post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const error = validationResult(req).array()[0];
  if (error) throwError(422, "Validation failed.", { error });
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image || req.file.path || undefined;
  // console.log(req.body.image);
  // console.log(req.file.path);
  if (imageUrl) imageUrl = imageUrl.replace("\\", "/");
  // console.log(imageUrl);
  if (!imageUrl) throwError(422, "No file picked");
  Post.findById(postId)
    .then((post) => {
      if (!post) throwError(404, "Could not find post");
      if (imageUrl !== post.imageUrl) clearImage(post.imageUrl);
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated.", post: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) throwError(404, "Could not find post");
      //check loggedin user
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted post." });
    })
    .catch((err) => {
      next(err);
    });
};