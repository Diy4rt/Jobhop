const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();

// convert data into json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// use EJS as the view engine


app.set('view engine', 'ejs');

// static file
const static_path=path.join(__dirname,"../public");

app.use(express.static(static_path)); 




// Routes
app.get("/", (req, res) => {   
    res.render("home") ;
});

app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/about", (req, res) => {
    res.render("about");
});
app.get("/jobs", (req, res) => {
    res.render("jobs");
});
app.get("/contact", (req, res) => {
    res.render("contact");
});
app.get("/view_job", (req, res) => {
    res.render("view_job");
});

app.get("/account", (req, res) => {
        res.render('account');
});



//  register user

app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }


    // check if user already exist
    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        res.send("User already exists. Please choose different username");
    } else {
        // hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;

        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.status(302).redirect('/');


    }




});

app.post("/login", async (req, res) => {
   
    try {
        const user = await collection.findOne({ name: req.body.username });
        if (!user) {
            res.send("Username not found");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (isPasswordMatch) {
           
            res.redirect("/");
        } else {
            res.send("wrong password")
        }
    } catch {
        res.send("wrong detail")

    }
})




const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port:${port}`);
})

