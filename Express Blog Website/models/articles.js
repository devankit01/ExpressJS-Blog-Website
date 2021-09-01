const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    image: {
      type: "String",
      required: true,
    },
    title: {
        type: "String",
        required: true,
      },
    author: {
      type: "String",
      required: true,
    },
    body: {
      type: "String",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Articles = mongoose.model("Articles", articleSchema);
module.exports = Articles;
