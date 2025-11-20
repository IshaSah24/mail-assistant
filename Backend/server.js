import  express from 'express';
import dotenv from 'dotenv';
import emailRouter from './routes/emailRoutes.js';
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors()); 


app.use(express.json());
const PORT = 5000;

app.use(express.urlencoded({ extended: true }));

app.use('/api/create', emailRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});