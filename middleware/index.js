var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
			   req.flash("error", 'Campground can\'t be found.');
               res.redirect("back");
           }  else {
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error", 'Sorry, that is someone else\'s campground.');
                res.redirect("back");
            }
           }
        });
    } else {
		req.flash('error', 'Please login first.');
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error", 'Sorry, that is someone else\'s comment.');
                res.redirect("back");
            }
           }
        });
    } else {
		req.flash("error", 'Please login first.');
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash('error', 'Please login first.');
    res.redirect("/login");
};

module.exports = middlewareObj;