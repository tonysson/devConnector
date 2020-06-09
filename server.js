const express = require('express');
const connectDB =  require('./config/db');
const userRoute = require('./routes/api/userRoutes');
const profileRoute = require('./routes/api/profileRoutes');
const authRoute = require('./routes/api/authRoutes');
const postsRoute = require('./routes/api/postsRoutes');

// initialize express
const app = express();

//connect db
connectDB();

//Initialize middleware
app.use(express.json({extended: false}));


//Define our Routes
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/profile', profileRoute);
app.use('/api/posts', postsRoute);


const PORT = process.env.PORT || 5000

app.listen(PORT , () => {
    console.log(`server runs on port ${PORT}`);
});