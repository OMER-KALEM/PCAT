const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');

const ejs = require('ejs');
const photoController = require('./controllers/photoController');
const pageController = require('./controllers/pageController');

const app = express();

//DB Connect
mongoose.connect('mongodb+srv://OMER-KALEM:a8xC5JTkrtFFR2kL@cluster0.m6pgj.mongodb.net/pcat-db?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('DB CONNECTED');
}).catch((err) => {
  console.log('DB NOT CONNECTED');
  console.log(err);
})

//TEMPLATE ENGINE
app.set('view engine', 'ejs');

//MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

//ROUTES

//#region pageController
app.get('/about', pageController.getAboutPage);
app.get('/add', pageController.getAddPage);
app.get('/photos/edit/:id', pageController.getEditPage);
//#endregion

//#region photoController
app.get('/', photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhoto);
app.post('/photos', photoController.createPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);
//#endregion

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı... `);
});
