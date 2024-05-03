import { idsTracked } from "@/lib/apiConnector"
import { db } from "@/lib/prisma"
import { ClaimSection } from "@/components/ClaimSection"
import { Matches } from "@/components/Matches"
import { Leaderboard } from "@/components/Leaderboard"
import { isClaimAvailable } from "@/lib/actions/claim"
import { BetSection } from "@/components/BetSection"
import { auth } from "@/auth"

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
		},
		include: {
			claims: {
				orderBy: {
					date: "desc"
				},
				take: 1
			}
		}
	})

	const session = await auth()

	const { available, secondsUntilClaim } = await isClaimAvailable()

	return (
		<main className="max-w-min text-nowrap m-10 flex gap-10">
			<ul className="flex flex-col gap-2">
				{matches.map((match) => (
					<Matches match={match} key={match.id} />
				))}
			</ul>
			<Leaderboard users={users} />
			<BetSection userId={session?.user?.id}/>
			<ClaimSection available={available} secondsUntilClaim={secondsUntilClaim} />
		</main>
	)
}
