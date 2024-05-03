import { db } from "@/lib/prisma"
import dayjs from "dayjs"
import { ArrowLeft, Check, X } from "lucide-react"
import Image from "next/image"

interface Props {
	userId?: string
}

export async function BetSection({ userId }: Props) {
	if (!userId) {
		return <div>User has no bets</div>
	}

	const bets = await db.bet.findMany({
		where: {
			userId: {
				equals: userId
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

	return (
		<ul className="flex flex-col w-max gap-2">
			{bets.map((bet) => {
				const isToday = dayjs(bet.match.scheduled_at).isSame(dayjs(), "day")
				const match = bet.match
				return (
					<li className={"border-[3px] bg-custom-background-200 border-custom-border-100 rounded p-4"} key={bet.id}>
						<div className="flex flex-col gap-2">
							<p className="text-custom-text-200 text-sm">
								{dayjs(match.scheduled_at).format("DD/MM - H:mm")} - {`BO${match.number_of_games}`}
							</p>
							<div>
								{match.opponents.map((team) => {
									const isWinner = match.winner_id === team.id
									const isTeamBettedOn = team.id === bet.team.id
									const isDistribued = bet.status !== "pending"
									const isBetWon = bet.status === "won"
									const isRunningOrFinished = match.status === "running" || match.status === "finished"
									return (
										<div key={team.id} className={"flex gap-4 items-center"}>
											<p className={`${isWinner ? "text-[#e9ce8b] font-semibold" : ""}`}>
												{isRunningOrFinished &&
													(match.games.reduce(
														(sum, game) => (game.winner_id === team.id ? sum + 1 : sum),
														0
													) as number)}
											</p>
											<Image height={24} width={24} src={team.image_url} alt={`${team.name} logo`} />
											<p className="font-semibold">{team.acronym}</p>
											{isTeamBettedOn && (
												<div className="flex gap-2 items-center">
													{isDistribued ? isBetWon ? <Check color="#2cb67d" /> : <X color="#e84057" /> : <ArrowLeft />}
													<p className="text-yellow-400">
														{bet.status === "pending" ? bet.amount : `${isBetWon ? "+" : ""} ${bet.amountRecieved}`} pts
													</p>
												</div>
											)}
										</div>
									)
								})}
							</div>
						</div>
					</li>
				)
			})}
		</ul>
	)
}
