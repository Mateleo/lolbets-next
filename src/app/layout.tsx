import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import "./globals.css"
import { auth } from "@/auth"
import { HeaderProfile } from "@/components/HeaderProfile"

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
			<body className={GeistSans.className}>
				<header className="flex justify-between">
					<h1 className="text-5xl font-semibold">Lolbets</h1>
					<HeaderProfile session={session} />
				</header>
				{children}
			</body>
		</html>
	)
}
