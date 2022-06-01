import * as mongoose from "mongoose";
import { Schema } from "mongoose";

let ordersSchema: Schema = new Schema(
  {
    user_id: { type: String },
    products: [
      {
        product_id: { type: String },
        amount: { type: String },
      },
    ],
  },
  {
    collection: "orders",
  }
);

const orders = mongoose.model("orders", ordersSchema);

export default orders;
