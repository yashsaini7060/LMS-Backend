import mongoose from 'mongoose';

mongoose.set('strictQuery', false); //IT will ignore if and query goes wrong it wont crash the server

const connectionTODb = async() => {
  try{
    const {connection} = await mongoose.connect(process.env.mongoose || `mongodb://127.0.0.1:27017/lms`);

    if (connection) {
      console.log(`Connection to MongoDB: ${connection.host} 🚀🚀🚀`)
    }
  } catch(e){
    console.log(e);
    process.exit(1);
  }
}


export default connectionTODb;