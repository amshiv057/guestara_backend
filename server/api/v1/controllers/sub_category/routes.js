import Express from 'express';
import controller from './controller';
import upload from "../../../../helper/uploadHandler";
export default Express.Router()
    .use(upload.uploadFile)
    .post('/createSubCategory', controller.createSubcategory)
    .get('/getSubCategory', controller.getSubCategory)
    .get('/subCategoryUnderCategory/:_id', controller.subCategoryUnderCategory)
    .put('/editSubcategory', controller.editSubCategory)
    .get('/getAllSubCategory',controller.getAllSubCategory)
