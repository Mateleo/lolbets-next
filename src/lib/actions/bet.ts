"use server"

import { auth } from "@/auth"
import { db } from "../prisma"
import { revalidatePath } from "next/cache"

export async function bet({ amount, matchId, teamId }: { amount: number; matchId: number; teamId: number }) {
	const session = await auth()
	if (!session) return

	const user = session.user
	if (!user) return

	const match = await db.match.findUnique({
		where: {
			id: matchId
		},
		select: {
			id: true,
			status: true,
			bets: true,
			opponents: {
				select: {
					id: true
				}
			}
		}
	})

	if (!match) {
		return { error: "Match does not exist" }
	}
	if (match.status !== "not_started") {
		return { error: "Match has already started" }
	}
	const opponents = match.opponents.map((team) => team.id)
	if (!opponents.includes(teamId)) {
		return { error: "TeamId not in match opponents" }
	}
	if (user.points! < amount || amount === 0) {
		return { error: "Not enough points or bet equals 0" }
	}
	const previousBet = match?.bets.find((bet) => bet.userId === user.id)
	if (previousBet) {
		if (previousBet.teamId !== teamId) {
			return { error: "You have betted on the other team already" }
		}
		await db.bet.update({
			where: {
				id: previousBet.id
			},
			data: {
				amount: {
					increment: amount
				}
			}
		})
	} else {
		await db.bet.create({
			data: {
				amount: amount,
				userId: user.id!,
				matchId: matchId,
				teamId: teamId
			}
		})
	}
	await db.user.update({
		where: {
			id: user.id
		},
		data: {
			points: {
				decrement: amount
			}
		}
	})
	revalidatePath("/")
}
