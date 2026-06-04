import { getCSRFTokenEndpoint } from "@/lib/middleware/csrf"

export async function GET() {
  return getCSRFTokenEndpoint()
}
