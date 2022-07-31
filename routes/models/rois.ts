import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

let roisSchema: Schema = new Schema({
    'product_id': {type: String},
    'roi_group_data': {type: Array},
    'video_id': {type: String},
    'roi_group_id': {type: String},
    'object_id': {type: String}
}, {
    collection: 'rois'
})

const rois =  mongoose.model('rois', roisSchema);

export default rois