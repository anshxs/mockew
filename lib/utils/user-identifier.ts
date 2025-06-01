// Generate a unique identifier for anonymous users
export function getUserIdentifier(): string {
  if (typeof window === "undefined") return "server"

  let identifier = localStorage.getItem("user_identifier")
  if (!identifier) {
    identifier = `anon_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
    localStorage.setItem("user_identifier", identifier)
  }
  return identifier
}
