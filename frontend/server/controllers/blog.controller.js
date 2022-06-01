const Blog = require("../models/blog");

exports.upload = async (req, res) => {
  const imagePath = req.file.location;
  return res.status(201).json({
    success: 1,
    file: {
      url: imagePath,
    },
  });
};

exports.get = async (req, res) => {
  try {
    const blog = await Blog.findOne({ belong_to: req.params.laptop_id });
    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const raw_content = JSON.parse(req.body.raw_content);
    const blog = Blog({
      content: JSON.parse(req.body.content),
      created_at: req.body.created_at,
      raw_content: raw_content,
      belong_to: req.query.laptop_id,
    });
    await blog.save();
    return res.status(201).json({ msg: "Tạo Blog" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.edit = async (req, res) => {
  try {
    const blog = await Blog.findOne({ belong_to: req.query.laptop_id });
    const raw_content = JSON.parse(req.body.raw_content);
    blog.set("raw_content", raw_content);
    blog.set("content", JSON.parse(req.body.content));

    await blog.save();
    return res.status(200).json({ msg: "Cập nhật" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
