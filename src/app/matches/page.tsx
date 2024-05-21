import { Matches } from "@/components/Matches"
import { idsTracked } from "@/lib/apiConnector"
import { db } from "@/lib/prisma"
import dayjs from "dayjs"

export default async function Page() {
	const matches = await db.match.findMany({
		where: {
			league_id: {
				in: [idsTracked.leagues.LEC, idsTracked.leagues.LFL, idsTracked.leagues.MSI]
			},
			scheduled_at: {
				lte: dayjs().toDate()
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
			scheduled_at: "desc"
		}
	})
	return (
		<div className="max-w-5xl m-auto">
			<Matches matches={matches} />
		</div>
	)
}
