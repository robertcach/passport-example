module.exports.profile = (req, res, next) => {
    console.log(req.user); // ¿Se genera con los datos del req.body?
    res.render('profile') 
}