import mongoose, { Schema } from "mongoose";

const URI = process.env.MONGODB_URI;
mongoose.connect(URI!);
mongoose.Promise = global.Promise;

const projectSchema = new Schema(
  {
    title: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
