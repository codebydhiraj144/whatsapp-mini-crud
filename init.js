const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main()
  .then(() => console.log("connection successful"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");

  const allchats = [
    {
      from: "neha",
      to: "priya",
      msg: "send me your exam sheet",
    },
    {
      from: "neha",
      to: "dhiraj",
      msg: "teach me js",
    },
    {
      from: "neha",
      to: "amit",
      msg: "send me my photo",
    }
  ];

  const result = await Chat.insertMany(allchats);
  console.log("Chats inserted:", result);
}
