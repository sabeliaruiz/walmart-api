const db = require('./../shared/db/db');
const Product = require('./../shared/db/models').Product;
const _ = require('lodash');

class ProductController{
  async getProductQuery(query) {
    try {
        let products;
        const value = query.value;
        if(this.isOnlyNumber(value)){
            products = await Product.find({ id: value });
        }
        if(_.isUndefined(products)) {
            products = await Product.find(
                { $or: [ { brand: new RegExp(value) },  { description: new RegExp(value) } ] } 
            );
        }
        return products;
    } catch (error) {
        return Promise.reject(error);
    }
  }

  applyDiscount(products, isPalindromo){
    try {
      const result = [];
        for (let i = 0; i < products.length; i += 1) {
          result.push({
            id: products[i].id,
            brand: products[i].brand,
            description: products[i].description,
            image: products[i].image,
            price: products[i].price,
            priceDis: isPalindromo ? products[i].price*0.5 : products[i].price,
            isPalindromo
          });
        }
        return result;
    } catch (error) {
        throw new ERROR(error);
    }    
  }
  
  isOnlyNumber(value) {
    if (value) {
      return /^[0-9]*$/.test(value);
    }
    return false;
  }
}

module.exports = ProductController;
