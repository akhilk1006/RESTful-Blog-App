var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer")
app.use(methodOverride("_method"))
mongoose.connect("mongodb://localhost/restful_blog_app",{useMongoClient:true})
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(expressSanitizer())
app.use(express.static("public"))

var blogSchema = mongoose.Schema({ 
    title: String,
    image: String,
    body:  String,
    created: {type: Date, default: Date.now}
})
var Blog = mongoose.model("Blog",blogSchema)

// Blog.create({
//     title: "test blog",
//     image: "http://s3.amazonaws.com/digitaltrends-uploads-prod/2017/08/31358195_l.jpg",
//     body: "Helo This is a blog post"
// })
app.get("/",function(req, res){
    res.redirect("/blogs")
})
app.get("/blogs",function(req, res){
    Blog.find({}, function(err, blogs){
       if(err){
           console.log("error occured in /blogs get")
       }
       else{
          res.render("index",{blogs: blogs}) 
       }
    })
})

app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog,function(err, newBlog){
        if(err){
            console.log("error occured in /blogs post")
        }
        else{
            res.redirect("/blogs")
        }
    })
})
app.get("/blogs/new", function(req, res){
    res.render("new")
})
app.get("/blogs/:id",function(req, res){
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            console.log("error occured")
        }
        else{
            res.render("show",{blog: foundBlog})
        }
    })
})
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("error occured in fetching")
        }
        else{
            res.render("edit",{blog: foundBlog})
        }
    })
    
})
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, updatedBlog){
        if(err){
            console.log("error updating")
        }
        else{
            res.redirect("/blogs/"+req.params.id)
        }
    })
})
app.delete("/blogs/:id",function(req, res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log("error deleting post")
        }
        else{
            res.redirect("/blogs")
        }
    })
})
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is running")
})