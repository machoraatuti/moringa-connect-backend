//Imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Comments Schema
const commentsSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

//News Schema
const newsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    comments: [commentsSchema],
    likes: {
        type: Number,
        default: 0
    },
    shares: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
});

//Instantiate a model from News Schema
const News = mongoose.model("News", newsSchema);

//Exports
module.exports = News;