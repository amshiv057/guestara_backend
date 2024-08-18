import Express from 'express';
import controller from './controller';
import upload from "../../../../helper/uploadHandler";
export default Express.Router()
    .use(upload.uploadFile)
    .post('/createCategory', controller.createCategory)
    .put('/editCategory', controller.editCategory)
    .get('/getCategory', controller.getCategory)
    .get('/getAllCategory', controller.findAllCategory)
    