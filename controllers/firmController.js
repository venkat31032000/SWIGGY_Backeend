
const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Set the directory to save uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp and original file extension
    },
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB file size limit
    fileFilter: function (req, file, cb) {
      const fileTypes = /jpeg|jpg|png|gif/;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimeType = fileTypes.test(file.mimetype);
  
      if (extname && mimeType) {
        return cb(null, true);
      } else {
        cb(new Error('Error: Images Only!'));
      }
    },
  });
const addFirm = async (req,res)=>
{
    try{
    const{firmName, area, category, region, offer} = req.body

    const image = req.file? req.file.filename: undefined;
   
    
    const vendor = await Vendor.findById(req.vendorId)
    
    if(!vendor)
    {
        res.status(404).json({message: "Vendor not found"})
    }

    const firm = new Firm({
        firmName, area, category, region, offer, image, vendor: vendor._id
    })

    const savedFirm = await firm.save();

    await vendor.save()

    vendor.firm.push(savedFirm)

    return res.status(200).json({message : "Firm added successfully"});
    }
    catch(error)
    {
         console.error(error)
         res.status(500).json("internal server error")
    }
}

module.exports = {addFirm:[upload.single('image'), addFirm],};