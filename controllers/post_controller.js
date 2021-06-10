const Post = require('../model/post_model');



 exports.showIndex = (req, res,next) => {
     Post.findOne({"uid": req.body.uid},{_id : 0}) //fetches all the posts
     .then(result => {
        next();
        if(result.length == 0)
        res.sendStatus(400)
        else
        res.send(result);
     }).catch(err => {
         res.status(400).send(err);
     })
 }
//include post schema

