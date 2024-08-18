import categoryModel from "../../../models/category";

const categoryServices = {
    createCategory: async (insertObj) => {
        return await categoryModel.create(insertObj);
    },
    findCategory: async (query) => {
        // console.log(">>>>>>>>>>>>>>>>",query);
        return await categoryModel.findOne(query);
    },
    updateCategory: async (query, updatedObj) => {
        return await categoryModel.findOneAndUpdate(query, updatedObj, { new: true });
    },
    findAllCategory: async (validatedBody) => {
        let query = {};
        const { search, page, limit } = validatedBody;
        if (search) {
            query.$or = [
                { 'name': { $regex: search, $options: 'i' } }
            ]
        }
        const option = {
            page: Number(page) || 1,
            limit: Number(limit) || 15,
            sort: { createdAt: -1 }
        }

        return await categoryModel.paginate(query, option);
    },
}

module.exports = { categoryServices };