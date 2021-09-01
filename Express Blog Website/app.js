const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session"); // session middleware

app.use(
  require("express-session")({
    secret: "Today is",
    resave: false,
    saveUninitialized: false,
  })
);

// For Parsing data
app.use(express.urlencoded({ extended: true }));
// Load View Engine
app.set("views", path.join(__dirname, "views")); // Optional
app.set("view engine", "ejs");
app.use(express.static("public"));
const dotenv = require("dotenv");
dotenv.config();

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Bring Articles Schema
const Articles = require("./models/articles");
const User = require("./models/user");

// Import and Call Function
const { dbConnect } = require("./dbConnect");

require("./config/passport")(passport);

//Passport middleware

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  console.log(req.user);
  console.log(req.isAuthenticated())
  next();
});

// Home Route - Get All Articles
app.get("/", (req, res) => {
  // res.send('Home')

  Articles.find({}, (err, articles) => {
    if (err) console.log(err);
    else
      res.render("index", {
        articles: articles,
        user : req.user
      });
  });

  let articles = [
    {
      _id: "612e588e6e3b5186674e13c0",
      image:
        "https://brighterbees.org/media/images/Red_and_Black_Dark_Gamer_Sports_YouTube_Thumbnail.png",
      title: "How to make Card View in Android Development",
      author: "Brad Traversy",
      body: "Article One Body",
    },
    {
      id: 2,
      image:
        "https://brighterbees.org/media/images/Green_Black_10_Designer_Mistake_Youtube_Thumbnail.png",
      title: "Read now about what is Cloud Computing  ",
      author: "Ankit Gupta",
      body: "Article Two Body",
    },
    {
      id: 3,
      image:
        "https://brighterbees.org/media/images/Yellow_Clean_Grunge_Skateboard_Youtube_Thumbnail.png",
      title: "What is Linux Operating System and its types",
      author: "John Doe",
      body: "Article Three Body",
    },
  ];
});

// Add Articles Get
app.get("/articles/add",isLoggedIn,  (req, res) => {
  res.render("addArticles");
});

// Add Articles Post
app.post("/articles/add", (req, res) => {
  console.log(req.body);
  req.body.author = req.user.name

  Articles.create(req.body, (err, article) => {
    console.log(article);
    res.redirect("index");
  });
});

// Get a Single Article
app.get("/articles/:id", (req, res) => {
  console.log(req.params.name);

  Articles.findById(req.params.id, (err, article) => {
    console.log(article);
    res.render("viewArticle", { article: article });
  });
});

// Update Article : GET
app.get("/articles/edit/:id", (req, res) => {
  console.log(req.params._id);

  Articles.findById(req.params.id, (err, article) => {
    console.log(article);
    res.render("editArticle", { article: article });
  });
});

// Update Article : POST
app.post("/articles/edit/:id", (req, res) => {
  console.log(req.params._id);

  Articles.findById(req.params.id, (err, article) => {
    console.log("ressssss",article.author===req.user.name);
    if(req.user.name === article.author){
      Articles.findByIdAndUpdate(req.params.id,req.body, (err, article) => {
        console.log(article)
      })
    }
    res.redirect("/");
  });
});

// Delete Article
app.get("/articles/delete/:id", (req, res) => {
  console.log(req.params._id);

  Articles.findById(req.params.id, (err, article) => {
    console.log("ressssss",article.author===req.user.name);
    if(req.user.name === article.author){
      Articles.findByIdAndDelete(req.params.id, (err, article) => {
        console.log(article)
      })
    }
    res.redirect("/");
  });
});

// Register User : GET
app.get("/signup", (req, res) => {
  res.render("auth/signup", { msg: "" });
});

// Register User : GET
app.get("/signin", (req, res) => {
  res.render("auth/signin", { msg: "" });
});

// Register User : POST
app.post("/signup", (req, res) => {
  if (req.body.password === req.body.password2) {
    // Hash Password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          req.body.password = hash;
          // Register User
          console.log(req.body);
          User.create(req.body, (err, user) => {
            console.log(user);
            res.redirect("signin");
          });
        }
      });
    });
  } else {
    res.render("auth/signup", { msg: "Password do not matched !!" });
  }
});

// Handling Login setup
app.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/articles/add",
    failureRedirect: "/",
  }),
  (req, res) => {
    console.log("Login Happens Here");
  }
);

//Logout
function isLoggedIn(req, res, next) {
  if (req.user) {
      next();
  } else {
      res.redirect('/signin');
  }
}

//Logout Route
app.get("/logout", (req, res) => {
  req.logout();
  console.log("Logout");
  res.redirect("/");
});

app.listen("3000", () => console.log("Server Started"));
