const express = require('express');
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { checkLoggedIn } = require('./middleware/authMiddleware');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(__dirname + ".");
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

app.use(express.static('public'));
app.use(express.static('static'));
app.use(connectLiveReload());

app.set('view engine', 'ejs');

app.get('*', checkLoggedIn);
app.get('/', (req, res) => res.render('index'));
app.use(authRoutes);
app.use(userRoutes);


mongoose.connect(process.env.DB_CONNECTION_STRING, {})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    })