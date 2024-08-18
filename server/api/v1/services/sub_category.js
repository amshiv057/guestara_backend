import subCategoryModel from "../../../models/subCategory";
const subCategoryServices = {
    createSubcategory: async (insertObj) => {
        return await subCategoryModel.create(insertObj);
    },
    findSubCategory: async (query) => {
        return await subCategoryModel.findOne(query);
    },
    updateSubCategory: async (query, updatedObj) => {
        return await subCategoryModel.findOneAndUpdate(query, updatedObj, { new: true });
    },
    subCategoryUnderCategory: async (query) => {
        return await subCategoryModel.find(query).sort({ createdAt: -1 })
    },
    findAllSubCategory: async (validatedBody) => {
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

        return await subCategoryModel.paginate(query, option);
    },
}

module.exports = { subCategoryServices };