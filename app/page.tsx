import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: projects } = await supabase.from('projects').select('*')

  return (
    <main>
      <ul>
        {projects?.map((project) => (
          <li key={project.id}>{project.title}</li>
        ))}
      </ul>
    </main>
  )
}