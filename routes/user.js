const {Router}= require('express');
const user= require('../models/user');

const router= Router();

router.get('/signin', (req,res)=>{
    return res.render('signin');
})

router.get('/signup', (req,res)=>{
    return res.render('signup');
})

router.post('/signin', async (req, res)=>{
    const {email, password}= req.body;
    try{
        const token= await user.matchPasswordandgenerateToken(email, password);
        // console.log("token: ", token);
        return res.cookie("token", token).redirect('/');
    }
    catch(error){
        return res.render("signin", {error:"incorrect email or password"});
    }

})
router.post('/signup', async (req, res)=>{
    const {fullName, email, password}= req.body;
    await user.create({
        fullName,
        email, 
        password
    })
    const token= await user.matchPasswordandgenerateToken(email, password);
    return res.cookie("token", token).redirect('/');
})
router.get("/logout", (req,res)=>{
    res.clearCookie('token').redirect('/');
})

router.get('/addblog', (req,res)=>{
    res.render('addblog');
})
module.exports= router; 