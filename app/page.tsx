import Authentication from "../components/Authentication";
import ProjectList from "../components/ProjectList";

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <Authentication />
      <div className="h-full w-full grid content-center text-center ">
        <h1>daliar</h1>
        <h2>Portfolio</h2>
      </div>
      <ProjectList />
    </main>
  );
}
