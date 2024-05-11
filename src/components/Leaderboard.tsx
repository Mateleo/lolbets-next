import { auth } from "@/auth"
import type { User } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

interface Props {
	users: User[]
}

export async function Leaderboard({ users }: Props) {
	const session = await auth()
	return (
		<ol className="flex flex-col min-w-max h-min">
			{users.map((user, index) => {
				const isCurrentUser = session?.user?.id === user.id
				return (
					<li
						key={user.id}
						className="flex items-center justify-between gap-6 odd:bg-custom-background-200 px-4 py-2 border-custom-border-100 border-x-[3px] border-b-[3px] first:border-t-[3px] last:rounded-b-lg first:rounded-t-lg"
					>
						<Link className="flex gap-3 items-center" href={`/player/${user.name}`}>
							<p className={`${isCurrentUser ? "text-custom-text-100" : "text-custom-text-200"} w-4 text-center`}>
								{index + 1}
							</p>
							<Image src={user.image!} width={50} height={50} alt={user.name!} className="rounded-full" />
							<p className={`font-semibold ${isCurrentUser ? "text-custom-text-100" : "text-custom-text-200"}`}>
								{user.name}
							</p>
						</Link>
						<p className="text-custom-yellow-100">
							<span className={`${isCurrentUser ? "font-semibold" : ""}`}>{user.points}</span>
							&nbsp;LP
						</p>
					</li>
				)
			})}
		</ol>
	)
}
