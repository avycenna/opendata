import { getSchools } from "@/lib/actions"
import RihlaClient from "./rihla-client"

export default async function Page() {
  const schools = await getSchools()
  
  return <RihlaClient initialSchools={schools} />
}
