import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
const option = {
    timestamps: true,
    collection: 'category'
}
const categorySchema = new mongoose.Schema({
    name: {
        type: String
    },
    image: {
        type: String
    },
    description: {
        type: String
    },
    isTaxApplicable: {
        type: Boolean,
        default: false
    },
    tax: {
        type: Number
    },
    taxType: {
        type: String
    }
}, option)
categorySchema.plugin(paginate);
module.exports = mongoose.model('category', categorySchema);