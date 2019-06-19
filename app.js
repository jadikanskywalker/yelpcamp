var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	seedDB = require('./seeds');

mongoose.connect('mongodb+srv://yelpcamp:TpAn8PCBwgkYTYC7@yelpcamp-rzbzf.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true,
});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
seedDB();

app.get('/', function(req, res) {
    res.render('landing');
});

app.get('/campgrounds', function(req, res) {
    Campground.find({}, function(error, campgrounds) {
        if (error) {
            console.log(error);
        } else {
            res.render('campgrounds/index', {campgrounds: campgrounds});
        }
    });
});

app.post('/campgrounds', function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    Campground.create(newCampground, function(error, campground) {
        if (error) {
            console.log('error');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

app.get('/campgrounds/new', function(req, res) {
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id', function(req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function(error, campground) {
        if (error) {
            console.log(error);
        } else {
            res.render('campgrounds/show', { campground: campground });
        }
    });
});

app.get('/campgrounds/:id/comments/new', function(req, res) {
	Campground.findById(req.params.id, function (err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', {campground: campground});
		}
	});
});

app.post('/campgrounds/:id/comments', function(req, res) {
	Campground.findById(req.params.id, function (err, campground) {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

app.listen(3000, function() {
    console.log('Yelpcamp Operational');
});
