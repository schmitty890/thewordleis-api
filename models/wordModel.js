import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const WordSchema = new Schema({
  word: {
    type: String,
  },
  day: {
    type: Number,
  },
});

WordSchema.set("timestamps", true);
