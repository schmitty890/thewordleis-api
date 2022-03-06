import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const WordSchema = new Schema({
  word: {
    type: String,
  },
  day: {
    type: Number,
  },
  month: {
    type: Number,
  },
  year: {
    type: Number,
  },
});

WordSchema.set("timestamps", true);
