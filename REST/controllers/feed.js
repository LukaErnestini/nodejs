exports.getPosts = (req, res, next) => {
  res.status(200).json({ posts: [{ title: "post", content: "first post!" }] });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // create in db
  res.status(201).json({
    message: "Post created successfully!",
    post: {
      id: 1234,
      title,
      content,
    },
  });
};
