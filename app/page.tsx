import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: items } = await supabase.from("website").select("*");

  return (
    <main className="h-full w-full">
      <div className="bg-black">
        {items?.map((item) => {
          return <div className="">{item.name}</div>;
        })}
      </div>
    </main>
  );
}
