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

    async createItem(req, res, next) {
        try {
            const requiredFields = ['sub_categoryId', 'name', 'description', 'isTaxApplicable', 'baseAmount', 'discount'];
            const validateBody = req.body;
            const missingFields = requiredFields.filter(field => !Object.keys(validateBody).includes(field));  // check required field
            if (missingFields.length > 0) {
                throw apiError.badRequest(responseMessage.REQUIRED_FIELD(missingFields));
            }
            const subCategoryResult = await findSubCategory({ _id: validateBody.sub_categoryId });
            if (!subCategoryResult) {
                throw apiError.notFound(responseMessage.SUB_CATEGORY_NOT_FOUND)
            }
            const file = req.files;
            const getUrl = await commonFunction.getSecureUrl(file[0]);
            if (!getUrl) {
                throw apiError.internal(responseMessage.SOMETHING_WENT_WRONG);
            }
            validateBody.image = getUrl;
            const totalAmount = +validateBody.baseAmount - +validateBody.discount;
            validateBody.totalAmount = totalAmount;
            const result = await createItem(validateBody);
            return res.json(new response({}, responseMessage.ITEM_CREATED))
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
*     summary: get a item
*     description: get item by providing the necessary details.
*     consumes:
*       - multipart/form-data
*     parameters:
*       - name: _id
*         in: path
*         description: item Id ( _id)
*         required: true
*     responses:
*       '200':
*         description: item get successfully
*       '400':
*         description: Bad request, missing required fields or invalid input
*       '409':
*         description: Conflict, category already exists
*       '500':
*         description: Internal server error, something went wrong
*/
    async getItem(req, res, next) {
        try {
            const requiredFields = ['_id'];
            const validateBody = req.params;
            const missingFields = requiredFields.filter(field => !Object.keys(validateBody).includes(field));  // check required field
            if (missingFields.length > 0) {
                throw apiError.badRequest(responseMessage.REQUIRED_FIELD(missingFields));
            }
            const itemResult = await findItem({ _id: validateBody._id });
            if (!itemResult) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
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
*     summary: Get items under sub_category
*     description: Get items under a sub_category by providing the sub_category ID.
*     parameters:
*       - name: _id
*         in: path
*         description: subCategory ID
*         required: true
*     responses:
*       '200':
*         description: items retrieved successfully
*       '400':
*         description: Bad request, missing required fields or invalid input
*       '404':
*         description: Not found, no items found for the given sub_category ID
*       '500':
*         description: Internal server error, something went wrong
*/
    async getItemsUnderSubCategory(req, res, next) {
        try {
            const requiredFields = ['_id'];
            const validateBody = req.params;
            const missingFields = requiredFields.filter(field => !Object.keys(validateBody).includes(field));  // check required field
            if (missingFields.length > 0) {
                throw apiError.badRequest(responseMessage.REQUIRED_FIELD(missingFields));
            }
            const itemsResult = await getItemsUnderSubCategory({ sub_categoryId: validateBody._id });
            if (itemsResult.length == 0) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
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
    *         description: Item _id
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
    *         description: Discount
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
    async editItem(req, res, next) {
        try {
            const requiredFields = ['_id'];
            const validateBody = req.body;
            const missingFields = requiredFields.filter(field => !Object.keys(validateBody).includes(field));  // check required field
            if (missingFields.length > 0) {
                throw apiError.badRequest(responseMessage.REQUIRED_FIELD(missingFields));
            }
            const itemResult = await findItem({ _id: validateBody._id });
            if (!itemResult) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            const file = req.files;
            if (file.length !== 0) {
                const getUrl = await commonFunction.getSecureUrl(file[0]);
                if (!getUrl) {
                    throw apiError.internal(responseMessage.SOMETHING_WENT_WRONG);
                }
                validateBody.image = getUrl;
            }
            if (validateBody.isTaxApplicable == false) {
                validateBody.tax = 0;
            }
            const totalAmount = +validateBody.baseAmount - +validateBody.discount;
            validateBody.totalAmount = totalAmount;
            const result = await updateItem({ _id: itemResult._id }, validateBody);
            return res.json(new response({}, responseMessage.ITEM_UPDATED))
        } catch (error) {
            next(error)
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
    async getAllItem(req, res, next) {
        try {
            const validateBody = req.query;
            const result = await findAllItem(validateBody);
            if (result.docs.length == 0) {
                return res.json(responseMessage.DATA_NOT_FOUND);
            }
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }
}
export default new itemController();