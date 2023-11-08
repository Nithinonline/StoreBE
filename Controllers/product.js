const product = require("../Models/product");


const getAllProductsStatic = async (req, res, next) => {
    // const Products = await product.find({});
    const Products = await product.find(req.params)
    res.status(200).json({ Products, nbHits: Products.length});

    res.status(200).json({  Products });  
  };
  

// const getAllProductsStatic=async(req,res,next)=>{
//     const {featured}=req.query;    
//     const query={}
   
// }


  const getAllProducts = async (req, res) => {
    const Products =  await product.find()

    res.status(200).json({Products})

  };
  
  module.exports = {
    getAllProducts,
    getAllProductsStatic
    
  }