import { auth } from "@/auth"
import type { Prisma } from "@prisma/client"
import dayjs from "dayjs"
import Image from "next/image"
import { BetSection } from "./BetSection"

interface Props {
	match: Prisma.MatchGetPayload<{
		include: {
			opponents: true
			league: true
			games: true
			bets: true
		}
	}>
}

export async function Matches({ match }: Props) {
	const session = await auth()

	const team1 = match.opponents.at(0)
	const team2 = match.opponents.at(1)
	const team1bets = match.bets.filter((bet) => bet.teamId === team1?.id)
	const team2bets = match.bets.filter((bet) => bet.teamId === team2?.id)
	const team1betsSum = team1bets.reduce((sum, bet) => sum + bet.amount, 0)
	const team2betsSum = team2bets.reduce((sum, bet) => sum + bet.amount, 0)
	const totalBets = match.bets.reduce((sum, bet) => sum + bet.amount, 0)
	const isBettable = match.status === "not_started"
	const teamUserBets = match.bets.find((bet) => bet.userId === session?.user?.id)
	const isRunningorFinished = match.status === "running" || match.status === "finished"
	return (
		<li className="rounded border-custom-border-100 border-[3px] p-4 gap-4 bg-custom-background-200 flex items-center justify-between">
			<div className="flex flex-col gap-2">
				<p className="text-custom-text-200 text-sm">
					{dayjs(match.scheduled_at).format("DD/MM - H:mm")} - {`BO${match.number_of_games}`}
				</p>
				<div>
					{match.opponents.map((team) => {
						const isWinner = match.winner_id === team.id
						return (
							<div key={team.id} className={"flex gap-4 items-center"}>
								<p className={`${isWinner ? "text-[#e9ce8b] font-semibold" : ""}`}>
									{isRunningorFinished &&
										(match.games.reduce((sum, game) => (game.winner_id === team.id ? sum + 1 : sum), 0) as number)}
								</p>
								<Image height={24} width={24} src={team.image_url} alt={`${team.name} logo`} />
								<p className="font-semibold">{team.acronym}</p>
							</div>
						)
					})}
				</div>
			</div>
			<section className="flex flex-col gap-2 items-end">
				<BetSection
					percentage={team1betsSum / totalBets}
					teamName={match.opponents.at(0)?.acronym!}
					matchId={match.id}
					teamId={match.opponents.at(0)?.id!}
					teamBets={team1bets}
					displayInput={isBettable}
					teamUserBets={teamUserBets}
				/>
				<BetSection
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
}
