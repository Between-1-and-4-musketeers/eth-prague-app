import { Result } from "~/declarations/backend/backend.did"

export const parseDfinityResult = <T>(query: Result): T => {
  return JSON.parse((query as any).Ok) as T
}
