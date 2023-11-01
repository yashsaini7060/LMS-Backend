import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true
}


const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return next(new AppError('All fields are required', 400));
    // res.status(400).json({
    //   success: false,
    //   message: 'All fields are required'
    // })
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppError('Email already exists', 400));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg'
    }
  });

  if (!user) {
    return next(new AppError('User registration failed, please try again'));
  }

  //TODO: File upload

  await user.save();

  user.password = undefined;

  const token = await user.genreateJWTToken;

  res.cookie('token', token, cookieOptions)

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user,
  })
  } catch (error) {
    return next(new AppError(error.message, 500));
  }

};


const login = async (req, res, next) => {


  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('All fields are required', 400));
    }

    const user = await User.findOne({
      email
    }).select('+password');

    if (!user || !user.comparePassword(password)) {
      return next(new AppError('Email or password does not match', 400))
    }

    const token = await user.genreateJWTToken();
    user.password = undefined;
    res.cookie('token', token, cookieOptions)


    res.status(200).json({
      success: true,
      message: 'User loggedin successfully',
      user
    })


  } catch (error) {
    return next(new AppError(error.message, 500));
  }



};
const logout = (req, res) => {
  try {
    res.cookie('token', null, {
      secure: true,
      maxAge: 0,
      httpOnly: true
    })
  
    res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    })
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
}; 

const getProfile = async(req, res) => {

  try{
    const userId = req.user.id;
    const usser = await User.findById(userId);
    res.status(200).json({
      success: true,
      message: 'User profile fetched successfully',
      user
  });
  } catch(error){
    return next(new AppError('Failed to fetch profile details', 500));
  
  }

};

export {
  register,
  login,
  logout,
  getProfile
}