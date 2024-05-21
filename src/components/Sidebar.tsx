"use client"

import type { Prisma } from "@prisma/client"
import type { Session } from "next-auth"
import Link from "next/link"
import { PlayerSearch } from "./PlayerSearch"
import { Menu, Swords } from "lucide-react"
import { ClaimSection } from "./ClaimSection"
import { Profile } from "./Profile"
import { Separator } from "./ui/separator"
import { Socials } from "./Socials"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Props {
	session: Session | null
	available: boolean
	secondsUntilClaim: number
	users: Prisma.UserGetPayload<{
		select: {
			image: true
			name: true
		}
	}>[]
}

export function Sidebar({ available, secondsUntilClaim, session, users }: Props) {
	const [responsiveMenuOpen, setResponsiveMenuOpen] = useState<boolean>(false)
	useEffect(() => {
		console.log(responsiveMenuOpen)
	}, [responsiveMenuOpen])
	return (
		<>
			<Menu onClick={() => setResponsiveMenuOpen(!responsiveMenuOpen)} className="cursor-pointer md:hidden" />
			<nav
				className={cn(
					"p-4 flex-col justify-between bg-custom-background-200 border-[3px] border-custom-border-100 rounded-lg md:flex",
					responsiveMenuOpen ? "left-0 top-10 flex absolute h-[calc(100vh-40px)]" : "hidden"
				)}
			>
				<section className="flex flex-col gap-4">
					<Link href="/">
						<h1 className="text-5xl font-semibold">Lolbets</h1>
					</Link>
					<PlayerSearch users={users} />
					<Link
						href={"/matches"}
						className="flex gap-2 p-2 items-center text-custom-text-200 hover:text-custom-text-100 transition-all"
					>
						<Swords />
						<p>Match history</p>
					</Link>
				</section>
				<section className="flex flex-col gap-4">
					<ClaimSection available={available} secondsUntilClaim={secondsUntilClaim} />
					<Profile session={session} />
					<Separator className="bg-custom-border-100" />
					<Socials />
				</section>
			</nav>
		</>
	)
}
