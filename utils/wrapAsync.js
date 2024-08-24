module.exports = (fu) =>{
    return function(req,res,next){
        fu(req,res,next).catch(next);
    }
}