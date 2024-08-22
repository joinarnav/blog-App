const express= require('express');
const path= require('path');
const router= require('./routes/user');
const blogrouter= require('./routes/blog');
const mongo= require('mongoose');
const cookieParser = require('cookie-parser');
const checkForCookie = require('./middlewares/auth');
const Blog= require('./models/blog');


const PORT= 8003;

mongo.connect('mongodb://localhost:27017/TellYourStory').then(e=> console.log("mongoDB connected"));

const app= express();

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForCookie("token"));
app.use(express.static(path.resolve('./public')));

app.get('/', async (req,res)=>{
    const allBlogs= await Blog.find({});
    res.render('homepage',{User: req.user, blogs: allBlogs});
})

app.use('/user', router);
app.use('/blog', blogrouter);

app.listen(PORT, ()=> console.log(`server started at port: ${PORT}`));