const mongoose = require("mongoose");

const criminalSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    age: Number,
    sex: { type: String, trim: true },
    address: { type: String, trim: true },
    height: Number,
    weight: Number,
    crime: { type: String, trim: true },
    status: { type: String, trim: true, default: "ARRESTED" },
    imageURL: String,
    embedding: { type: [Number], select: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Criminal", criminalSchema, "criminals");
