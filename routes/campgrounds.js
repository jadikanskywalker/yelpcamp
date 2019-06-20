var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

router.get('/', function(req, res) {
    Campground.find({}, function(error, campgrounds) {
        if (error) {
            console.log(error);
        } else {
            res.render('campgrounds/index', {campgrounds: campgrounds});
        }
    });
});

router.post('/', function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
    var newCampground = {name: name, image: image, description: description};
    Campground.create(newCampground, function(error, campground) {
        if (error) {
            console.log('error');
        } else {
			campground.author = author;
			campground.save();
            res.redirect('/campgrounds');
        }
    });
});

router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});

router.get('/:id', function(req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function(error, campground) {
        if (error) {
            console.log(error);
        } else {
            res.render('campgrounds/show', { campground: campground });
        }
    });
});

router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function (err, foundCampground) {
		res.render('campgrounds/edit', {campground: foundCampground});
	});
});

router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, campground) {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			res.redirect('/campgrounds/' + req.params.id);
		}
		Comment.deleteMany( {_id: { $in: campground.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
			campground.remove();
        });
		res.redirect('/campgrounds');
	});
});

module.exports = router;
