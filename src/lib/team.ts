import type { ApiOpponent } from "@/types/api"
import { db } from "./prisma"

export async function createOrUpdateTeams(teams: ApiOpponent[]) {
	return await db.$transaction(
		teams.map((team) =>
			db.team.upsert({
				where: {
					id: team.opponent.id
				},
				create: {
					id: team.opponent.id,
					acronym: team.opponent.acronym ?? "",
					image_url: team.opponent.image_url,
					name: team.opponent.name,
					slug: team.opponent.slug,
					location: team.opponent.location
				},
				update: {
					id: team.opponent.id,
					acronym: team.opponent.acronym ?? "",
					image_url: team.opponent.image_url,
					name: team.opponent.name,
					slug: team.opponent.slug,
					location: team.opponent.location
				}
			})
		)
	)
}
