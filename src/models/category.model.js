const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: "string" },
  farsiName: { type: "string" },
  img: { type: String },
});

module.exports = mongoose.model("Category", categorySchema);
