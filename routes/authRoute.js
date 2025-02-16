import express from "express";
import { isadmin, RequiredSignIn } from "../middlewares/authMiddleware.js";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
} from "../controllers/authController.js";
//Route object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//FORGOT PASSWORD || POST
router.post('/forgot-password',forgotPasswordController);

//TEST ROUTES
router.get("/test", RequiredSignIn, isadmin, testController);

//Protected Route for Dashboard
router.get("/user-auth", RequiredSignIn, (req, res) => {
  res.status(200).send({
    ok: true,
    message: "Protected Route",
  });
});
//Protected Route for Admin-Dashboard
router.get("/admin-auth", RequiredSignIn,isadmin, (req, res) => {
  res.status(200).send({
    ok: true,
    message: "Protected Route",
  });
});

export default router;
