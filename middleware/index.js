// all middleware goes here

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // middleware, checkCampgroundOwnership
    // check if user logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err || !foundCampground) {
                req.flash('error', 'Campground not found');
                res.redirect('back');
            }
            else {
                // does use own the campground
                if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                }
                else {
                    req.flash('error', "You don't have permission to do that");
                    res.redirect('back');
                }
            }
        });
    }
    else {
        req.flash('error', "You need to be logged in to do that");
        res.redirect('back');
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // middleware, checkCommentOwnership
    // check if user logged in
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err || !foundComment) {
                req.flash('error', 'Comment not found');
                res.redirect('back');
            }
            else {
                // does use own the comment
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                }
                else {
                    req.flash('error', "You don;t have permission to do that");
                    res.redirect('back');
                }
            }
        });
    }
    else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    // middleware, isLoggedIn
    if (req.isAuthenticated()) {
        return next();
    }
    // have to be before redirect
    // key, val
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
};

module.exports = middlewareObj;