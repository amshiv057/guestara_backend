import apiError from "../../../../helper/apiError";
import responseMessage from "../../../../../assets/responseMessage";
import response from "../../../../../assets/response";
import { categoryServices } from "../../services/category";
const { createCategory, findCategory, updateCategory, findAllCategory, subCategoryUnderCategory } = categoryServices;
import commonFunction from "../../../../helper/utils";
class categoryController {
    /**
     * @swagger
     * /category/createCategory:
     *   post:
     *     tags:
     *       - CATEGORY
     *     summary: Create a new category
     *     description: Create a new category by providing the necessary details. Requires an image upload.
     *     consumes:
     *       - multipart/form-data
     *     parameters:
     *       - name: name
     *         in: formData
     *         description: The name of the category
     *         required: true
     *         type: string
     *       - name: description
     *         in: formData
     *         description: Description of the category
     *         required: true
     *         type: string
     *       - name: isTaxApplicable
     *         in: formData
     *         description: Indicates if tax is applicable (true or false)
     *         required: true
     *         type: boolean
     *       - name: tax
     *         in: formData
     *         description: The tax rate applicable to the category
     *         required: false
     *       - name: taxType
     *         in: formData
     *         description: The type of tax
     *         required: false
     *         type: string
     *       - name: image
     *         in: formData
     *         description: Image file for the category
     *         required: true
     *         type: file
     *     responses:
     *       '200':
     *         description: Category created successfully
     *       '400':
     *         description: Bad request, missing required fields or invalid input
     *       '409':
     *         description: Conflict, category already exists
     *       '500':
     *         description: Internal server error, something went wrong
     */

    async createCategory(req, res, next) {
        try {
            const requiredFields = ['name', 'description', 'isTaxApplicable'];
            const validateBody = req.body;
            const missingFields = requiredFields.filter(field => !Object.keys(validateBody).includes(field));  // check required field
            if (missingFields.length > 0) {
                throw apiError.badRequest(responseMessage.REQUIRED_FIELD(missingFields));
            }
            const categoryResult = await findCategory({ name: validateBody.name }); // check categpry already exist
            if (categoryResult) {
                throw apiError.alreadyExist(responseMessage.CATEGORY_ALREADY_EXIST)
            }
            const file = req.files;
            const getUrl = await commonFunction.getSecureUrl(file[0]);
            if (!getUrl) {
                throw apiError.internal(responseMessage.SOMETHING_WENT_WRONG)
            }
            validateBody.image = getUrl;
            const result = await createCategory(validateBody);
            return res.json(new response({}, responseMessage.CATEGORY_CREATED))
        } catch (error) {
            next(error);
        }
    }
    /**
 * @swagger
 * /category/getCategory:
 *   get:
 *     tags:
 *       - CATEGORY
 *     summary: get a category
 *     description: get  new category by providing the necessary details.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: _id
 *         in: query
 *         description: category Id ( _id)
 *         required: true
 *     responses:
 *       '200':
 *         description: Category get successfully
 *       '400':
 *         description: Bad request, missing required fields or invalid input
 *       '409':
 *         description: Conflict, category already exists
 *       '500':
 *         description: Internal server error, something went wrong
 */

    async getCategory(req, res, next) {
        try {
            const requiredFields = ['_id'];
            const validateBody = req.query;
            const missingFields = requiredFields.filter(field => !Object.keys(validateBody).includes(field));  // check required field
            if (missingFields.length > 0) {
                throw apiError.badRequest(responseMessage.REQUIRED_FIELD(missingFields));
            }
            const categoryResult = await findCategory({ _id: validateBody._id });
            if (!categoryResult) {
                throw apiError.notFound(responseMessage.CATEGORY_NOT_FOUND);
            }
            return res.json(new response(categoryResult, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }
    /**
  * @swagger
  * /category/editCategory:
  *   put:
  *     tags:
  *       - CATEGORY
  *     summary: edit a category
  *     description: Create a new category by providing the necessary details. Requires an image upload.
  *     consumes:
  *       - multipart/form-data
  *     parameters:
  *       - name: _id
  *         in: formData
  *         description: category _id
  *         required: true
  *       - name: name
  *         in: formData
  *         description: The name of the category
  *         required: false
  *         type: string
  *       - name: description
  *         in: formData
  *         description: Description of the category
  *         required: false
  *         type: string
  *       - name: isTaxApplicable
  *         in: formData
  *         description: Indicates if tax is applicable (true or false)
  *         required: false
  *         type: boolean
  *       - name: tax
  *         in: formData
  *         description: The tax rate applicable to the category
  *         required: false
  *       - name: taxType
  *         in: formData
  *         description: The type of tax
  *         required: false
  *         type: string
  *       - name: image
  *         in: formData
  *         description: Image file for the category
  *         required: false
  *         type: file
  *     responses:
  *       '200':
  *         description: Category updated successfully
  *       '400':
  *         description: Bad request, missing required fields or invalid input
  *       '409':
  *         description: Conflict, category already exists
  *       '500':
  *         description: Internal server error, something went wrong
  */
    async editCategory(req, res, next) {
        try {
            const requiredFields = ['_id'];
            // console.log(">>>>>>>>>>>>>>", req.body);
            const validateBody = req.body;
            const missingFields = requiredFields.filter(field => !Object.keys(validateBody).includes(field));  // check required field
            if (missingFields.length > 0) {
                throw apiError.badRequest(responseMessage.REQUIRED_FIELD(missingFields));
            }
            // console.log(validateBody.name, validateBody._id);
            const categoryResult = await findCategory({ _id: validateBody._id }); // check categpry already exist
            // console.log(">>>>>>>>>>>>>>>>>", categoryResult)
            if (!categoryResult) {
                throw apiError.alreadyExist(responseMessage.CATEGORY_ALREADY_EXIST)
            }
            if (validateBody.name) {
                const result = await findCategory({ name: validateBody.name, _id: { $ne: validateBody._id } });
                if (result) {
                    throw apiError.alreadyExist(responseMessage.CATEGORY_ALREADY_EXIST);
                }
            }
            const file = req.files;
            // console.log(file)
            if (file.length !== 0) {
                const getUrl = await commonFunction.getSecureUrl(file[0]);
                if (!getUrl) {
                    throw apiError.internal(responseMessage.SOMETHING_WENT_WRONG);
                }
                validateBody.image = getUrl;
            }
            // console.log(validateBody.isTaxApplicable);
            if (validateBody.isTaxApplicable == false) {
                // console.log("check")
                validateBody.tax = 0;
                validateBody.taxType = '';
            }
            const result = await updateCategory({ _id: categoryResult._id }, validateBody);
            return res.json(new response({}, responseMessage.CATEGORY_UPDATED));
        } catch (error) {
            next(error);
        }
    }
    /**
     * @swagger
     * /category/getAllCategory:
     *   get:
     *     tags:
     *       - CATEGORY
     *     summary: Retrieve a list of categories with optional search and pagination
     *     description: Retrieves a list of categories with optional search parameters and pagination controls.
     *     parameters:
     *       - name: search
     *         in: query
     *         description: Optional search term to filter categories by name.
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
     *         description: Successfully retrieved the list of categories
    */
    async findAllCategory(req, res, next) {
        try {
            const validateBody = req.query;
            const result = await findAllCategory(validateBody);
            if (result.docs.length == 0) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            next(error);
        }
    }
 
}

export default new categoryController();
























// const requiredFields = ['email', 'password'];
// const validateBody = req.body;
// const missingFields = requiredFields.filter(field => !Object.keys(validateBody).includes(field));  // check required field
// if (missingFields.length > 0) {
//     throw apiError.badRequest(responseMessage.REQUIRED_FIELD(missingFields));
// }