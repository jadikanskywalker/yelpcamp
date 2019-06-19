var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://jadikan:Love@Math1248@yelpcamp-rzbzf.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true,
});

var postSchema = new mongoose.Schema({
	title: String,
	content: String
});

var Post = mongoose.model('Post2', postSchema);

var userSchema = new mongoose.Schema({
	name: String,
	email: String,
	posts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post'
	}]
});

var User = mongoose.model('User2', userSchema);

User.findOne({email: 'bob@bob.com'}).populate("posts").exec(function(err, user) {
	if (err) {
		console.log(err);
	} else {
		console.log(user);
	}
});
