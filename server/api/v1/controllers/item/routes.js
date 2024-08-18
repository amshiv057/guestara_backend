import Express from 'express';
import controller from './controller';
import upload from "../../../../helper/uploadHandler";

export default Express.Router()
    .use(upload.uploadFile)
    .post('/createItem',controller.createItem)
    .get('/getItem/:_id',controller.getItem)
    .get('/getItemsUnderSubCategory/:_id',controller.getItemsUnderSubCategory)
    .put('/editItem',controller.editItem)
    .get('/getAllItem',controller.getAllItem)