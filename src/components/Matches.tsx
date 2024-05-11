import { auth } from "@/auth"
import { cn } from "@/lib/utils"
import type { Prisma } from "@prisma/client"
import dayjs from "dayjs"
import Image from "next/image"
import { MatchBetSection } from "./MatchBetSection"

interface Props {
	matches: Prisma.MatchGetPayload<{
		include: {
			opponents: true
			league: true
			games: true
			bets: true
		}
	}>[]
}

export async function Matches({ matches }: Props) {
	const session = await auth()

	return (
		<ul className="flex flex-col gap-2">
			{matches.map((match) => {
				const team1 = match.opponents.at(0)
				const team2 = match.opponents.at(1)
				const team1bets = match.bets.filter((bet) => bet.teamId === team1?.id)
				const team2bets = match.bets.filter((bet) => bet.teamId === team2?.id)
				const team1betsSum = team1bets.reduce((sum, bet) => sum + bet.amount, 0)
				const team2betsSum = team2bets.reduce((sum, bet) => sum + bet.amount, 0)
				const totalBets = match.bets.reduce((sum, bet) => sum + bet.amount, 0)
				const isBettable = match.status === "not_started"
				const teamUserBets = match.bets.find((bet) => bet.userId === session?.user?.id)
				const isRunningOrFinished = match.status === "running" || match.status === "finished"
				const isToday = dayjs(match.scheduled_at).isSame(dayjs(), "day")
				const isTomorrow = dayjs(match.scheduled_at).isSame(dayjs().add(1, "day"), "day")
				const displayDate = dayjs(match.scheduled_at).format(
					`${isToday ? "[Aujourd'hui]" : isTomorrow ? "[Demain]" : "DD/MM"} - H:mm`
				)
				return (
					<li
						key={match.id}
						className="rounded-lg border-custom-border-100 border-[3px] p-4 gap-4 bg-custom-background-200 flex items-center justify-between"
					>
						<div className="flex flex-col gap-2">
							<span className="text-custom-text-200 text-sm">
								{displayDate} - {`BO${match.number_of_games}`}
							</span>
							<div>
								{match.opponents.map((team) => {
									const isWinner = match.winner_id === team.id
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
											<span
												className={`${
													isRunningOrFinished
														? isWinner
															? "font-semibold"
															: "text-custom-text-200"
														: "text-custom-text-100 font-semibold"
												}`}
											>
												{team.acronym}
											</span>
										</div>
									)
								})}
							</div>
						</div>
						<section className="flex flex-col gap-2 items-end">
							<MatchBetSection
								percentage={team1betsSum / totalBets}
								teamName={match.opponents.at(0)?.acronym!}
								matchId={match.id}
								teamId={match.opponents.at(0)?.id!}
								teamBets={team1bets}
								displayInput={isBettable}
								teamUserBets={teamUserBets}
							/>
							<MatchBetSection
								percentage={team2betsSum / totalBets}
								teamName={match.opponents.at(1)?.acronym!}
								matchId={match.id}
								teamId={match.opponents.at(1)?.id!}
								teamBets={team2bets}
								displayInput={isBettable}
								teamUserBets={teamUserBets}
							/>
						</section>
					</li>
				)
			})}
		</ul>
	)
}
