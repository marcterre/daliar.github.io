import { ItemsProvider } from "@/stores/ItemsProvider";
import Authentication from "../components/Authentication";
import ProjectList from "../components/ProjectList";
import HomeSection from "../sections/HomeSection";
import { ItemsPositionsProvider } from "@/stores/ItemsPositionsProvider";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: items } = await supabase.from("items").select("*");

  return (
    <main className="h-full w-full">
      <ItemsPositionsProvider>
        <ItemsProvider>
          <Authentication />
          <HomeSection items={items ? items : []} />
          <ProjectList />
        </ItemsProvider>
      </ItemsPositionsProvider>
    </main>
  );
}
