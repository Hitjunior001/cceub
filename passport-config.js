const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/user')

function initialize(passport, getUserByEmail, getUserById){
  //================AUTHENTICATE USERS================
  const authenticateUsers = async(email,password,done) => {
    const user = await User.findOne({email:email}) //PROCURANDO O ÚSUARIO NO BANCO DE DADOS PELO EMAIL 
    if  (user == null || !user || user == undefined ){ //
      return done(null, false, {message: "Úsuario não econtrado"})
    }
    try{
      if (await bcrypt.compare(password, user.password)){
        return done(null, user)
      } else{
        return done (null, false, {
          message: "A senha esta incorreta"
        })
      }
    }catch(e){
      console.log(User)
      console.log(e)
      return done(e)
    }
  //================END AUTHENTICATE USERS================  
  }
  //================AUTHENTICATE USERS================
  passport.use(new localStrategy({
    usernameField: "email"
  }, authenticateUsers ))

  passport.serializeUser(function (user, done) {

    done(null, user._id); 
  });
  
  passport.deserializeUser(function (id, done) {

    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}
  //================AUTHENTICATE USERS================
module.exports = initialize