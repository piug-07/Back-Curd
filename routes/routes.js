const express = require('express');
const router = express.Router();
const User = require('../models/users')
const multer = require('multer')


// image upload

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.filename + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single("image");

// router.post("/add", upload, (req, res) => {
//     const user = new User({
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         image: req.file.filename,
//     });

//     user.save((err) => {
//         if (err) {
//             res.json({ message: err.message, type: "danger" });
//         } else {
//             req.session.message = {
//                 type: "success",
//                 message: "User added successfully!",
//             };
//             res.redirect("/");
//         }
//     });
// });


router.post("/add", upload, async (req, res) => {
    try {
      const user = new User({
        name: req.body.name,
        email: req.body.Email,
        phone: req.body.phone,
        image: req.file.filename,
      });
  
      await user.save();
  
      req.session.message = {
        type: "success",
        message: "User added successfully!",
      };
      res.redirect("/");
    } catch (err) {
      res.json({ message: err.message, type: "danger" });
    }
  });
  

router.get('/', (req, res) => {
    User.find().exec((err, users) => {
        if(err){
            res.json({ message: err.message})
        }else{
            res.render('index', {
                title: 'Home Page',
                users: users,
            });
        }
    })
})

router.get('/add', (req, res) => {
    res.render("add_users", { title: "add users" })
})

module.exports = router;


