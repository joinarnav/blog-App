const {Schema, model}= require('mongoose');
const {createHmac, randomBytes}= require('crypto');
const {createToken, validateToken}= require('../services/auth');

const userschema= new Schema({
    fullName:{
        type: String,
        required: true
    },

    email:{
        type:String,
        required:true,
        unique: true
    },
    salt:{
        type: String,
    },
    password:{
        type:String,
        required:true,

    },
    profileImageURL:{
        type: String,
        default: '/images/default.png'
    },
    role:{
        type: String,
        enum:['user', 'admin'],
        default:'user'
    }
},{timestamps: true})

userschema.pre("save", function(next){
    const User= this;
    if(!User.isModified("password"))  return;

    const salt= randomBytes(16).toString('hex');
    const hashedPassword= createHmac("sha256", salt).update(User.password).digest("hex");

    this.salt= salt;
    this.password= hashedPassword;

    next();
})

userschema.static("matchPasswordandgenerateToken", async function(email, password){
    const User= await this.findOne({email});
    if(!User)   throw new Error('user not found');

    const salt= User.salt;
    const hashedpassword= User.password;

    const userHashed= createHmac("sha256", salt).update(password).digest("hex");

    if(hashedpassword!== userHashed)    throw new Error('Incorrect Password');
    const token= createToken(User);
    return token
})

const user= model('user', userschema);

module.exports= user;