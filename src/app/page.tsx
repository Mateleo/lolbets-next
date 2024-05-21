import { auth } from "@/auth"
import { BetSection } from "@/components/BetSection"
import { Leaderboard } from "@/components/Leaderboard"
import { Matches } from "@/components/Matches"
import { SectionWithTitle } from "@/components/SectionWIthTitle"
import { idsTracked } from "@/lib/apiConnector"
import { db } from "@/lib/prisma"
import dayjs from "dayjs"

export const dynamic = "force-dynamic"

export default async function Home() {
	const matches = await db.match.findMany({
		where: {
			league_id: {
				in: [idsTracked.leagues.LEC, idsTracked.leagues.LFL]
			},
			scheduled_at: {
				gte: dayjs().add(-1, "day").toDate()
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
			bets: {
				where: {
					status: {
						equals: "pending"
					}
				}
			}
		}
	})

	const session = await auth()

	const bets = session?.user?.id
		? await db.bet.findMany({
				where: {
					userId: {
						equals: session.user.id
					},
					match: {
						scheduled_at: {
							gte: dayjs().add(-1, "day").toDate()
						}
					}
				},
				include: {
					match: {
						include: {
							opponents: true,
							games: true
						}
					},
					team: true
				},
				orderBy: {
					match: {
						scheduled_at: "asc"
					}
				}
			})
		: []

	return (
		<main className="max-w-7xl m-auto text-nowrap flex flex-col gap-4">
			<section className="rounded-lg bg-custom-background-200 border-[3px] border-custom-border-100 p-4 flex flex-col gap-2">
				<h2 className="font-semibold lg:text-xl">Qu'est ce que Lolbets ?</h2>
				<p className="text-custom-text-200 text-wrap text-xs lg:text-base">
					Lolbets est une compétition communautaire où vous pouvez parier vos points (LP) sur les matchs compétitifs de
					League of Legends.
					<br />
					Lolbets est similaire aux prédictions Twitch.
					<br />
					Tous les jours, vous pouvez claim entre 0 et 1000 points, de manière aléatoire.
				</p>
			</section>
			<section className={"flex flex-col gap-2 justify-between lg:flex-row"}>
				<SectionWithTitle title="Bets à venir">
					<BetSection bets={bets} />
				</SectionWithTitle>
				<SectionWithTitle title="Matchs à venir">
					<Matches matches={matches} />
				</SectionWithTitle>
				<SectionWithTitle title="Leaderboard">
					<Leaderboard users={users} />
				</SectionWithTitle>
			</section>
		</main>
	)
}
