import Course from "../models/course.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises"
const getAllCourses = async (req, res, next) => {
  try {

    const courses = await Course.find({}).select('-lectures');

    res.status(200).json({
    success: true,
    courses
    });

  } catch (error) {

    return next(
      new AppError(e.message, 500)
    )

  }

}

const getLecturesByCourseId = async (req, res, next) => {
  try {
    const {id} = req.params;
    const course = await Course.findById(id);

    if(!course) {
      return next(
        new AppError('No course found with this id', 404)
      )
    }

    res.status(200).json({
      success: true,
      message: 'Course lectures fetched successfully',
      lectures: course.lectures
    })

  } catch (error) {
    
    return next(
      new AppError(e.message, 500)
    )

  }
}

const createCourse = async (req, res, next) => {
  const{ title, description, category, createdBy} = req.body;

  if( !title || ! description || !category || !createdBy){
    return next(
      new AppError('All fields are required', 400)
    )
  }

  const course = await Course.create({
    title,
    description,
    category,
    createdBy,
    thumbnail: {
      public_id: 'Default',
      secure_url: 'Default'
    }
  })

  if(!course){
    return next(
      new AppError('Course could not be created, please try again', 500)
    )
  }

  if(req.file){
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
    folder: 'lms'
    })
    if(result){
      course.thumbnail.public_id = result.public_id;
      course.thumbnail.secure_url = result.secure_url;
    }

    fs.rm(`uploads/${req.file.filename}`)
  }

  await course.save();

  res.status(200).json({
    success: true,
    message: 'Course created successfully',
    course
  })

}


const updateCourse = async (req, res, next) => {

  try {

    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(
      id,
      {
        $set: req.body
      },
      {
        runValidators: true 
      }
    )

    if(!course){
      return next(
        new AppError('No course found with this id', 404)
      )
    }
    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course
    })


  } catch (error) {
    return next(
      new AppError('Course could not be created, please try again', 500)
    )
  }

}

const removeCourse = async (req, res, next) => {
  
  try {

    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    
    if(!course){
      return next(
        new AppError('No course found with this id', 404)
      )
    }


    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      course
    })

  } catch (error) {
    return next(
      new AppError('Course could not be deleted, please try again', 500)
    )
  }

}

const addLectureToCourseId = async(req, res, next) => {

  try {
    
    
  const {id} = req.params;
  const {title, description} = req.body;

  const course = await Course.findById(id);

  if(!course){
    return next(
      new AppError('No course found with this id', 404)
    )
  }

  const lectureData = {
    title,
    description,
    thumbnail: {
      public_id: 'Default',
      secure_url: 'Default'
    }
  }

  if(req.file){
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
    folder: 'lms'
    })
    if(result){
      lectureData.thumbnail.public_id = result.public_id;
      lectureData.thumbnail.secure_url = result.secure_url;
    }

    fs.rm(`uploads/${req.file.filename}`)
  }


  course.lectures.push(lectureData);

  course.numbersOfLectures= course.lectures.length; 

  await course.save();

  res.status(200).json({
    success: true,
    message: 'Lecture added successfully',
    course
  })

  } catch (error) {
    
    return next(
      new AppError('Course could not be deleted, please try again', 500)
    )

  }





}



export {
  getAllCourses,
  getLecturesByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
  addLectureToCourseId
}
