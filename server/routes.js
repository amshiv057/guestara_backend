import categoryContent from "./api/v1/controllers/category/routes";
import subcategoryContent from "./api/v1/controllers/sub_category/routes";
import itemContent from "./api/v1/controllers/item/routes";
export default function Routes(app) {
    app.use('/api/v1/category', categoryContent);
    app.use('/api/v1/subcategory', subcategoryContent);
    app.use("/api/v1/item", itemContent);
    return app;
}