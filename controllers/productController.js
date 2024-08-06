const Product = require("../models/Product");
const multer =  require("multer");
const Firm = require("../models/Firm")

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

  const addProduct = async (req,res)=>{
    try {
        const {productName,price, category,bestseller,description} =req.body;
        const image = req.file? req.file.filename: undefined;
   

        const firmId = req.params.firmId
        const firm = await Firm.findById(firmId);

        if(!firm)
        {
            return res.status(404).json({error: "No firm forund"});

        }

        const  product = new Product({
            productName,price, category,bestseller,description,image,firm: firm._id
        })

        const savedProduct = await Product.save()

        firm.products.push(savedProduct)

        await firm.save()

        res.status(200).json(savedProduct)
    } 

    catch (error) {
        console.error(error)
        res.status(500).json({error:"Internal server error"})
    }
  }

  module.exports = {addProduct:[upload.single('image'), addProduct],};