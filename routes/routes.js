const express = require('express');
const router = express.Router();
const User = require('../models/users')
const multer = require('multer')
const fs = require('fs');


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
    User.find()
        .then(users => {
            res.render('index', {
                title: 'Home Page',
                users: users,
            });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});



router.get('/add', (req, res) => {
    res.render("add_users", { title: "add users" })
})


router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id)
        .then(user => {
            if (user === null) {
                res.redirect("/");
            } else {
                res.render("edit_users", {
                    title: "edit_users",
                    user: user,
                });
            }
        })
        .catch(err => {
            res.redirect("/");
        });
});


router.post('/update/:id', upload, (req, res) => {
    let id = req.params.id;
    let new_image = '';

    if (req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync("./upload/" + req.body.old_image);
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image,
    })
        .then(result => {
            req.session.message = {
                type: 'success',
                message: 'User updated successfully!',
            };
            res.redirect('/');
        })
        .catch(err => {
            res.json({ message: err.message, type: 'danger' });
        });
});

router.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    User.findByIdAndDelete(id)
        .then(result => {
            try {
                fs.unlinkSync("./uploads/" + result.image);
            } catch (err) {
                console.log(err);
            }
            req.session.message = {
                type: "success",
                message: "User deleted successfully!",
            };
            res.redirect("/");
        })
        .catch(err => {
            res.json({ message: err.message, type: "danger" });
        });
});


module.exports = router;


