"use client"

import { signInAction, signOutAction } from "@/lib/actions/authActions"
import type { Session } from "next-auth"
import Image from "next/image"
import { Button } from "./ui/button"

export function HeaderProfile({ session }: { session: Session | null }) {
	return (
		<>
			{session ? (
				<div className="flex gap-2 items-center">
					<Image src={session.user?.image!} width={50} height={50} alt={session.user?.name!} className="rounded-full" />
					<p className="font-semibold text-custom-text-100">{session.user?.name}</p>
					<Button type="button" onClick={() => signOutAction()}>
						Logout
					</Button>
				</div>
			) : (
				<Button type="button" onClick={() => signInAction()}>
					Login
				</Button>
			)}
		</>
	)
}
