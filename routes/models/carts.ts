import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

let cartsSchema: Schema = new Schema({
    user_id: {type: String},
    products: [{
        product_id: {type: String},
        amount: {type: String}
    }]
}, {
    collection: 'carts'
})

const carts =  mongoose.model('carts', cartsSchema);

export default carts