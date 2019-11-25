const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema(
  {
    location: { type: { type: String }, coordinates: [Number] }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;