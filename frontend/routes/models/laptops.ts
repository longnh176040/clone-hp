import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

let laptopsSchema: Schema = new Schema({
    laptop_id: {type: String},
    brand: {type: String},
    name: {type: String},
    series: {type: String},
    CPU: {
        name: {type: String},
        speed: {type: String},
        cache: {type: String}
    },
    RAM: {
        capacity: {type: String},
        socket_number: {type: String}
    },
    storage: {type: String},
    display: {type: String},
    graphic: {type: String},
    wireless: {type: String},
    LAN: {type: String},
    connection: {
        USB: {type: String},
        HDMI_VGA: {type: String}
    },
    keyboard: {type: String},
    webcam: {type: String},
    audio: {type: String},
    battery: {type: String},
    OS: {type: String},
    dimension: {type: String},
    weight: {type: String},
    color: {type: Array},
    security: {type: String},
    price: {type: Number},
    sale: {type: Number},
    status: {type: Boolean},
    thumbnails: {type: Array},
    thumbnail: {type: Array}
}, {
    collection: 'laptops'
})

const laptops =  mongoose.model('laptops', laptopsSchema);

export default laptops