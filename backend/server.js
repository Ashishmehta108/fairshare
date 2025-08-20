import express, { urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
dotenv.config();


import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import billRoutes from './routes/bills.routes.js';
import connectToDb from './db/db.js';


const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(urlencoded({ extended: true }));

connectToDb();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bills', billRoutes);

app.get('/', (req, res) => {
  res.send('FairShare API is running...');
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
