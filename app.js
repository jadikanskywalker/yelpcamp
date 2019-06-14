var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

app.get('/', function(req, res) {
    res.render('landing');
});

app.get('/campgrounds', function(req, res) {
    Campground.find({}, function(error, campgrounds) {
        if (error) {
            console.log(error);
        } else {
            res.render('index', {campgrounds: campgrounds});
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
    res.render('new');
});

app.get('/campgrounds/:id', function(req, res) {
    Campground.findById(req.params.id, function(error, campground) {
        if (error) {
            console.log(error);
        } else {
            res.render('show', { campground: campground });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log('Yelpcamp Operational')
});
