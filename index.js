
// Import required packages
const express = require("express");
const app = express(); // create express app
const mongoose = require("mongoose"); // mongodb ODM
const path = require("path"); // handle file paths
const Chat = require("./models/chat"); // Chat mongoose model
const methodOverride = require("method-override"); // support PUT & DELETE from forms
const ExpressError = require("./ExpressError"); // custom error class

// --------------------
// App Configuration
// --------------------

// set views directory
app.set("views", path.join(__dirname, "views"));

// set EJS as template engine
app.set("view engine", "ejs");

// serve static files like CSS, images
app.use(express.static(path.join(__dirname, "public")));

// parse form data
app.use(express.urlencoded({ extended: true }));

// enable PUT & DELETE using ?_method=
app.use(methodOverride("_method"));

// --------------------
// Database Connection
// --------------------

// connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp")
  .then(() => console.log("MongoDB connection successful"))
  .catch(err => console.log(err));

// --------------------
// Routes
// --------------------

// INDEX ROUTE
// show all chats
app.get("/chats", async (req, res, next) => {
  try {
    const chats = await Chat.find(); // fetch all chats
    res.render("index", { chats }); // render index.ejs
  } catch (err) {
    next(err); // pass error to error middleware
  }
});

// NEW ROUTE
// show form to create new chat
app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

// CREATE ROUTE
// save new chat to database
app.post("/chats", async (req, res, next) => {
  try {
    let { from, to, msg } = req.body;

    let newChat = new Chat({
      from,
      to,
      msg,
      created_at: new Date()
    });

    await newChat.save(); // save chat
    res.redirect("/chats");
  } catch (err) {
    next(err);
  }
});

// EDIT ROUTE
// show edit form for a chat
app.get("/chats/:id/edit", async (req, res, next) => {
  try {
    let chat = await Chat.findById(req.params.id);
    if (!chat) {
      // if chat not found, throw error
      return next(new ExpressError(404, "Chat not found"));
    }
    res.render("edit.ejs", { chat });
  } catch (err) {
    next(err);
  }
});

// UPDATE ROUTE
// update chat message
app.put("/chats/:id", async (req, res, next) => {
  try {
    await Chat.findByIdAndUpdate(
      req.params.id,
      { msg: req.body.msg },
      { runValidators: true }
    );
    res.redirect("/chats");
  } catch (err) {
    next(err);
  }
});

// DELETE ROUTE
// delete a chat
app.delete("/chats/:id", async (req, res, next) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.redirect("/chats");
  } catch (err) {
    next(err);
  }
});

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Root route is working");
});

// --------------------
// 404 Handler
// --------------------

// runs if no route matches
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// --------------------
// Error Handling Middleware
// --------------------
app.use((err, req, res, next) => {
  let { status = 500, message = "Some error occurred" } = err;
  res.status(status).send(message);
});

// --------------------
// Server
// --------------------
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
