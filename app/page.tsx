"use client";
import CreateProjectFormComponent from "@/components/layout/CreateProjectFormComponent";
import HeaderComponent from "@/components/layout/HeaderComponent";
import { useUser } from "@auth0/nextjs-auth0/client";

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

export default function Home() {
  // const data = await getProjects();
  const { user } = useUser();

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

  return (
    <main>
      <div className="h-screen">
        <HeaderComponent />
        <div className="grid justify-center content-center gap-4">
          <h1 className="text-7xl">Lia Dingeldein</h1>
          <h2 className="text-4xl">Character designer</h2>
          {user && <CreateProjectFormComponent />}
        </div>
      </div>
    </main>
  );
}
