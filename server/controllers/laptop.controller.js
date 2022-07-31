const Filter = require("../models/filter");
const Laptop = require("../models/product");
const s3Delete = require("../utils/delete-aws-s3");
const Blog = require("../models/blog");

exports.getLaptops = async (req, res, next) => {
  try {
    const laptops = await Laptop.find({}).populate("filter");
    return res.status(200).json(laptops);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.getLaptopsByIds = async (req, res, next) => {
  try {
    laptops = await Laptop.find({ laptop_id: { $in: req.body.id } });
    laptops = laptops.map((laptop, index) => {
      return {
        amount: req.body.amount[index],
        CPU: laptop.CPU,
        RAM: laptop.RAM,
        connection: laptop.connection,
        color: laptop.color,
        thumbnails: laptop.thumbnails,
        laptop_id: laptop.laptop_id,
        brand: laptop.brand,
        name: laptop.name,
        series: laptop.series,
        storage: laptop.storage,
        display: laptop.display,
        graphic: laptop.graphic,
        wireless: laptop.wireless,
        LAN: laptop.LAN,
        keyboard: laptop.keyboard,
        webcam: laptop.webcam,
        audio: laptop.audio,
        battery: laptop.battery,
        OS: laptop.OS,
        dimension: laptop.dimension,
        weight: laptop.weight,
        security: laptop.security,
        price: laptop.price,
        sale: laptop.sale,
        status: laptop.status,
      };
    });
    return res.status(200).json(laptops);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.getLaptop = async (req, res, next) => {
  try {
    const laptop = await Laptop.findOne({
      laptop_id: req.params.laptop_id,
    });
    const blog = await Blog.findOne(
      { belong_to: req.params.laptop_id },
      "content"
    );
    return res.status(200).json({ laptop: laptop, blog: blog });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.createlaptop = async (req, res, next) => {
  if (!req.files) return res.status(422).json({ msg: "Hãy tải ảnh lên" });
  var thumbnails = [];
  req.files.laptop.map((f) => {
    thumbnails.push(f.key);
  });
  const filterData = JSON.parse(req.body.filter);
  const filter = new Filter({
    need: filterData.need,
    cpu: filterData.cpu,
    ram: filterData.ram,
    storage: filterData.storage,
    vga: filterData.vga,
    screen_size: filterData.screen_size,
    screen_resolution: filterData.screen_resolution,
    os: filterData.os,
    price_range: filterData.price_range,
  });
  const laptop = new Laptop({
    laptop_id: req.body.laptop_id,
    brand: req.body.brand,
    name: req.body.name,
    series: req.body.series,
    CPU: {
      name: req.body.CPU_name,
      speed: req.body.CPU_speed,
      cache: req.body.CPU_cache,
    },
    RAM: {
      capacity: req.body.RAM_capacity,
      socket_number: req.body.RAM_socket_number,
    },
    storage: req.body.storage,
    display: req.body.display,
    graphic: req.body.graphic,
    wireless: req.body.wireless,
    LAN: req.body.LAN,
    connection: {
      USB: req.body.connection_USB,
      HDMI_VGA: req.body.connection_HDMI_VGA,
    },
    keyboard: req.body.keyboard,
    webcam: req.body.webcam,
    audio: req.body.audio,
    battery: req.body.battery,
    OS: req.body.OS,
    dimension: req.body.dimension,
    weight: req.body.weight,
    color: req.body.color,
    security: req.body.security,
    price: req.body.price,
    sale: req.body.sale,
    status: true,
    thumbnails: thumbnails,
    filter: filter._id,
  });

  const blog = new Blog({
    belong_to: laptop.laptop_id,
  });

  try {
    await filter.save();
    await laptop.save();
    await blog.save();
    return res.status(201).json({ msg: "Thêm sản phẩm thành công" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.editLaptop = async (req, res) => {
  updatedData = {
    brand: req.body.brand,
    name: req.body.name,
    series: req.body.series,
    CPU: {
      name: req.body.CPU_name,
      speed: req.body.CPU_speed,
      cache: req.body.CPU_cache,
    },
    RAM: {
      capacity: req.body.RAM_capacity,
      socket_number: req.body.RAM_socket_number,
    },
    storage: req.body.storage,
    display: req.body.display,
    graphic: req.body.graphic,
    wireless: req.body.wireless,
    LAN: req.body.LAN,
    connection: {
      USB: req.body.connection_USB,
      HDMI_VGA: req.body.connection_HDMI_VGA,
    },
    keyboard: req.body.keyboard,
    webcam: req.body.webcam,
    audio: req.body.audio,
    battery: req.body.battery,
    OS: req.body.OS,
    dimension: req.body.dimension,
    weight: req.body.weight,
    color: req.body.color,
    security: req.body.security,
    price: req.body.price,
    sale: req.body.sale,
  };
  try {
    const updatedLaptop = await Laptop.findOneAndUpdate(
      { laptop_id: req.params.laptop_id },
      updatedData,
      { new: true }
    );
    const filterData = JSON.parse(req.body.filter);
    const filter = {
      need: filterData.need,
      cpu: filterData.cpu,
      ram: filterData.ram,
      storage: filterData.storage,
      vga: filterData.vga,
      screen_size: filterData.screen_size,
      screen_resolution: filterData.screen_resolution,
      os: filterData.os,
      price_range: filterData.price_range,
    };
    await Filter.updateOne({ _id: updatedLaptop.filter }, filter);
    updatedLaptop.SyncToAlgolia();
    return res.status(200).json({ msg: "Cập nhật thành công" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.removeImageThumbnails = async (req, res) => {
  var s3Objects = [];
  var deletedThumbs = req.body;
  var thumbnails = [];
  try {
    const laptop = await Laptop.findOne({ laptop_id: req.query.laptop });

    thumbnails = laptop.thumbnails;

    deletedThumbs.map((thumb) => {
      s3Objects.push({ Key: thumb });
      thumbnails = thumbnails.filter((i) => i != thumb);
    });

    s3Delete.deleteS3Object(s3Objects);

    laptop.set("thumbnails", thumbnails);

    await laptop.save();
    laptop.SyncToAlgolia();
    return res.status(200).json({ msg: "Xoá ảnh thành công" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.addImageThumbnails = async (req, res) => {
  var thumbnails = [];
  req.files.laptop.map((f) => {
    thumbnails.push(f.key);
  });
  try {
    const updatedLaptop = await Laptop.findOneAndUpdate(
      { laptop_id: req.body.laptop_id },
      { $push: { thumbnails: thumbnails } },
      { new: true }
    );
    updatedLaptop.SyncToAlgolia();
    return res.status(200).json({ msg: "Thêm ảnh thành công" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.removeLaptop = async (req, res) => {
  try {
    var s3Objects = [];
    const laptop = await Laptop.findOneAndDelete({
      laptop_id: req.params.laptop_id,
    });
    var deletedThumbs = [].concat(laptop.thumbnails);
    deletedThumbs.map((thumb) => {
      s3Objects.push({ Key: thumb });
    });
    s3Delete.deleteS3Object(s3Objects);
    await Filter.deleteOne({ _id: laptop.filter });
    await Blog.deleteOne({ belong_to: laptop.laptop_id });
    laptop.RemoveFromAlgolia();
    return res.status(200).json({ msg: "Xoá thành công" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const laptop = await Laptop.findOneAndUpdate(
      { laptop_id: req.query.laptop_id },
      { status: req.query.value },
      { new: true }
    );
    laptop.SyncToAlgolia();
    return res.status(200).json({ msg: "Cập nhật thành công" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.rating = async (req, res) => {
  try {
    const laptop = await Laptop.findOne({ _id: req.query.laptopId });
    point = (laptop.interaction.rating_point + Number(req.query.rating)) / 2;
    laptop.interaction.rating_point = point.toFixed(1);
    laptop.interaction.rates = Number(laptop.interaction.rates) + 1;
    await laptop.save();
    return res.status(200).json({ msg: "Đánh gía sản phẩm thành công" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
