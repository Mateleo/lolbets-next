import { idsTracked } from "@/lib/apiConnector"
import { db } from "@/lib/prisma"
import Image from "next/image"

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
			games: true
		},
		orderBy: {
			scheduled_at: "asc"
		}
	})

	return (
		<main className="max-w-5xl m-auto my-10">
			<ul className="flex flex-col gap-4">
				{matches.map((match) => (
					<li
						key={match.id}
						className="rounded border-[#010101] border-2 p-4 bg-[#242629] flex items-center justify-between"
					>
						<div className="flex flex-col gap-2">
							<p className="text-custom-text-200 text-sm">
								{match.scheduled_at.toLocaleString("fr-fr")} - {match.league?.name} - {`BO${match.number_of_games}`}
							</p>
							<div>
								{match.opponents.map((team) => {
									const isWinner = match.winner_id === team.id
									return (
										<div key={team.id} className={"flex gap-4 items-center"}>
											<p className={`${isWinner ? "text-[#e9ce8b]" : ""}`}>
												{match.games.reduce((sum, game) => (game.winner_id === team.id ? sum + 1 : sum), 0) as number}
											</p>
											<Image height={24} width={24} src={team.image_url} alt={`${team.name} logo`} />
											<p className="font-semibold">{team.acronym}</p>
										</div>
									)
								})}
							</div>
						</div>
						<div>bet section</div>
					</li>
				))}
			</ul>
		</main>
	)
}
