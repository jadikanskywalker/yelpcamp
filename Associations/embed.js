var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://jadikan:Love@Math1248@yelpcamp-rzbzf.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true,
});

var postSchema = new mongoose.Schema({
	title: String,
	content: String
});

var Post = mongoose.model('Post', postSchema);

var userSchema = new mongoose.Schema({
	name: String,
	email: String,
	posts: [postSchema]
});

var User = mongoose.model('User', userSchema);

User.findOne({name: 'Hermoine Granger'}, function(err, user) {
	if (err) {
		// console.log(err);
	} else {
		user.posts.push({title: 'Three Things I Really Hate', content: 'Voldomort. Voldemort. Voldemort.'});
		user.save(function(err, user) {
			if (err) {
				console.log(err);
			} else {
				console.log(user);
			}
		});
	}
});