// const product = require("../Models/product");


// const getAllProductsStatic = async (req, res, next) => {
//   const Products = await product.find({ featured: true })
//   res.status(200).json({ Products, nbHits: Products.length });
//   res.status(200).json({ Products });
// };



// // const getAllProductsStatic = async (req, res, next) => {
// //   const Products = await product.find({}).select("name")                                                select method
// //   res.status(200).json({ Products, nbHits: Products.length });
// //   res.status(200).json({ Products });
// // };






// // const getAllProductsStatic=async(req,res,next)=>{
// //   const search="a"
// //   const Products=await product.find({                      logic of search
// //     name:{$regex:search,$options:"i"}                    
// //   });
// //   res.status(200).json({Products,nbHits:Products.length})
// // }



// const getAllProducts = async (req, res) => {
//   const { featured, name, company, sort,Field,limit,skip} = req.query;

//   const queryObject = {};
//   if (featured) {
//     queryObject.featured = featured === 'true' ? true : false;
//   }

//   if (name) {
//     queryObject.name = { $regex: name, $options: "i" }
//   }

//   if (company) {
//     queryObject.company = company
//   }

//   console.log(queryObject);

//  //sort
//   let result = product.find(queryObject).limit(limit).skip(skip);
//   if (sort) {
//    const SortList=sort.split(",").join(" ")
//    console.log(SortList);
//    result=result.sort(SortList)
//   }
//   else{
// result=result.sort("createdAt")
//   }

// //select

// if(Field){
//   const FieldList=Field.split(",").join(" ")
//   console.log(Field);
//   result=result.find({}).select(FieldList)
// }

// //Limit
// // if(limit){
// //   const limitNum=limit
// //   result=product.find(queryObject).limit(limitNum)
// // }
// // if(skip && limit){
// //   const SkipValue=skip
// //   const limitValue=limit
// //   // const sortVal=sort.split(",").joins(" ")                                //Not the right way
// //   // console.log(SkipValue);
// //   // console.log(limitValue);
// //   // console.log(sortVal);
// //   result=product.find(queryObject).limit(limitValue).skip(SkipValue)
// // }




//   const Products=await result
//   res.status(200).json({ Products, nbHits: Products.length });
// };



// module.exports = {
//   getAllProducts,
//   getAllProductsStatic
// }







/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//15-11-23

const Product = require('../Models/product')

const getAllProductsStatic = async (req, res, next) => {
  // const product = await Product.find({featured: true});
  // res.status(200).json({product, nbHits: product.length})

  const products = await Product.find({ price: { $gt: 40 } }).sort("price")
  res.status(200).json({ products, nbHits: products.length })
};

const getAllProducts = async (req, res) => {
  const { featured, name, company, sort, select, numericFilters } = req.query;
  const queryObject = {};


  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (company) {
    queryObject.company = { $regex: company, $options: "i" };
  }
  console.log(queryObject)

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      "<": "$lt",
      "=": "$eq",
      ">=": "$gte",
      "<=": "$lte"
    };
    const regEx = /\b(<|>|=|<=|>=)\b/g;
    let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
    console.log(filters)

    const options = ["price", "rating"];

    filters = filters.split(",").forEach((item) => {

      const [field, operator, value] = item.split("-");
      console.log(field, operator, value);

      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }         //{price : {$gt : 40}}
      }
    });

  }

  let product = Product.find(queryObject)




  if (sort) {
    const sortList = sort.split(",").join(" ")

    product = product.sort(sortList)
  }

  if (select) {
    const selectedlist = select.split(",").join(" ")

    product = product.select(selectedlist)
  }

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * 10
  product = product.limit(limit).skip(skip)

  const products = await product 
  res.status(200).json({ products, nbHits: products.length })
};

module.exports = {
  getAllProducts,
  getAllProductsStatic
}