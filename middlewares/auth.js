const {validateToken}= require('../services/auth');

function checkForCookie(cookieName){
    return (req,res,next)=>{
        const tokenCookieValue= req.cookies[cookieName];
        // console.log(tokenCookieValue);
        if(!tokenCookieValue)   return next();

        try{
            const validation= validateToken(tokenCookieValue);
            // console.log(validation);
            req.user= validation;
        }catch(error){}

        return next();
    }
}

module.exports= checkForCookie;