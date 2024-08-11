const express= require('express');
const path= require('path');
const router= require('./routes/user');
const mongo= require('mongoose');



const PORT= 8003;

mongo.connect('mongodb://localhost:27017/TellYourStory').then(e=> console.log("mongoDB connected"));

const app= express();

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({extended: false}));

app.get('/', (req,res)=>{
    res.render('homepage');
})

app.use('/user', router);

app.listen(PORT, ()=> console.log(`server started at port: ${PORT}`));