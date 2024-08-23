const {Router}= require('express');
const multer= require('multer');
const path= require('path');
const router= Router();
const blog= require('../models/blog');
const comment= require('../models/comment');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
        const fileName= `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
        
    }
  })

  const upload = multer({ storage: storage })


router.get('/add-blog', (req,res)=>{
    return res.render('addblog', {User: req.user});
})

router.post("/",upload.single('coverImage'), async (req,res)=>{
    const {title, body}= req.body;
    const Blog= await blog.create({
        body,
        title,
        createdBy:req.user._id,
        coverimageURL:`/uploads/${req.file.filename}`
    })
    return res.redirect('/');
})

router.get('/:id', async (req,res)=>{
    const Blog= await blog.findById(req.params.id).populate("createdBy");
    const comments= await comment.find({blogId:req.params.id}).populate('createdBy');
    return res.render("blog",{
        user: req.user,
        Blog,
        comments,
    })
})

router.post('/comment/:blogId', async (req,res)=>{
    const Comment= await comment.create({
        content:req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    })
    return res.redirect(`/blog/${req.params.blogId}`);
});


module.exports=router;