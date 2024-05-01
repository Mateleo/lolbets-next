import type { ApiLeague } from "../types/api"
import { db } from "./prisma"

export async function createOrUpdateLeagues(leagues: ApiLeague[]) {
	return await db.$transaction(
		leagues.map((league) =>
			db.league.upsert({
				where: {
					id: league.id
				},
				create: {
					id: league.id,
					name: league.name,
					slug: league.slug,
					image_url: league.image_url
				},
				update: {
					id: league.id,
					name: league.name,
					slug: league.slug,
					image_url: league.image_url
				}
			})
		)
	)
}
