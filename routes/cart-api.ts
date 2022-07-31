import { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";
import { environment } from "../src/environments/environment";
import miniFunction from "./miniFunction";
import carts from "./models/carts";
mongoose
  .connect(environment.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {})
  .catch((err) => console.error(err));

const request = require("request");
const multer = require("multer");
const fs = require("fs");
const AWS = require("aws-sdk");
const upload = multer();

const ID = "AKIA4QEIK463UVBGQ44G";
const SECRET = "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";
const BUCKET_NAME = "minastik.hp";
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

export class Cart_Api {
  cart_api(app) {
    const minifunc = new miniFunction();

    // get cart by id
    app
      .route("/api/cart/:id")
      .get((req: Request, res: Response, next: NextFunction) => {
        carts.findOne({ user_id: req.params.id }, (err, cart) => {
          if (!cart) {
            return next(err);
          } else {
            res.json(cart);
          }
        });
      });
    //------------------------------------------------------------------------------------------------

    //update cart by id
    app
      .route("/api/update-cart-by-id")
      .post(
        upload.fields([]),
        (req: Request, res: Response, next: NextFunction) => {
          carts.findOne({ user_id: req.body.user_id }, (err, cart) => {
            if (!cart) {
              // push new cart
              let products = [];
              products.push({
                product_id: req.body.product_id,
                amount: "1",
              });
              carts.save(
                {
                  user_id: req.body.user_id,
                  products: products,
                },
                (err, data) => {
                  if (data) res.json(data);
                }
              );
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
                  carts.findOneAndUpdate(
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
                } else {
                  //false -> add that product
                  let products = cart.products;
                  products.push({
                    product_id: req.body.product_id,
                    amount: "1",
                  });
                  carts.findOneAndUpdate(
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
                      if (!err) res.json(data);
                      else return next(err);
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
                carts.findOneAndUpdate(
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
                    if (!err) res.json(data);
                    else return next(err);
                  }
                );
              }
            }
          });
        }
      );
    //------------------------------------------------------------------------------------------------

    //decrease cart by id
    app
      .route("/api/decrease-cart-by-id")
      .post(
        upload.fields([]),
        (req: Request, res: Response, next: NextFunction) => {
          carts.findOne({ user_id: req.body.user_id }, (err, cart) => {
            let that_product = cart.products.find(
              (item) => item.product_id == req.body.product_id
            );
            let amount = (Number(that_product.amount) - 1).toString(); //raise that product amount
            carts.findOneAndUpdate(
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
      );
    //--------------------------------------------------------------------------------------------------------------------------

    //remove cart by id
    app
      .route("/api/remove-cart-by-id")
      .post(
        upload.fields([]),
        (req: Request, res: Response, next: NextFunction) => {
          carts.findOneAndUpdate(
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
              else res.json(data);
            }
          );
        }
      );
  }
}
