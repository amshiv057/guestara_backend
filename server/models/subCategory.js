import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
const option = {
    timestamps: true,
    collection: 'sub_category'
}
const subCategorySchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'category'
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
}, option);
subCategorySchema.plugin(paginate);
module.exports = mongoose.model('sub_category', subCategorySchema);