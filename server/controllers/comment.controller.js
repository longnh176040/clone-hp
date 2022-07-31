const Comment = require("../models/comment");
const Laptop =require("../models/product");

exports.addComment = async (req, res) => {
  const comment = new Comment({
    username: req.body.username,
    content: req.body.content,
    created_at: req.body.created_at,
    product: req.body.product,
  });
  try {
    const laptop = await Laptop.findById(req.body.product);
    laptop.interaction.comments = Number(laptop.interaction.comments) + 1;
    await laptop.save();
    await comment.save();
    return res.status(201).json({ _id: comment._id });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.addReply = async (req, res) => {
  // const comment = await Comment.findById(req.query.comment);
  try {
    await Comment.updateOne(
      { _id: req.query.id },
      {
        $push: {
          replies: {
            username: req.body.username,
            content: req.body.content,
            created_at: req.body.created_at,
          },
        },
      }
    );
    return res.status(200).json({ msg: "Bình luận thành công" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ product: req.query.product }).sort({
      $natural: -1,
    });
    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
