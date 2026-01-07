const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

// views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// DB connection
main()
  .then(() => console.log("connection successful"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");

  // INDEX
  app.get("/chats", async (req, res) => {
    const chats = await Chat.find();
    res.render("index", { chats });
  });

  // NEW
  app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
  });

  // CREATE
  app.post("/chats", async (req, res) => {
    let { from, to, msg } = req.body;
    let newChat = new Chat({
      from,
      to,
      msg,
      created_at: new Date()
    });
    await newChat.save();
    res.redirect("/chats");
  });

  // EDIT
  app.get("/chats/:id/edit", async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
  });

  // UPDATE
  app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;

    await Chat.findByIdAndUpdate(
      id,
      { msg: newMsg },
      { runValidators: true, new: true }
    );

    res.redirect("/chats");
  });
}


//destory route
app.delete("/chats/:id", async (req, res) => {
  let { id } = req.params;

  let chatToBeDeleted = await Chat.findByIdAndDelete(id);

  console.log(chatToBeDeleted);
  res.redirect("/chats");
});


// ROOT
app.get("/", (req, res) => {
  res.send("root is working");
});

// SERVER
app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
