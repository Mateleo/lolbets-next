import type { User } from "@prisma/client"
import Image from "next/image"

interface Props {
	users: User[]
}

export async function Leaderboard({ users }: Props) {
	return (
		<li className="flex flex-col min-w-max bg-custom-background-200 border-[3px] border-custom-border-100 rounded h-min">
			{users.map((user, index) => (
				<ul
					key={user.id}
					className="flex gap-3 items-center border-b-[3px] border-custom-border-100 p-4 last:border-b-0"
				>
					<p>{index + 1}</p>
					<Image src={user.image!} width={50} height={50} alt={user.name!} className="rounded-full" />
					<div className="flex flex-col">
						<p className="font-semibold">{user.name}</p>
						<p className="text-yellow-400">{user.points} pts</p>
					</div>
				</ul>
			))}
		</li>
	)
}
