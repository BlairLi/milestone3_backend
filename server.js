const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const expressValidator = require('express-validator');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
require('dotenv').config();

// app
const app = express();

// db connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    // exit process with failure
    process.exit(1);
  }
};
connectDB();

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('build'));
  // app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    // res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// app.all('*', (req, res) => {
//   res.status(404);
//   if (req.accepts('html')) {
//       res.sendFile(path.join(__dirname, '404.html'));
//   } else if (req.accepts('json')) {
//       res.json({ "error": "404 Not Found" });
//   } else {
//       res.type('txt').send("404 Not Found");
//   }
// });

// const PORT = 5001;
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
