import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import "./globals.css"
import { auth } from "@/auth"
import { ClaimSection } from "@/components/ClaimSection"
import { Profile } from "@/components/HeaderProfile"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { isClaimAvailable } from "@/lib/actions/claim"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

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
				<Separator className="bg-custom-border-100" />
				<section className="text-sm flex justify-evenly">
					<Link target="_blank" href={"https://discord.gg/4esport"}>
						<Image
							src={
								"https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6cc3c481a15a141738_icon_clyde_white_RGB.png"
							}
							width={24}
							height={24}
							alt={"discord logo"}
						/>
					</Link>
					<Link target="_blank" href={"https://github.com/Turdyo/"}>
						<Image
							src={"https://gyazo.com/85e7ce9196ae635161fec921602903a7/max_size/1000"}
							width={24}
							height={24}
							alt={"Github logo"}
						/>
					</Link>
				</section>
			</div>
		</nav>
	)
}
