import { auth } from "@/auth"
import type { User } from "@prisma/client"
import Image from "next/image"

interface Props {
	users: User[]
}

export async function Leaderboard({ users }: Props) {
	const session = await auth()
	return (
		<li className="flex flex-col min-w-max h-min gap-2">
			{users.map((user, index) => {
				const isCurrentUser = session?.user?.id === user.id
				return (
					<ul
						key={user.id}
						className={
							"flex gap-3 items-center border-[3px] border-custom-border-100 p-4 rounded bg-custom-background-200"
						}
					>
						<p className={`${isCurrentUser ? "text-custom-text-100" : "text-custom-text-200"}`}>{index + 1}</p>
						<Image src={user.image!} width={50} height={50} alt={user.name!} className="rounded-full" />
						<div className="flex flex-col">
							<p className={`font-semibold ${isCurrentUser ? "text-custom-text-100" : "text-custom-text-200"}`}>
								{user.name}
							</p>
							<p className="text-yellow-400">{user.points} pts</p>
						</div>
					</ul>
				)
			})}
		</li>
	)
}
