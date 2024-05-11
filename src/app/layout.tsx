import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import "./globals.css"
import { auth } from "@/auth"
import { Profile } from "@/components/HeaderProfile"
import { Toaster } from "@/components/ui/sonner"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ClaimSection } from "@/components/ClaimSection"
import { isClaimAvailable } from "@/lib/actions/claim"

export const metadata: Metadata = {
	title: "Lolbets renaissance",
	description: "Lolbets renaissance"
}

export default async function RootLayout({
	children
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html lang="en">
			<body className={cn(GeistSans.className, "bg-custom-background-100 text-custom-text-100 dark m-2")}>
				<div className="flex h-[calc(100vh-16px)] gap-2">
					<Sidebar />
					<section className="overflow-auto w-screen">{children}</section>
				</div>
				<Toaster richColors />
			</body>
		</html>
	)
}

async function Sidebar() {
	const session = await auth()
	const { available, secondsUntilClaim } = await isClaimAvailable()
	return (
		<nav className="p-4 flex flex-col justify-between bg-custom-background-200 border-[3px] border-custom-border-100 rounded-lg">
			<h1 className="text-5xl font-semibold">Lolbets</h1>
			<div className="flex flex-col gap-4">
				<ClaimSection available={available} secondsUntilClaim={secondsUntilClaim} />
				<Profile session={session} />
			</div>
		</nav>
	)
}
