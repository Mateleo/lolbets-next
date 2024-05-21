import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import "./globals.css"
import { auth } from "@/auth"
import { Toaster } from "@/components/ui/sonner"
import { isClaimAvailable } from "@/lib/actions/claim"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import { db } from "@/lib/prisma"

import { Sidebar } from "@/components/Sidebar"

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
					<SideBarContainer />
					<section className="overflow-auto w-screen">{children}</section>
				</div>
				<Toaster richColors />
			</body>
		</html>
	)
}

async function SideBarContainer() {
	const session = await auth()
	const { available, secondsUntilClaim } = await isClaimAvailable()
	const users = await db.user.findMany({
		select: {
			image: true,
			name: true
		}
	})
	return <Sidebar available={available} secondsUntilClaim={secondsUntilClaim} session={session} users={users} />
}
