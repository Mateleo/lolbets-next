import { idsTracked } from "@/lib/apiConnector"
import { db } from "@/lib/prisma"
import { ClaimButton } from "@/components/ClaimButton"
import { Matches } from "@/components/Matches"
import { Leaderboard } from "@/components/Leaderboard"

export const dynamic = "force-dynamic"

export default async function Home() {
	const matches = await db.match.findMany({
		where: {
			league_id: {
				equals: idsTracked.leagues.MSI
			},
			opponents: {
				some: {
					id: {
						not: undefined
					}
				}
			}
		},
		include: {
			opponents: true,
			league: true,
			games: true,
			bets: true
		},
		orderBy: {
			scheduled_at: "asc"
		}
	})

	const users = await db.user.findMany({
		orderBy: {
			points: "desc"
		}
	})

	return (
		<main className="max-w-min text-nowrap m-10 flex gap-10">
			<ul className="flex flex-col gap-4">
				{matches.map((match) => (
					<Matches match={match} key={match.id} />
				))}
			</ul>
			<Leaderboard users={users} />
			<ClaimButton />
		</main>
	)
}
