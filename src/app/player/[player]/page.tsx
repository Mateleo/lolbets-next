import { BetSection } from "@/components/BetSection"
import { SectionWithTitle } from "@/components/SectionWIthTitle"
import { getUserRank } from "@/lib/actions/user"
import { db } from "@/lib/prisma"
import type { Claim } from "@prisma/client"
import dayjs from "dayjs"
import Image from "next/image"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Page({ params }: { params: { player: string } }) {
	const player = await db.user.findFirst({
		where: {
			OR: [
				{
					id: {
						equals: params.player,
						mode: "insensitive"
					}
				},
				{
					name: {
						equals: params.player,
						mode: "insensitive"
					}
				}
			]
		},
		include: {
			bets: {
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
						scheduled_at: "desc"
					}
				}
			},
			claims: {
				orderBy: {
					date: "desc"
				}
			}
		}
	})

	if (!player) redirect("/player")

	const rank = await getUserRank(player.id)
	const nbOfBets = player.bets.length
	const nbOfEndedBets = player.bets.filter((bet) => bet.match.bets_distributed).length
	const nbOfWonBets = player.bets.filter((bet) => bet.status === "won").length
	const nbOfLostBets = player.bets.filter((bet) => bet.status === "lost").length
	const lpWon = player.bets.reduce((a, b) => (b.status === "won" ? a + b.amountRecieved! : a), 0)
	const lpLost = player.bets.reduce((a, b) => (b.status === "lost" ? a + b.amountRecieved! : a), 0)
	const lpBetted = player.bets.reduce((a, b) => a + b.amount, 0)
	const winrate = ((nbOfWonBets / nbOfEndedBets) * 100).toFixed(1)
	return (
		<div className="m-auto max-w-7xl flex flex-col gap-4">
			<div className="bg-custom-background-200 border-[3px] border-custom-border-100 rounded-lg p-10">
				<section className="flex gap-4">
					<Image src={player.image!} width={100} height={100} alt={player.name!} className="rounded-xl" />
					<div className="flex flex-col">
						<h2 className="font-semibold text-2xl text-custom-text-100">{player.name}</h2>
						<span className="text-custom-text-200 text1-sm">Rank {rank}</span>
					</div>
				</section>
			</div>
			<section className="flex gap-4">
				<SectionWithTitle title="Stats" className="text-custom-text-200">
					<div className="bg-custom-background-200 border-[3px] border-custom-border-100 rounded-lg p-4 flex flex-col">
						<span className="text-custom-yellow-100 font-semibold">{player.points} LP</span>
						<span>
							{nbOfWonBets}V {nbOfLostBets}D
						</span>
						<span>Win Rate {winrate}%</span>
						<span>Total des LP pariés {lpBetted}</span>
						<span>Total des LP Gagnés {lpWon}</span>
						<span>Total des LP Perdus {lpLost}</span>
					</div>
				</SectionWithTitle>
				<SectionWithTitle title="Bets">
					<BetSection bets={player.bets} />
				</SectionWithTitle>
				<SectionWithTitle title="Claims">
					<ClaimHistory claims={player.claims} />
				</SectionWithTitle>
			</section>
		</div>
	)
}

interface ClaimHistoryProps {
	claims: Claim[]
}
function ClaimHistory({ claims }: ClaimHistoryProps) {
	if (claims.length === 0) {
		return <div>Vos claims s'affichent ici</div>
	}
	return (
		<ol className="flex flex-col min-w-max h-min">
			{claims.map((claim) => {
				const isToday = dayjs(claim.date).isSame(dayjs(), "day")
				const displayDate = dayjs(claim.date).format(`${isToday ? "[Aujourd'hui]" : "DD/MM"} - H:mm`)
				return (
					<li
						key={claim.id}
						className="flex items-center justify-between gap-6 odd:bg-custom-background-200 px-4 py-2 border-custom-border-100 border-x-[3px] border-b-[3px] first:border-t-[3px] last:rounded-b-lg first:rounded-t-lg"
					>
						<span className="font-semibold">+ {claim.amount}</span>
						<span className="text-custom-text-200 text-sm">{displayDate}</span>
					</li>
				)
			})}
		</ol>
	)
}
