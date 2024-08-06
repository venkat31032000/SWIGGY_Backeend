
const Vendor =  require("../models/Vendor");
const jwt = require("jsonwebtoken");
const dotEnv = require('dotenv');

dotEnv.config()

require('dotenv').config({ path: 'ENV_FILENAME' });

const secretKey = process.env.WhatIsYourName

const verifyToken = async(req,res,next) => {
    const token = req.headers.token;

    if(!token){
        return res.status(401).json({error:"Token is required"});

    }
    try {
        const decoded = jwt.verify(token, secretKey)
        const vendor = await Vendor.findById(decoded.vendorId);

        req.vendorId = vendor._id

        next()

        if(!vendor){
            return res.status(404).json({error: "vendor not found"})
        }

    } catch (error) 
    {
        console.error(error)
        return res.status(500).json({error :"Invalid Token"});
        
    }
    
}

module.exports = verifyToken