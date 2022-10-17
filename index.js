if (process.NODE_ENV !== "production"){
  require('dotenv').config()
}

//================MODULOS!!================
const User = require('./models/user')
const express = require('express')
const session = require('express-session')
const bcrypt = require('bcrypt')
const passport = require('passport')
const initializePassport = require('./passport-config')
const flash = require('express-flash')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const { ObjectId, ObjectID } = require('mongodb')
//================FIM DOS MODULOS================ 

const app = express()
const users = []
app.use(express.urlencoded({extended: false}))
app.use(flash())

//================COOKIES!!================
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }//30 MIN!
}))
app.use(passport.initialize())
app.use(passport.session())
//================COOKIES!!================

app.use(methodOverride('_method'))


//================INFO DATABASE================
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS
const dbHost = process.env.DB_HOST
//================END INFO DATABASE================

//================CONNECTION DATABASE================
mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}`)
  .then(() =>{
  app.listen(3000)
  console.log('Conectado ao banco de dados MongoDB na porta 3000')
}).catch((err) => console.log(err))
//================END CONNECTION DATABASE================

//================VERIFICATION SESSION================
initializePassport(passport, 
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)
//================END VERIFICATION SESSION================

//================CONFIGURATION PAGE LOGIN================
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/home_logado',
    failureRedirect: '/login',
    failureFlash: true
  }))
//================END CONFIGURATION PAGE LOGIN================
  
  
//================CONFIGURATION PAGE REGISTER================
app.post('/register', checkNotAuthenticated, async (req,res) => { 
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10) //GERADOR A SENHA HASH
    const users = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      number: req.body.phone,
      age: req.body.age
  })
    await users.save() //SALVANDO O ÚSUARIO
    res.redirect('/login') //REDIRECIONANDO PARA A PÁGINA DE LOGIN APÓS O REGISTRO CONCLUIDO
    console.log(users);
  } catch (e){
    console.log(e); //MOSTRAR O ERRO NO CONSOLE
    res.redirect('/register') //REDIRECIONANDO PARA A MESMA PÁGINA APÓS UMA FALHA NO REGISTRO
  }})
//================END CONFIGURATION PAGE REGISTER================

//================Visialização arquivo JS/CSS
app.use(express.static("views"));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
//================Visialização arquivo JS/CSS================


//================ ROUTES================
app.get("/", function(req,res){
  res.render(__dirname + "/views/home.ejs")
})
app.get("/home_logado", checkAuthenticated, function(req,res){
  res.render(__dirname + "/views/home_logado.ejs")
})
app.get('/register', checkNotAuthenticated,  (req, res) => {
  res.render('../views/cadastro/cadastro.ejs')
})
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('../views/cadastro/login.ejs')
})
app.get('/caronas', checkAuthenticated, (req, res) => {
  res.render('../views/paginas/caronas.ejs')
})
app.get('/crush', checkAuthenticated, (req, res) => {
  res.render('../views/paginas/crush.ejs')
})
app.get('/achados', checkAuthenticated, (req, res) => {
  res.render('../views/paginas/achados.ejs')
})
app.get('/games', checkAuthenticated, (req, res) => {
  res.render('../views/paginas/games.ejs')
})
app.get('/perfil', checkAuthenticated, (req, res) => {
  res.render('../views/paginas/perfil.ejs', {
    name: req.user.name,
    number: req.user.number,
    age: req.user.age,
  }
  )
})

//================DELETE================

//================DELETE================

//================LOGOUT!!================ 
app.delete("/logout", (req, res) => {
  req.logout(req.user, err =>{
    if (err) return next(err)
    res.redirect('/login')
  })
})
//================LOGOUT!!================


//================FUNCTIONS VERIFICATION AUTHENTICATION!! MIDDLEWARE!!================
function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/login")
}
function checkNotAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect("/home_logado")
  }
  next()
}
//================END FUNCTIONS VERIFICATION AUTHENTICATION!! MIDDLEWARE!!================
