import express from 'express';
import { isadmin, RequiredSignIn } from '../middlewares/authMiddleware.js';
import { createProductController,deleteproductcontroller,getproductcontroller, getsingleproductcontroller, productCountController, productFilterControllers, productlistcontroller, productphotoController, relatedproductController, searchproductControllers, updateProductController } from '../controllers/productController.js';
import formidable from "express-formidable"
const router = express.Router();
//Create Product
router.post("/create-product", RequiredSignIn, isadmin,formidable(),createProductController);
//update product
router.put("/update-product/:pid", RequiredSignIn, isadmin,formidable(),updateProductController);
//get products

router.get("/get-products",getproductcontroller);
//get single product
router.get("/get-products/:slug",getsingleproductcontroller);
//get photo
router.get("/product-photo/:pid",productphotoController);
//delete product
router.delete("/delete-product/:pid",deleteproductcontroller);
//Filter product
router.post("/product-filters",productFilterControllers)
//product Count
router.get("/product-count",productCountController);
//product per page
router.get("/product-list/:page",productlistcontroller);
//search product
router.get("/search/:keyword",searchproductControllers );
//Similar Products
router.get("/similar-products/:pid/:cid",relatedproductController);

export default router;