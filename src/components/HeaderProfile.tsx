"use client"

import { signInAction, signOutAction } from "@/lib/actions/auth"
import type { Session } from "next-auth"
import Image from "next/image"
import { Button } from "./ui/button"

export function Profile({ session }: { session: Session | null }) {
	return (
		<>
			{session ? (
				<div className="flex flex-col gap-4 items-center">
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
							<p className="text-custom-yellow-100">
								<span className="font-semibold">{session.user?.points}</span>
								&nbsp;LP
							</p>
						</div>
					</div>
					<Button
						className="bg-custom-button-100 text-custom-text-100 hover:bg-custom-button-100/80"
						onClick={() => signOutAction()}
					>
						Déconnexion
					</Button>
				</div>
			) : (
				<Button
					className="bg-custom-button-100 text-custom-text-100 hover:bg-custom-button-100/80"
					onClick={() => signInAction()}
				>
					Connexion
				</Button>
			)}
		</>
	)
}
