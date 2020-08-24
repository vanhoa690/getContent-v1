const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  name: String,
  slug: String,
  titleSEO: String,
  content: String,
  descSEO: String,
  genres: { type: Array },
  comments: { type: Array },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
  chaps: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chap",
    },
  ],
  completed: { type: Boolean, default: false },
  pulished: { type: Boolean, default: true },
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now },
  views: { type: Number, default: 100 },
});

const Story = mongoose.model("Story", storySchema, "stories");

module.exports = Story;


const mongoose = require("mongoose");

const chapSchema = new mongoose.Schema({
  name: String,
  slug: {
    type: String,
    unique: true,
  },
  titleSEO: String,
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story",
  },
  content: String,
  descSEO: String,
  pulished: { type: Boolean, default: true },
  created: { type: Date, default: Date.now },
  views: { type: Number, default: 100 },
});

const Chap = mongoose.model("Chap", chapSchema, "chaps");

module.exports = Chap;
