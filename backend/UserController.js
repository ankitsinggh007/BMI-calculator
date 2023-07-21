const User = require("./model/User");

const Register = async (req, res, next) => {
  try { 
        const {email}=req.body;
        const user=await User.findOne({email});
        
        
        if(user) {
          throw new Error("use already existed");
        }
    const response = await User.create(req.body);
    return res.status(201).json({
      success: true,
      message: "user is succesfully registered",
      response: response,
      error: {},
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `${error.message}`,
      response: [],
      error: error,
    });
  }
};
const Login = async (req, res, next) => {
  try {
    const data = req.body;
    const { password, email } = data;

    if (!email || !password) throw new Error("please provide email or password");
    const response = await User.findOne({ email }); 
    if (!response) throw new Error("please provide correct email");
    const isPasswordMatch = await response.comparePassword(password);
    if (!isPasswordMatch) throw new Error("please provide correct password");
    const token = response.genToken();

    const { name } = response;
    const user = {
      name,
      email: response.email,
    };
    const option = {
      expires: new Date(
        Date.now() + process.env.Expire_Cokies * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };
    return res.status(200).cookie("token", token, option).json({
      success: true,
      message: "user is succesfully login",
      response: user,
      token: token,
      error: {},
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `${error.message}`,
      response: [],
      error: error,
    });
  }
};
const LogOut = async (req, res, next) => {
  try {
    const option = {
      expires: new Date(Date.now()),
      httpOnly: true,
    };
    return res.status(201).cookie("token", null, option).json({
      success: true,
      message: "user is succesfully loggedout",
      error: {},
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `${error.message}`,
      response: [],
      error: error,
    });
  }
};

const loadUser = async (req, res, next) => {
  return res.status(201).json({
    success: true,
    message: "user is succesfully load",
    error: {},
  });

};
module.exports = {
  LogOut,
  Login,
  Register,
  loadUser,
};
