import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const loadProjects = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: projects, error } = await supabase.from("projects").select("*");

  if (error) {
    console.error(error.message);
    return [];
  }

  return projects;
};

const ProjectList = async () => {
  const projects = await loadProjects();

  return (
    <ul>
      {projects?.map((project) => (
        <li key={project.id} className="max-h-full max-w-full">
          <img src={project.image_url} alt={project.title} />
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;
