import express from "express"
import { engine as exphbs } from "express-handlebars"
import session from "express-session"
import MongoStore from "connect-mongo"


const app = express()

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const tiempo = 10000

app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://user:pass@database.bt5jqpv.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions: advancedOptions,

    }),
    cookie: { maxAge: 10000},
    secret: "misecreto",
    resave: false,
    saveUninitalized: false
}))

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: "./main.hbs"}))

app.set('view engine', '.hbs')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

app.get('/login', (req, res) => {
    res.render('login.hbs')
})

app.post('/login', (req, res)=>{
    const nombre  = req.body
    req.session.nombre = nombre
    res.redirect('/welcome')
})

app.get('/welcome', (req, res)=>{
    if(!req.session.nombre){
        res.redirect('/login')
    }else{
        const nombre = req.session.nombre
        res.render('welcome.hbs', nombre)
    }

})

app.get('/logout', (req, res)=>{
    const nombre = req.session.nombre
    req.session.destroy()
    res.render('logout.hbs', nombre)
})

const PORT = 8080

app.listen(PORT, () => {
    console.log("Escuchando 8080");
})
