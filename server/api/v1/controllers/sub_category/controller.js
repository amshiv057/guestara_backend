import apiError from "../../../../helper/apiError";
import responseMessage from "../../../../../assets/responseMessage";
import response from "../../../../../assets/response";
import { categoryServices } from "../../services/category";
import { subCategoryServices } from "../../services/sub_category";
const { findCategory } = categoryServices;
const { createSubcategory, findSubCategory, subCategoryUnderCategory, updateSubCategory, findAllSubCategory } = subCategoryServices;
import commonFunction from "../../../../helper/utils";
class subCategoryController {
    /**
 * @swagger
 * /subcategory/createSubcategory:
 *   post:
 *     tags:
 *       - SUB_CATEGORY
 *     summary: Create a new sub_category
 *     description: Create a new sub_category by providing the necessary details. Requires an image upload.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: categoryId
 *         in: formData
 *         description: category _id 
 *         required: true
 *       - name: name
 *         in: formData
 *         description: The name of the sub_category
 *         required: true
 *         type: string
 *       - name: description
 *         in: formData
 *         description: Description of the sub_category
 *         required: true
 *         type: string
 *       - name: image
 *         in: formData
 *         description: Image file for the sub_category
 *         required: true
 *         type: file
 *     responses:
 *       '200':
 *         description: sub_category created successfully
 *       '400':
 *         description: Bad request, missing required fields or invalid input
 *       '409':
 *         description: Conflict, sub_category already exists
 *       '500':
 *         description: Internal server error, something went wrong
 */
    async createSubcategory(req, res, next) {
        try {
            const requiredFields = ['categoryId', 'name', 'description'];
            const validateBody = req.body;
            const missingFields = requiredFields.filter(field => !Object.keys(validateBody).includes(field));  // check required field
            if (missingFields.length > 0) {
                throw apiError.badRequest(responseMessage.REQUIRED_FIELD(missingFields));
            }
            const categoryResult = await findCategory({ _id: validateBody.categoryId });
            if (!categoryResult) {
                throw apiError.notFound(responseMessage.CATEGORY_NOT_FOUND)
            }
            const file = req.files;
            const getUrl = await commonFunction.getSecureUrl(file[0]);
            if (!getUrl) {
                throw apiError.internal(responseMessage.SOMETHING_WENT_WRONG);
            }
            validateBody.image = getUrl;
            validateBody.isTaxApplicable = categoryResult.isTaxApplicable;
            validateBody.tax = categoryResult.tax;
            const result = await createSubcategory(validateBody);
            return res.json(new response({}, responseMessage.SUBCATEGORY_CREATED))
        } catch (error) {
            next(error);
        }
    }
    /**
* @swagger
* /subCategory/getSubCategory:
*   get:
*     tags:
*       - SUB_CATEGORY
*     summary: get a sub_category
*     description: get sub_category by providing the necessary details.
*     consumes:
*       - multipart/form-data
*     parameters:
*       - name: _id
*         in: query
*         description: sub_category Id ( _id)
*         required: true
*     responses:
*       '200':
*         description: sub_category get successfully
*       '400':
*         description: Bad request, missing required fields or invalid input
*       '409':
*         description: Conflict, category already exists
*       '500':
*         description: Internal server error, something went wrong
*/
    async getSubCategory(req, res, next) {
        try {
            const requiredFields = ['_id'];
            const validateBody = req.query;
            const missingFields = requiredFields.filter(field => !Object.keys(validateBody).includes(field));  // check required field
            if (missingFields.length > 0) {
                throw apiError.badRequest(responseMessage.REQUIRED_FIELD(missingFields));
            }
            const subCategoryResult = await findSubCategory({ _id: validateBody._id });
            if (!subCategoryResult) {
                throw apiError.notFound(responseMessage.SUB_CATEGORY_NOT_FOUND);
            }
            return res.json(new response(subCategoryResult, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }
    /**
* @swagger
* /subCategory/subCategoryUnderCategory/{_id}:
*   get:
*     tags:
*       - SUB_CATEGORY
*     summary: Get sub-category under category
*     description: Get sub-categories under a category by providing the category ID.
*     parameters:
*       - name: _id
*         in: path
*         description: Category ID
*         required: true
*     responses:
*       '200':
*         description: Sub-categories retrieved successfully
*       '400':
*         description: Bad request, missing required fields or invalid input
*       '404':
*         description: Not found, no sub-categories found for the given category ID
*       '500':
*         description: Internal server error, something went wrong
*/

    async subCategoryUnderCategory(req, res, next) {
        try {
            const requiredFields = ['_id'];
            const validateBody = req.params;
            const missingFields = requiredFields.filter(field => !Object.keys(validateBody).includes(field));  // check required field
            if (missingFields.length > 0) {
                throw apiError.badRequest(responseMessage.REQUIRED_FIELD(missingFields));
            }
            const categoryResult = await subCategoryUnderCategory({ categoryId: validateBody._id });
            if (!categoryResult) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            return res.json(new response(categoryResult, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error)
        }
    }
    /**
  * @swagger
  * /subCategory/editSubcategory:
  *   put:
  *     tags:
  *       - SUB_CATEGORY
  *     summary: edit a sub_category
  *     description: edit a sub_category by providing the necessary details. Requires an image upload.
  *     consumes:
  *       - multipart/form-data
  *     parameters:
  *       - name: _id
  *         in: formData
  *         description: sub_category _id
  *         required: true
  *       - name: name
  *         in: formData
  *         description: The name of the sub_category
  *         required: false
  *       - name: description
  *         in: formData
  *         description: Description of the sub_category
  *         required: false
  *       - name: isTaxApplicable
  *         in: formData
  *         description: Indicates if tax is applicable (true or false)
  *         required: false
  *         type: boolean
  *       - name: tax
  *         in: formData
  *         description: The tax rate applicable to the category
  *         required: false
  *       - name: image
  *         in: formData
  *         description: Image file for the category
  *         required: false
  *         type: file
  *     responses:
  *       '200':
  *         description: sub Category updated successfully
  *       '400':
  *         description: Bad request, missing required fields or invalid input
  *       '409':
  *         description: Conflict, category already exists
  *       '500':
  *         description: Internal server error, something went wrong
  */
    async editSubCategory(req, res, next) {
        try {
            const requiredFields = ['_id'];
            const validateBody = req.body;
            const missingFields = requiredFields.filter(field => !Object.keys(validateBody).includes(field));  // check required field
            if (missingFields.length > 0) {
                throw apiError.badRequest(responseMessage.REQUIRED_FIELD(missingFields));
            }
            const categoryResult = await findSubCategory({ _id: validateBody._id }); // check categpry already exist
            if (!categoryResult) {
                throw apiError.alreadyExist(responseMessage.CATEGORY_ALREADY_EXIST)
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
            const result = await updateSubCategory({ _id: categoryResult._id }, validateBody);
            return res.json(new response({}, responseMessage.CATEGORY_UPDATED));
        } catch (error) {
            next(error);
        }
    }
     /**
     * @swagger
     * /subCategory/getAllSubCategory:
     *   get:
     *     tags:
     *       - SUB_CATEGORY
     *     summary: Retrieve a list of sub_categories with optional search and pagination
     *     description: Retrieves a list of sub_categories with optional search parameters and pagination controls.
     *     parameters:
     *       - name: search
     *         in: query
     *         description: Optional search term to filter sub_categories by name.
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
     *         description: Successfully retrieved the list of sub_categories
    */
    async getAllSubCategory(req, res, next) {
        try {
            const validateBody = req.query;
            const result = await findAllSubCategory(validateBody);
            if (result.docs.length == 0) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }
}
export default new subCategoryController();