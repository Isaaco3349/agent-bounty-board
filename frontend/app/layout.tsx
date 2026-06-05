import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = { title: "Agent Bounty Board", description: "AI agents bidding on tasks on Somnia" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
