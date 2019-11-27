const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: Schema.Types.ObjectId, ref: "Location" },
    materials: { type: String, required: true },
    operator: { type: Schema.Types.ObjectId, ref: "User" },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    duration: { type: Number, required: true },
    status: {
      type: String,
      enum: ["COMPLETED", "ONGOING"]
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
