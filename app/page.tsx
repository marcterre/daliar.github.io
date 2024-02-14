import CreateProjectFormComponent from "@/components/CreateProjectFormComponent";
import Image from "next/image";

export type ProjectType = {
  _id?: string;
  title: string;
  description: string;
  image: {
    url: string;
    id: string;
  };
};

export type UpdateProjectType = {
  foundProject: ProjectType;
};

const getProjects = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/projects", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch topics");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading topics: ", error);
  }
};

export default async function Home() {
  const data = await getProjects();

  if (!data?.projects) {
    return <p>No projects.</p>;
  }

  const projects = data.projects;

  return (
    <main>
      <h1>Projects</h1>
      {projects &&
        projects.map((project: ProjectType) => (
          <div key={project._id}>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            {project.image && (
              <Image
                src={project.image.url}
                alt={project.title}
                width={100}
                height={100}
              />
            )}
          </div>
        ))}
      <CreateProjectFormComponent />
    </main>
  );
}