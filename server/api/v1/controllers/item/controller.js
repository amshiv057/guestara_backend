import apiError from "../../../../helper/apiError";
import responseMessage from "../../../../../assets/responseMessage";
import response from "../../../../../assets/response";
import { subCategoryServices } from "../../services/sub_category";
const { findSubCategory } = subCategoryServices;
import { itemServices } from "../../services/item";
const { createItem, findItem, updateItem, getItemsUnderSubCategory, findAllItem } = itemServices;
import commonFunction from "../../../../helper/utils";

class itemController {

    /**
     * @swagger
     * /item/createItem:
     *   post:
     *     tags:
     *       - ITEM
     *     summary: Create a new item
     *     description: Creates a new item by providing the necessary details, including an image file.
     *     consumes:
     *       - multipart/form-data
     *     parameters:
     *       - name: sub_categoryId
     *         in: formData
     *         description: The ID of the sub-category to which the item belongs
     *         required: true
     *         type: string
     *       - name: name
     *         in: formData
     *         description: The name of the item
     *         required: true
     *         type: string
     *       - name: description
     *         in: formData
     *         description: A description of the item
     *         required: true
     *         type: string
     *       - name: isTaxApplicable
     *         in: formData
     *         description: Indicates if tax is applicable (true or false)
     *         required: true
     *         type: boolean
     *       - name: tax
     *         in: formData
     *         description: The tax amount applicable to the item
     *         required: false
     *       - name: baseAmount
     *         in: formData
     *         description: The base amount of the item
     *         required: true
     *       - name: discount
     *         in: formData
     *         description: Discount amount applicable to the item
     *         required: true
     *       - name: image
     *         in: formData
     *         description: Image file for the item
     *         required: true
     *         type: file
     *     responses:
     *       '200':
     *         description: Item created successfully
     *       '400':
     *         description: Bad request, missing required fields or invalid input
     *       '404':
     *         description: Sub-category not found
     *       '500':
     *         description: Internal server error, something went wrong
     */

    // Method to create a new item
    async createItem(req, res, next) {
        try {
            // List of required fields for item creation
            const requiredFields = ['sub_categoryId', 'name', 'description', 'isTaxApplicable', 'baseAmount', 'discount'];
            const validateBody = req.body;

            // Check if any required fields are missing
            const missingFields = requiredFields.filter(field => !Object.keys(validateBody).includes(field));
            if (missingFields.length > 0) {
                throw apiError.badRequest(responseMessage.REQUIRED_FIELD(missingFields));
            }

            // Check if the sub-category exists
            const subCategoryResult = await findSubCategory({ _id: validateBody.sub_categoryId });
            if (!subCategoryResult) {
                throw apiError.notFound(responseMessage.SUB_CATEGORY_NOT_FOUND);
            }

            // Upload the item image and get the URL
            const file = req.files;
            const getUrl = await commonFunction.getSecureUrl(file[0]);
            if (!getUrl) {
                throw apiError.internal(responseMessage.SOMETHING_WENT_WRONG);
            }

            // Calculate the total amount after discount
            validateBody.image = getUrl;
            const totalAmount = +validateBody.baseAmount - +validateBody.discount;
            validateBody.totalAmount = totalAmount;

            // Create the item in the database
            const result = await createItem(validateBody);
            return res.json(new response({}, responseMessage.ITEM_CREATED));
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /item/getItem/{_id}:
     *   get:
     *     tags:
     *       - ITEM
     *     summary: Get an item
     *     description: Get item details by providing the item ID.
     *     parameters:
     *       - name: _id
     *         in: path
     *         description: Item ID (_id)
     *         required: true
     *     responses:
     *       '200':
     *         description: Item retrieved successfully
     *       '400':
     *         description: Bad request, missing required fields or invalid input
     *       '404':
     *         description: Item not found
     *       '500':
     *         description: Internal server error, something went wrong
     */

    // Method to retrieve an item by its ID
    async getItem(req, res, next) {
        try {
            // Ensure the ID parameter is provided
            const requiredFields = ['_id'];
            const validateBody = req.params;

            // Check if any required fields are missing
            const missingFields = requiredFields.filter(field => !Object.keys(validateBody).includes(field));
            if (missingFields.length > 0) {
                throw apiError.badRequest(responseMessage.REQUIRED_FIELD(missingFields));
            }

            // Find the item in the database
            const itemResult = await findItem({ _id: validateBody._id });
            if (!itemResult) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }

            // Return the found item
            return res.json(new response(itemResult, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /item/getItemsUnderSubCategory/{_id}:
     *   get:
     *     tags:
     *       - ITEM
     *     summary: Get items under sub-category
     *     description: Retrieve all items under a specific sub-category by providing the sub-category ID.
     *     parameters:
     *       - name: _id
     *         in: path
     *         description: Sub-category ID
     *         required: true
     *     responses:
     *       '200':
     *         description: Items retrieved successfully
     *       '400':
     *         description: Bad request, missing required fields or invalid input
     *       '404':
     *         description: No items found for the given sub-category ID
     *       '500':
     *         description: Internal server error, something went wrong
     */

    // Method to retrieve all items under a specific sub-category
    async getItemsUnderSubCategory(req, res, next) {
        try {
            // Ensure the sub-category ID parameter is provided
            const requiredFields = ['_id'];
            const validateBody = req.params;

            // Check if any required fields are missing
            const missingFields = requiredFields.filter(field => !Object.keys(validateBody).includes(field));
            if (missingFields.length > 0) {
                throw apiError.badRequest(responseMessage.REQUIRED_FIELD(missingFields));
            }

            // Retrieve the items under the sub-category
            const itemsResult = await getItemsUnderSubCategory({ sub_categoryId: validateBody._id });
            if (itemsResult.length == 0) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }

            // Return the found items
            return res.json(new response(itemsResult, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /item/editItem:
     *   put:
     *     tags:
     *       - ITEM
     *     summary: Edit an item
     *     description: Edit an item by providing the necessary details. Requires an image upload.
     *     consumes:
     *       - multipart/form-data
     *     parameters:
     *       - name: _id
     *         in: formData
     *         description: Item ID (_id)
     *         required: true
     *       - name: name
     *         in: formData
     *         description: The name of the item
     *         required: false
     *         type: string
     *       - name: description
     *         in: formData
     *         description: Description of the item
     *         required: false
     *         type: string
     *       - name: isTaxApplicable
     *         in: formData
     *         description: Indicates if tax is applicable (true or false)
     *         required: false
     *         type: boolean
     *       - name: tax
     *         in: formData
     *         description: The tax rate applicable to the item
     *         required: false
     *       - name: baseAmount
     *         in: formData
     *         description: The base amount
     *         required: false
     *         type: string
     *       - name: discount
     *         in: formData
     *         description: Discount amount applicable to the item
     *         required: false
     *       - name: image
     *         in: formData
     *         description: Image file for the item
     *         required: false
     *         type: file
     *     responses:
     *       '200':
     *         description: Item updated successfully
     *       '400':
     *         description: Bad request, missing required fields or invalid input
     *       '409':
     *         description: Conflict, item already exists
     *       '500':
     *         description: Internal server error, something went wrong
     */

    // Method to edit an existing item
    async editItem(req, res, next) {
        try {
            // Ensure the item ID is provided in the request body
            const requiredFields = ['_id'];
            const validateBody = req.body;

            // Check if any required fields are missing
            const missingFields = requiredFields.filter(field => !Object.keys(validateBody).includes(field));
            if (missingFields.length > 0) {
                throw apiError.badRequest(responseMessage.REQUIRED_FIELD(missingFields));
            }

            // Find the existing item by its ID
            const itemResult = await findItem({ _id: validateBody._id });
            if (!itemResult) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }

            // If a new image is uploaded, update the image URL
            const file = req.files;
            if (file.length !== 0) {
                const getUrl = await commonFunction.getSecureUrl(file[0]);
                if (!getUrl) {
                    throw apiError.internal(responseMessage.SOMETHING_WENT_WRONG);
                }
                validateBody.image = getUrl;
            }

            // If tax is not applicable, set the tax amount to 0
            if (validateBody.isTaxApplicable == false) {
                validateBody.tax = 0;
            }

            // Calculate the total amount after discount
            const totalAmount = +validateBody.baseAmount - +validateBody.discount;
            validateBody.totalAmount = totalAmount;

            // Update the item in the database
            const result = await updateItem({ _id: itemResult._id }, validateBody);
            return res.json(new response({}, responseMessage.ITEM_UPDATED));
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /item/getAllItem:
     *   get:
     *     tags:
     *       - ITEM
     *     summary: Retrieve a list of items with optional search and pagination
     *     description: Retrieves a list of items with optional search parameters and pagination controls.
     *     parameters:
     *       - name: search
     *         in: query
     *         description: Optional search term to filter items by name.
     *         required: false
     *       - name: page
     *         in: query
     *         description: The page number for pagination.
     *         required: false
     *       - name: limit
     *         in: query
     *         description: The number of items per page for pagination.
     *         required: false
     *     responses:
     *       '200':
     *         description: Successfully retrieved the list of items
     */

    // Method to retrieve a list of all items with optional search and pagination
    async getAllItem(req, res, next) {
        try {
            const validateBody = req.query;

            // Retrieve all items based on search and pagination criteria
            const result = await findAllItem(validateBody);
            if (result.docs.length == 0) {
                return res.json(responseMessage.DATA_NOT_FOUND);
            }

            // Return the found items
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }
}

export default new itemController();
