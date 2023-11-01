import app from './app.js'
import connectionTODb from './config/dbConnection.js';
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectionTODb();
  console.log(`Server is running on http://localhost:${PORT} 🚀🚀🚀`);
});