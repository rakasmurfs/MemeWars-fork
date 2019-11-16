const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeedSchema = new Schema({
    meme1: String,
    meme2: String,
    voted: [String],
    votes: [{"meme1votes": 0}, {"meme2votes": 0}],
    date: { type: Date, default: Date.now}
});

const Feed = mongoose.model("Feed", FeedSchema);
module.exports = Feed;