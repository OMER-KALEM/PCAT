const fs = require('fs');
const Photo = require('../models/Photo');

exports.getAllPhotos = async (req, res) => {
  const photosPerPage = 2;
  const totalPhotos = await Photo.find().countDocuments();
  const totalPageNumber = Math.ceil(totalPhotos / photosPerPage);
  const page = totalPageNumber < req.query.page ? totalPageNumber : req.query.page || 1;


  const photos = await Photo.find({})
    .sort('-dateCreated')
    .skip((page - 1) * photosPerPage)
    .limit(photosPerPage);

  res.render('index', {
    photos,
    current: page,
    pages: totalPageNumber,
  });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
};

exports.createPhoto = async (req, res) => {
  let uploadImage = req.files.image;
  let uploadPath = __dirname + '/../uploads/' + uploadImage.name;
  console.log(uploadPath);

  uploadImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadImage.name,
    });
    res.redirect('/');
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let path = __dirname + '/../public' + photo.image;
  fs.unlinkSync(path);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
