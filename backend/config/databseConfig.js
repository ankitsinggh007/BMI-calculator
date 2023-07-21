const mongoose  = require("mongoose")

const Connect=async(url)=>{
    try {
        await mongoose.connect(`${url}/ecommerce`,{useNewUrlParser:true,useUnifiedTopology:true});
    } catch (error) {
        throw error;        
    }
}
module.exports=Connect; 