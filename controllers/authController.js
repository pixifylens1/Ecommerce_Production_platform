import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import UserModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address,answer } = req.body;
    if (!name || !email || !password || !phone || !address || !answer) {
      return res.send({
        message: "Fill required parameters",    //<================== Change this message 
      });
    }
    const ExistingUser = await UserModel.findOne({ email }); 
    if (ExistingUser) {
      return res.status(200).send({
        success: false,
        msg: "Already Existed User Please Login",
      });
    }
    //register User
    const hashedPassword = await hashPassword(password);
    const user = await new UserModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer
    }).save();
    res.status(201).send({
      success: true,
      msg: "User Registed Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      msg: "Error in Registration",
      success: false,
      error,
    });
  }
};
export const loginController = async (req, res) => {
 
  try {
    const { email, password } = req.body;
    
    
    //VALIDATION
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //CHECK USER
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is Not Registered",
      });
    }
    
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(404).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //Token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login Successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    }); 
  }
};

//forgotPasswordController
export const forgotPasswordController =async(req,res)=>{
  try {
    const {email,newPassword,answer} = req.body;
    
    if (!email) {
      return res.send({
      success: false,
      message: "Email is required"
      });
    }
    if (!answer) {
      return res.send({
      success: false,
      message: "Answer is required"
      });
    }
    if (!newPassword) {
      return res.send({
      success: false,
      message: "New password is required"
      });
    }
    //CHECK USER
    const user = await UserModel.findOne({email,answer});
    //VALIDATE USER
    if(!user){
      return res.status(404).send({
        success:false,
        message:"Invalid Email or Answer"
      })
    }
    //UPDATE PASSWORD
    const hashedPassword = await hashPassword(newPassword);
    await UserModel.findByIdAndUpdate(user._id,{password:hashedPassword});
    res.status(200).send({
      success:true,
      message:"Password Updated Successfully"
    })

  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Error in forgot Password",
      error
    })
    
  }
}

export const testController = (req, res) => {
  res.send("protected Route");
};
