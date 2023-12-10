import {model, Schema} from "mongoose"

const courseSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minLength: [8, 'Title must be atleast 8 characters'],
    maxLength: [59, 'Title must be less than 60 characters'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Title is required'],
    minLength: [8, 'Title must be atleast 8 characters'],
    maxLength: [200, 'Title must be less than 200 characters'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  thumbnail: {
    public_id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    }
  },
  lectures: [
    {
      title: String,
      description: String,
      thumbnail: {
        public_id: {
          type: String,
          required: true,
        },
        secure_url: {
          type: String,
          required: true,
        }
      }
    }
  ],
  numbersOfLectures:{
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});


const Course = model('Course', courseSchema);

export default Course;