import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const WordSchema = new Schema({
  word: {
    type: String,
  },
});

WordSchema.set("timestamps", true);
