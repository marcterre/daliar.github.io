import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function GET(req: any, { params }: any) {
  const { id } = params;

  const foundProject = await Project.findOne({ _id: id });
  return NextResponse.json({ foundProject }, { status: 200 });
}

export async function PUT(req: any, { params }: any) {
  try {
    const { id } = params;

    const body = await req.json();
    const projectData = body.formData;

    const updateProjectData = await Project.findByIdAndUpdate(id, {
      ...projectData,
    });

    return NextResponse.json({ message: "Project updated" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function DELETE(req: any, { params }: any) {
  try {
    const { id } = params;

    await Project.findByIdAndDelete(id);
    return NextResponse.json({ message: "Project Deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
