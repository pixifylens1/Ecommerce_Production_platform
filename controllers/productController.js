import fs from "fs";
import productModel from "../models/productModel.js";
import slugify from "slugify";
import { get } from "http";
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields; //fields is a property of formidable which is used to get the form data
    const { photo } = req.files; //files is a property of formidable which is used to get the file data

    //validation
    switch (true) {
      case !name:
        return res.status(400).send({
          success: false,
          message: "Name is Required",
        });
      // case !slug:
      //   return res.status(400).send({
      //     success: false,
      //     message: "Slug is Required",
      //   });
      case !description:
        return res.status(400).send({
          success: false,
          message: "Description is Required",
        });
      case !price:
        return res.status(400).send({
          success: false,
          message: "Price is Required",
        });
      case !category:
        return res.status(400).send({
          success: false,
          message: "Category is Required",
        });
      case !quantity:
        return res.status(400).send({
          success: false,
          message: "Quantity is Required",
        });
      case photo && photo.size > 1000000:
        return res.status(400).send({
          success: false,
          message: "Image size should be less than 1mb",
        });
    }
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path); //path of the file
      products.photo.contentType = photo.type; //image/png
    }
    await products.save();
    res.status(201).send({
      success: true,
      products,
      message: "Product Created Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Creating Product",
    });
  }
};

export const getproductcontroller = async (req, res) => {
  try {
    /*populate is used to get the category name from category model(In the context of Mongoose (a MongoDB ODM), "populate" is used to automatically replace reference fields within a document with the full documents from another collectio)*/
    //select is used to exclude the photo field from the response
    //limit is used to get the limited number of products
    //sort is used to sort the products based on the createdAt field
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      total: products.length,
      products,
      message: "Products Fetched Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Getting Products",
    });
  }
};

//get single product
export const getsingleproductcontroller = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      product,
      message: "single Product Fetched Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Getting Product",
    });
  }
};
//get photo
export const productphotoController = async (req, res) => {
try {
    const product = await productModel.findById(req.params.pid).select("photo");
     if(product.photo.data){
        res.set('Content-Type',product.photo.contentType) //image/png 
    
        return res.status(200).send(product.photo.data) //image data
    }

    
} catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        error,
        message: "Error In Getting Product",
    });
}

}

//delete product
export const deleteproductcontroller = async (req, res) => {
  try {
    const product = await productModel.findOneAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      product,
      message: "Product Deleted Successfully",
    });

}

catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        error,
        message: "Error In Deleting Product",
    });
}
}

//update product
export const updateProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } =
          req.fields; //fields is a property of formidable which is used to get the form data
        const { photo } = req.files; //files is a property of formidable which is used to get the file data
    
        //validation
        switch (true) {
          case !name:
            return res.status(400).send({
              success: false,
              message: "Name is Required",
            });
          case !slug:
            return res.status(400).send({
              success: false,
              message: "Slug is Required",
            });
          case !description:
            return res.status(400).send({
              success: false,
              message: "Description is Required",
            });
          case !price:
            return res.status(400).send({
              success: false,
              message: "Price is Required",
            });
          case !category:
            return res.status(400).send({
              success: false,
              message: "Category is Required",
            });
          case !quantity:
            return res.status(400).send({
              success: false,
              message: "Quantity is Required",
            });
          case photo && photo.size > 1000000:
            return res.status(400).send({
              success: false,
              message: "Image size should be less than 1mb",
            });
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true });
        if (photo) {
          products.photo.data = fs.readFileSync(photo.path); //path of the file
          products.photo.contentType = photo.type; //image/png
        }
        await products.save();
        res.status(201).send({
          success: true,
          products,
          message: "Product Updated Successfully",
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error In Updating Product",
        });
      }
}
//Filter Controller
export const productFilterControllers = async(req,res)=>{
try {
  const {checked,selectedPrice} = req.body;
  let args = {};
  if(checked.length>0){
    args.category = checked;
  }
  if(selectedPrice.length){
    args.price = {$gte:selectedPrice[0],$lte:selectedPrice[1]}
  }
  const products = await productModel.find(args);

  res.status(200).send({
    success: true,
    products,
    message: "Products Filtered Successfully",
  });

} catch (error) {
  console.log("Error:", error);


  res.status(400).send({
    success: false,
    error: error.message,
    message: "Error In Filtering Products"
  });
}

}

//product count
export const productCountController = async(req,res)=>{
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
      message: "Products Counted Successfully",
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).send({
      success: false,
      error: error.message,
      message: "Error In Counting Products"
    });
  }
}
//product per page
export const productlistcontroller = async(req,res)=>{
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt:-1});
    res.status(200).send({
      success: true,
      products,
      message: "Products Fetched Successfully",
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).send({
      success: false,
      error: error.message,
      message: "Error In Getting per page Products"
    });
  }
}
//search product
export const searchproductControllers = async(req,res)=>{
  try {
    const {keyword} = req.params;
    if(!keyword){
      return res.status(400).send({
        success: false,
        message: "Keyword is Required",
      });
    }
    const results = await productModel.find({
      $or:[
        {name:{$regex:keyword,$options:'i'}},
        {description:{$regex:keyword,$options:'i'}}
      ]
    }).select("-photo");
    res.json(results)
  } catch (error) {
    console.log("Error:", error);
    res.status(400).send({
      success: false,
      error: error.message,
      message: "Error In Searching Products"
    });
  }
}

//related products
export const relatedproductController = async(req,res)=>{
  try {
    const {pid,cid} = req.params;
    const products = await productModel.find({_id:{$ne:pid},category:cid}).select("-photo").limit(3).populate("category");
    res.status(200).send({
      success: true,
      products,
      message: "Related Products Fetched Successfully",
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).send({
      success: false,
      error: error.message,
      message: "Error In Getting Related Products"
    });
  }
}