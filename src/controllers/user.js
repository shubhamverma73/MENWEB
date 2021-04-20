//npm run dev
require('dotenv').config();
const express   = require('express');
const path      = require('path');
const hbs       = require("hbs");
const app       = express();
const port      = process.env.PORT || 3000;
require('./../db/conn');
require('./../models/users');
const usrRouter = require('./../routers/user');

const static_path   = path.join(__dirname, "../../public");
const template_path = path.join(__dirname, "../../templates/views");
const partials_path = path.join(__dirname, "../../templates/partials");
app.set('view engine', "hbs");
app.set('views', template_path); //Telling hbs to call our view folder for default index.hbs file
hbs.registerPartials(partials_path);
//console.log(template_path);

// =================================== Methods use by our system ===========================================
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(usrRouter);

app.use(express.static(static_path));

app.listen(port, () => {
    console.log('connected to server');
});