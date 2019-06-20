var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

router.get('/', function(req, res) {
    Campground.find({}, function(error, campgrounds) {
        if (error) {
			req.flash("error", 'Something went wrong :(.');
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
			req.flash("error", 'Something went wrong :(.');
            console.log('error');
        } else {
			campground.author = author;
			campground.save();
			req.flash("success", 'You have added a new campground!');
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
			req.flash("error", 'Something went wrong.');
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
			req.flash("error", 'Something went wrong.');
			res.redirect('/campgrounds');
		} else {
			req.flash("success", 'You\'re campground has been updated!');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			req.flash("error", 'Something went wrong.');
			res.redirect('/campgrounds/' + req.params.id);
		}
		Comment.deleteMany( {_id: { $in: campground.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
			campground.remove();
        });
		req.flash("success", 'Campground deleted.');
		res.redirect('/campgrounds');
	});
});

module.exports = router;
