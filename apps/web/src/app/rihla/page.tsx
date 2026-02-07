import { getSchools } from "../../lib/actions"
import RihlaClient from "./rihla-client"

// Force dynamic rendering to avoid database access during build
export const dynamic = 'force-dynamic'

export default async function Page() {
  const schools = await getSchools()
  
  return <RihlaClient initialSchools={schools} />
}
