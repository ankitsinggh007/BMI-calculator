const mongoose = require("mongoose");
const  validator = require('validator');
const bcrypt=require('bcryptjs');
const JWT=require('jsonwebtoken');
const crypto=require('crypto');



const userSchema=new mongoose.Schema({

    name:{
        type:String,
        maxLength:20,
        minLength:[3,"please provide a full name "],
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        validate:[validator.isEmail,'please provide a correct email address']
    },
    password:{
        type:String,
        required:[true,"please provide your password"]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre('save',async function(){
    const salt= await bcrypt.genSalt(10);
    if(this.isModified('password')){
       this.password=await bcrypt.hash(this.password, salt);
    }
});

userSchema.methods.comparePassword = async function(password){
    try{
        return await bcrypt.compare(password, this.password);
    }catch(error){
        next(error);
    }
}
userSchema.methods.genToken= function(){

    return JWT.sign({id:this._id},process.env.Server_Secret,{expiresIn:process.env.Expire_Token});
    
}
userSchema.methods.genResetPasswordToken=function(){

    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;

}


module.exports=mongoose.model('User',userSchema);