const Message = require("../models/message");
const _socket = require("../socket");

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find();
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const message = new Message({
      uid: req.body.uid,
      content: req.body.content,
      created_at: req.body.created_at,
      room_id: req.body.room_id,
      username: req.body.username,
    });
    await message.save();
    const admin = _socket.getAdmins()[0];
    const received_socket_id = req.body.received_socket_id ? req.body.received_socket_id : admin.socketId
    _socket.getIO().to(received_socket_id).emit("message", message)
    return res.status(200).json({ msg: "gui" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.getMessageByUser = async (req, res) => {
  try {
    const roomId = req.query.room;
    const messages = await Message.find({ room_id: roomId });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.deleteMessageByRoomId = async (req, res) => {
  try {
    const roomId = req.query.room;
    await Message.deleteMany({room_id: roomId});
  } catch (error) {
  }
}