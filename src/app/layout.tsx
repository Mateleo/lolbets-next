import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import "./globals.css"
import { auth } from "@/auth"
import { HeaderProfile } from "@/components/HeaderProfile"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
	title: "Lolbets renaissance",
	description: "Lolbets renaissance"
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await auth()
	return (
		<html lang="en">
			<body className={`${GeistSans.className} bg-custom-background-100 text-custom-text-100 dark`}>
				<header className="flex justify-between p-2">
					<h1 className="text-5xl font-semibold">Lolbets</h1>
					<HeaderProfile session={session} />
				</header>
				{children}
				<Toaster />
			</body>
		</html>
	)
}
