const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model")
const { body, validationResult } = require('express-validator');

router.post("/", 
    body("first_name").notEmpty().withMessage("first_name is required"),
    body("last_name").notEmpty().withMessage("first_name is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("pincode").isLength({ min: 6, max: 6}).withMessage("Pincode is not valid"),
    body("age").custom((value) => {
        if(value < 1 || value > 100) {
            throw new Error("Age should be between 1 and 100")
        } else return true;
    }),
    body("gender").custom((value) => {
        const genderRoles = ["Male", "Female", "Others"];
        if(!genderRoles.includes(value)) {
            throw new Error("Please enter a valid gender")
        } else return true;
    }),
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            let newErrors = errors.array().map(({ msg, param, location }) => {
                return {
                    [param]: msg,
                }
            })

            return res.status(400).json({ errors: newErrors })
        }


        try{
            const user = await userModel.create(req.body);
            console.log("new user", user);
    
            return res.status(200).send(user);
        } catch(e) {
            return res.status(500).send({ message: e.message, status: "failed" })
        }
    }
 )


 module.exports = router;