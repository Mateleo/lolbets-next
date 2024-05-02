"use client"

import { signInAction, signOutAction } from "@/lib/actions/auth"
import type { Session } from "next-auth"
import Image from "next/image"
import { Button } from "./ui/button"

export function HeaderProfile({ session }: { session: Session | null }) {
	return (
		<>
			{session ? (
				<div className="flex gap-4 items-center">
					<div className="flex gap-2 items-center">
						<Image
							src={session.user?.image!}
							width={50}
							height={50}
							alt={session.user?.name!}
							className="rounded-full"
						/>
						<div>
							<p className="font-semibold text-custom-text-100">{session.user?.name}</p>
							<p className="text-yellow-400">{session.user?.points} pts</p>
						</div>
					</div>
					<Button
						className="bg-custom-button-100 text-custom-text-100 hover:bg-custom-button-100/80"
						type="button"
						onClick={() => signOutAction()}
					>
						Logout
					</Button>
				</div>
			) : (
				<Button
					className="bg-custom-button-100 text-custom-text-100 hover:bg-custom-button-100/80"
					type="button"
					onClick={() => signInAction()}
				>
					Login
				</Button>
			)}
		</>
	)
}
