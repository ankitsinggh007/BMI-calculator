const JWT = require("jsonwebtoken");
const User = require("../model/User");
const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    const data = JWT.verify(token, process.env.Server_Secret);

    const user = await User.findById(data.id);
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({
        success:false,
        message:`${error.message}`,
        response:[],
        error:error
    })
  }
};

const isAutherized= (...role)=>{
    return (req,res,next)=>{
        if(!role.includes(req.user.role)){
            
            return res.status(401).json({
                message:`Role ${req.user.role} is not authroized to access it`,
            })
        }

        next();

    }
}

module.exports = {
  isAuthenticated,isAutherized
};