import Authentication from "../components/Authentication";
import ProjectList from "../components/ProjectList";
import HomeSection from "../sections/HomeSection";

export default function Home() {
  return (
    <main className="h-full w-full">
      <Authentication />
      <HomeSection />
      <ProjectList />
    </main>
  );
}
