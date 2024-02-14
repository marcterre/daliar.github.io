import mongoose, { model, models, Schema } from "mongoose";
import { ProjectType } from "@/app/page";

const URI = process.env.MONGODB_URI;

console.log(URI);

const projectSchema = new Schema({
  id: String,
  name: String,
  description: String,
});

const Project = models.Project || model("portfolio", projectSchema);

async function connectDatabase() {
  try {
    await mongoose.connect(URI!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}

async function getAllProjects() {
  await connectDatabase();

  const projects = await Project.find({});
  return projects;
}

async function getProject(id: string) {
  await connectDatabase();

  const article = await Project.findOne({
    id,
  });
  return article;
}

async function createProject(project: ProjectType) {
  await connectDatabase();

  const createdProject = await Project.create({
    ...project,
    id: crypto.randomUUID(),
  });

  return createdProject;
}

async function updateArticle(id: string, article: ProjectType) {
  await connectDatabase();

  await Project.updateOne(
    {
      id,
    },
    article
  );

  const updatedProject = getProject(id);

  return updatedProject;
}

async function deleteProject(id: string) {
  await connectDatabase();

  const deletedProject = getProject(id);
  await Project.deleteOne({
    id,
  });
  return deletedProject;
}

export {
  getAllProjects,
  getProject,
  createProject,
  deleteProject,
  updateArticle,
};
