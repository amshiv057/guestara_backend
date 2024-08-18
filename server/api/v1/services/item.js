import itemModel from "../../../models/items";

const itemServices = {
    createItem: async (insertObj) => {
        return await itemModel.create(insertObj);
    },
    findItem: async (query) => {
        return await itemModel.findOne(query);
    },
    updateItem: async (query, updatedObj) => {
        return await itemModel.findOneAndUpdate(query, updatedObj, { new: true });
    },
    getItemsUnderSubCategory: async (query) => {
        return await itemModel.find(query).sort({ createdAt: -1 });
    },
    findAllItem: async (validatedBody) => {
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

        return await itemModel.paginate(query, option);
    },
}

module.exports = { itemServices };