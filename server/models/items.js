import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
const option = {
    timestamps: true,
    collection: 'item'
}
const itemSchema = new mongoose.Schema({
    sub_categoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'sub_category'
    },
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
    baseAmount: {
        type: Number
    },
    discount: {
        type: Number
    },
    totalAmount: {
        type: Number
    }
}, option)
itemSchema.plugin(paginate);
module.exports = mongoose.model('item', itemSchema);