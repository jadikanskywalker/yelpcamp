var express = require("express"),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/restful_blog_app');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model('Blog', blogSchema);

app.get('/', function(req, res) {
    res.redirect('/blogs');
});

app.get('/blogs', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log('Error!');
        } else {
            res.render('index', { blogs: blogs });
        }
    });
});

app.get('/blogs/new', function(req, res) {
    res.render('new');
});

app.post('/blogs', function(req, res) {
    Blog.create(req.body.blog, function(err, newBlog) {
        if (!err) {
            res.redirect('/blogs');
        } else {
            res.render('new');
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log('Process Running...');
});
