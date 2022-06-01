import { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";
import { environment } from "../src/environments/environment";
import miniFunction from "./miniFunction";
import laptops from "./models/laptops";
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
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  // config mail server
  name: "joytu.be",
  host: "mail.joytu.be",
  port: 465,
  secure: true,
  auth: {
    user: environment.mail_username,
    pass: environment.mail_password,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

const ID = "AKIA4QEIK463UVBGQ44G";
const SECRET = "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";
const BUCKET_NAME = "minastik.hp";
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

export class Laptop_Api {
  laptop_api(app) {
    const minifunc = new miniFunction();

    // get all laptops
    app
      .route("/api/laptops")
      .get((req: Request, res: Response, next: NextFunction) => {
        laptops.find((err, laptops) => {
          if (!laptops) {
            return next(err);
          } else {
            let processed = laptops.map((laptop) => {
              let thumbnail = [];
              laptop.thumbnails.map((i) => {
                thumbnail.push(
                  "/thumbnails/laptop/" +
                    laptop.brand +
                    "/" +
                    laptop.series.toLowerCase() +
                    "/" +
                    laptop.laptop_id +
                    "/" +
                    laptop.laptop_id +
                    "-" +
                    i +
                    ".png"
                );
              });
              return {
                laptop_id: laptop.laptop_id,
                brand: laptop.brand,
                name: laptop.name,
                series: laptop.series,
                CPU: laptop.CPU,
                RAM: laptop.RAM,
                storage: laptop.storage,
                display: laptop.display,
                graphic: laptop.graphic,
                wireless: laptop.wireless,
                LAN: laptop.LAN,
                connection: laptop.connection,
                keyboard: laptop.keyboard,
                webcam: laptop.webcam,
                audio: laptop.audio,
                battery: laptop.battery,
                OS: laptop.OS,
                dimension: laptop.dimension,
                weight: laptop.weight,
                color: laptop.color,
                security: laptop.security,
                price: laptop.price,
                sale: laptop.sale,
                status: laptop.status,
                thumbnail: thumbnail,
              };
            });
            res.json(processed);
          }
        });
      });
    //---------------------------------------------------------------------------------------------------------------------

    // get laptop by id
    app
      .route("/api/laptop/:id")
      .get((req: Request, res: Response, next: NextFunction) => {
        laptops.findOne({ laptop_id: req.params.id }, (err, laptop) => {
          if (!laptop) {
            return next(err);
          } else {
            let thumbnail = [];
            laptop.thumbnails.map((i) => {
              thumbnail.push(
                "/thumbnails/laptop/" +
                  laptop.brand +
                  "/" +
                  laptop.series.toLowerCase() +
                  "/" +
                  laptop.laptop_id +
                  "/" +
                  laptop.laptop_id +
                  "-" +
                  i +
                  ".png"
              );
            });
            let processed = {
              laptop_id: laptop.laptop_id,
              brand: laptop.brand,
              name: laptop.name,
              series: laptop.series,
              CPU: laptop.CPU,
              RAM: laptop.RAM,
              storage: laptop.storage,
              display: laptop.display,
              graphic: laptop.graphic,
              wireless: laptop.wireless,
              LAN: laptop.LAN,
              connection: laptop.connection,
              keyboard: laptop.keyboard,
              webcam: laptop.webcam,
              audio: laptop.audio,
              battery: laptop.battery,
              OS: laptop.OS,
              dimension: laptop.dimension,
              weight: laptop.weight,
              color: laptop.color,
              security: laptop.security,
              price: laptop.price,
              sale: laptop.sale,
              status: laptop.status,
              thumbnail: thumbnail,
            };
            res.json(processed);
          }
        });
      });
    //---------------------------------------------------------------------------------------------------------------------------

    //push laptop thumbnail
    app
      .route("/api/push-laptop-thumbnail")
      .post(upload.any(), (req, res: Response, next: NextFunction) => {
        const { headers, files } = req;
        for (let i = 0; i < files.length; i++) {
          const { buffer, originalname: filename } = files[i];
          s3.upload(
            {
              Bucket: BUCKET_NAME,
              Key:
                req.body.prefix +
                "/" +
                req.body.product_type +
                "/" +
                req.body.brand +
                "/" +
                req.body.series +
                "/" +
                req.body.laptop_id +
                "/" +
                req.body.laptop_id +
                "-" +
                (i + 1).toString() +
                ".png",
              Body: buffer,
              ACL: "private",
            },
            (err, data) => {
              if (!err) {
                if (data) {
                  // console.log(`File uploaded successfully. ${data.Location}`);
                  if (i == files.length - 1) res.json(201);
                }
              } else return next(err);
            }
          );
        }
      });
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------

    //push laptop data
    app
      .route("/api/push-laptop-data")
      .post(
        upload.fields([]),
        (req: Request, res: Response, next: NextFunction) => {
          req.body.thumbnails = [].concat(req.body.thumbnails);
          req.body.color = [].concat(req.body.color);
          laptops.create(
            {
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
              thumbnails: req.body.thumbnails,
            },
            (err, data) => {
              if (err) return next(err);
              else res.json(201);
            }
          );
        }
      );
    //-------------------------------------------------------------------------------------------------------------------------

    //delete item by id
    app
      .route("/api/delete-item/:id")
      .get((req: Request, res: Response, next: NextFunction) => {
        if (req.params.id[0] == "l") {
          laptops.findOne({ laptop_id: req.params.id }, (err, laptop) => {
            if (laptop) {
              //delete laptop data in DB
              laptops.deleteOne({ laptop_id: req.params.id }, () => {
                res.json(201);
              });
              //delete laptop in storage
              laptop.thumbnails.map((i) => {
                let keyName =
                  "thumbnails/laptop/" +
                  laptop.brand +
                  "/" +
                  laptop.series.toLowerCase() +
                  "/" +
                  laptop.laptop_id +
                  "/" +
                  laptop.laptop_id +
                  "-" +
                  i +
                  ".png";
                s3.deleteObject(
                  {
                    Bucket: BUCKET_NAME,
                    Key: keyName,
                  },
                  (err, data) => {}
                );
              });
            }
          });
        }
      });
    //------------------------------------------------------------------------------------------------------------------------------------

    //change item status
    app
      .route("/api/change-item-status/:id/:status")
      .get((req: Request, res: Response, next: NextFunction) => {
        if (req.params.id[0] == "l") {
          let _status = req.params.status === "true";
          laptops.updateOne(
            { laptop_id: req.params.id },
            { $set: { status: !_status } },
            (err, data) => {
              if (!err) res.json("201");
              else return next(err);
            }
          );
        }
      });
    //------------------------------------------------------------------------------------------------------------------------------------------------

    // edit laptop data
    app
      .route("/api/edit-laptop-data")
      .post(
        upload.fields([]),
        (req: Request, res: Response, next: NextFunction) => {
          req.body.color = [].concat(req.body.color);
          laptops.updateOne(
            { laptop_id: req.body.edit_product_id },
            {
              $set: {
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
              },
            },
            (err, data) => {
              if (!err) res.json("201");
              else return next(err);
            }
          );
        }
      );
    //------------------------------------------------------------------------------------------------------------------------------------------

    //update laptop thumbnails
    app
      .route("/api/update-laptop-thumbnails")
      .post(upload.any(), (req, res: Response, next: NextFunction) => {
        const { headers, files } = req;
        //update laptop thumbnails in DB
        req.body.thumbnails = [].concat(req.body.thumbnails);
        laptops.updateOne(
          { laptop_id: req.body.laptop_id },
          { $set: { thumbnails: req.body.thumbnails } },
          (err, data) => {}
        );
        for (let i = 0; i < files.length; i++) {
          const { buffer, originalname: filename } = files[i];
          s3.upload(
            {
              Bucket: BUCKET_NAME,
              Key:
                req.body.prefix +
                "/" +
                req.body.product_type +
                "/" +
                req.body.brand +
                "/" +
                req.body.series +
                "/" +
                req.body.laptop_id +
                "/" +
                req.body.laptop_id +
                "-" +
                (i + 1 + Number(req.body.max_index_thumbnail)).toString() +
                ".png",
              Body: buffer,
              ACL: "private",
            },
            (err, data) => {
              if (!err) {
                if (data) {
                  // console.log(`File uploaded successfully. ${data.Location}`);
                  if (i == files.length - 1) res.json(201);
                }
              } else return next(err);
            }
          );
        }
      });
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------

    // delete laptop thumbnail
    app
      .route("/api/delete-laptop-thumbnail")
      .post(upload.fields([]), (req, res: Response, next: NextFunction) => {
        laptops.findOne({ laptop_id: req.body.laptop_id }, (err, laptop) => {
          if (laptop) {
            // update laptop data in DB
            let thumbnails = laptop.thumbnails;
            req.body.thumbnails = [].concat(req.body.thumbnails);
            req.body.thumbnails.map((item) => {
              thumbnails = thumbnails.filter((i) => i != item);
            });
            laptops.updateOne(
              { laptop_id: req.body.laptop_id },
              { $set: { thumbnails: thumbnails } },
              (err, data) => {
                if (data) res.json(201);
              }
            );

            // delete thumbnail in storage
            req.body.thumbnail = [].concat(req.body.thumbnail);
            req.body.thumbnail.map((thumbnail) => {
              let keyName = thumbnail.substring(1);
              s3.deleteObject(
                {
                  Bucket: BUCKET_NAME,
                  Key: keyName,
                },
                (err, data) => {}
              );
            });
          }
        });
      });
    //------------------------------------------------------------------------------------------------------------------------------

    // get many laptop by id
    app
      .route("/api/get-many-laptop-by-id")
      .post(
        upload.fields([]),
        (req: Request, res: Response, next: NextFunction) => {
          req.body.id = [].concat(req.body.id);
          req.body.amount = [].concat(req.body.amount);
          laptops.find(
            {
              laptop_id: { $in: req.body.id },
            },
            { _id: 0, __v: 0 },
            (err, laptops) => {
              if (laptops) {
                laptops = laptops.map((laptop, index) => {
                  let thumbnail = [];
                  laptop.thumbnails.map((i) => {
                    thumbnail.push(
                      "/thumbnails/laptop/" +
                        laptop.brand +
                        "/" +
                        laptop.series.toLowerCase() +
                        "/" +
                        laptop.laptop_id +
                        "/" +
                        laptop.laptop_id +
                        "-" +
                        i +
                        ".png"
                    );
                  });
                  return {
                    amount: req.body.amount[index],
                    CPU: laptop.CPU,
                    RAM: laptop.RAM,
                    connection: laptop.connection,
                    color: laptop.color,
                    thumbnails: laptop.thumbnails,
                    thumbnail: thumbnail,
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
                res.status(201).json(laptops);
              } else return next(err);
            }
          );
        }
      );
    //---------------------------------------------------------------------------------------------------------------------------
  }
}
