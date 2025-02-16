import slugify from "slugify";
import CategoryModel from "../models/CategoryModel.js";
//Create Category Controller
export const createcategoryController = async (req,res)=>{
    try {
        const {name} = req.body;
        if(!name){
           return res.status(401).send({
                success:false,
                message:"Name is required"
            })
        }
        const existingcategory = await CategoryModel.findOne({name});
        if(existingcategory){
           return res.status(200).send({
                success:true,
                message:"Category Already Exist"
            })
        }
        const category =await new CategoryModel({name,slug:slugify(name)}).save()
        res.status(201).send({
            success:true,
            message:"Category Created",
            category
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error In Category"
        
        })
    }
}
//Update Category Controller
export const updatecategoryController = async (req,res)=>{
    try {
        const {name} = req.body;
        const {id} = req.params;
        const category = await CategoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
        res.status(200).send({
            success:true,
            message:"Category Updated",
            category
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error In Updating Category"
        
        })
    }


}
//Get All Category Controller
export const categoryController = async(req,res)=>{
try {
    const category = await CategoryModel.find({});
    res.status(200).send({
        success:true,
        message:"All Category List",
        category
    })
    
} catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        error,
        message:"Error In Getting Category"
    
    })
}



}
//Get Single Category Controller
export const singlecategoryController = async(req,res)=>{

    try {
        const {slug} = req.params;
        const category = await CategoryModel.findOne({slug});
        res.status(200).send({
            success:true,
            message:"Single Category",
            category
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error In Getting Single Category"
    })
}}
//Delete Category Controller
export const deletecategoryController = async(req,res)=>{
    try {
        await CategoryModel.findByIdAndDelete(req.params.id);
        res.status(200).send({
            success:true,
            message:"Category Deleted"
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error In Deleting Category"
        
        })
    }
}