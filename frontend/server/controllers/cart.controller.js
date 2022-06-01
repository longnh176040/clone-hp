const Cart = require("../models/cart");

exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user_id: req.params.id });
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.addItem = (req, res, next) => {
  Cart.findOne({ user_id: req.body.user_id }, (err, cart) => {
    if (!cart) {
      // push new cart
      let products = [];
      products.push({
        product_id: req.body.product_id,
        amount: "1",
      });
      const newCart = new Cart({
        user_id: req.body.user_id,
        products: products,
      });
      newCart.save({}, (err, data) => {
        if (data) res.status(201).json(data);
      });
    } else {
      //update exist cart
      if (cart.products.length > 0) {
        //have cart and not empty
        let cart_product_id_arr = [];
        cart.products.map((item) => {
          // list all product_id in cart
          cart_product_id_arr.push(item.product_id);
        });
        //coming product exist in list?
        if (cart_product_id_arr.includes(req.body.product_id)) {
          //true -> find that product
          let that_product = cart.products.find(
            (item) => item.product_id == req.body.product_id
          );
          let amount = (Number(that_product.amount) + 1).toString(); //raise that product amount
          Cart.findOneAndUpdate(
            {
              $and: [
                { user_id: req.body.user_id },
                { "products.product_id": req.body.product_id },
              ],
            },
            {
              $set: {
                "products.$.amount": amount,
              },
            },
            {
              new: true,
            },
            (err, data) => res.status(201).json(data)
          );
        } else {
          //false -> add that product
          let products = cart.products;
          products.push({
            product_id: req.body.product_id,
            amount: "1",
          });
          Cart.findOneAndUpdate(
            { user_id: req.body.user_id },
            {
              $set: {
                products: products,
              },
            },
            {
              new: true,
            },
            (err, data) => {
              if (!err) res.status(201).json(data);
              // else return next(err);
            }
          );
        }
      } else {
        //have cart but empty
        let products = [];
        products.push({
          product_id: req.body.product_id,
          amount: "1",
        });
        Cart.findOneAndUpdate(
          { user_id: req.body.user_id },
          {
            $set: {
              products: products,
            },
          },
          {
            new: true,
          },
          (err, data) => {
            if (!err) res.status(201).json(data);
            else return next(err);
          }
        );
      }
    }
  });
};

exports.deleteItemInCart = (req, res) => {
  Cart.findOneAndUpdate(
    { user_id: req.body.user_id },
    {
      $pull: {
        products: {
          product_id: req.body.product_id,
        },
      },
    },
    { safe: true, multi: true, new: true },
    (err, data) => {
      if (err) return next(err);
      else res.status(200).json(data);
    }
  );
};

exports.decreaseItemAmount = (req, res) => {
  Cart.findOne({ user_id: req.body.user_id }, (err, cart) => {
    let that_product = cart.products.find(
      (item) => item.product_id == req.body.product_id
    );
    let amount = (Number(that_product.amount) - 1).toString(); //raise that product amount
    Cart.findOneAndUpdate(
      {
        $and: [
          { user_id: req.body.user_id },
          { "products.product_id": req.body.product_id },
        ],
      },
      {
        $set: {
          "products.$.amount": amount,
        },
      },
      {
        new: true,
      },
      (err, data) => res.json(data)
    );
  });
}