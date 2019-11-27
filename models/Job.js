const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jobSchema = new Schema(
  {
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    end_date: { type: Date, required: true },
    start_date: { type: Date, required: true },
    location: { type: Schema.Types.ObjectId, ref: "Location" },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
