import { cn } from "@/lib/utils"
import type { Prisma } from "@prisma/client"
import dayjs from "dayjs"
import { ArrowLeft, Check, X } from "lucide-react"
import Image from "next/image"

interface Props {
	bets: Prisma.BetGetPayload<{
		include: {
			match: {
				include: {
					opponents: true
					games: true
				}
			}
			team: true
		}
	}>[]
}

export async function BetSection({ bets }: Props) {
	if (bets.length === 0) {
		return <div>Vos bets s'affichent ici</div>
	}

	return (
		<ul className="flex flex-col w-max gap-2">
			{bets.map((bet) => {
				const match = bet.match
				const isToday = dayjs(match.scheduled_at).isSame(dayjs(), "day")
				const isTomorrow = dayjs(match.scheduled_at).isSame(dayjs().add(1, "day"), "day")
				const displayDate = dayjs(match.scheduled_at).format(
					`${isToday ? "[Aujourd'hui]" : isTomorrow ? "[Demain]" : "DD/MM"} - H:mm`
				)
				return (
					<li className="border-[3px] bg-custom-background-200 border-custom-border-100 rounded-lg p-4" key={bet.id}>
						<div className="flex flex-col gap-2">
							<p className="text-custom-text-200 text-sm">
								{displayDate} - {`BO${match.number_of_games}`}
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
											{isRunningOrFinished && (
												<span
													className={cn(
														isWinner ? "text-custom-yellow-100 font-semibold" : "text-custom-text-100",
														"w-4 text-center"
													)}
												>
													{match.games.reduce((sum, game) => (game.winner_id === team.id ? sum + 1 : sum), 0) as number}
												</span>
											)}
											<Image
												height={24}
												width={24}
												src={team.image_url}
												alt={`${team.name} logo`}
												className={`${isRunningOrFinished ? (isWinner ? "" : "opacity-50") : "opacity-100"}`}
											/>
											<p
												className={`${
													isRunningOrFinished
														? isWinner
															? "font-semibold"
															: "text-custom-text-200"
														: "text-custom-text-100 font-semibold"
												}`}
											>
												{team.acronym}
											</p>
											{isTeamBettedOn && (
												<div className="flex gap-2 items-center">
													{isDistribued ? isBetWon ? <Check color="#2cb67d" /> : <X color="#e84057" /> : <ArrowLeft />}
													<p className="text-custom-yellow-100">
														{bet.status === "pending" ? bet.amount : `${isBetWon ? "+" : ""} ${bet.amountRecieved}`} LP
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
