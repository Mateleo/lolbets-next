"use server"

import { db } from "../prisma"

export async function getUserRank(userId: string) {
	const users = await db.user.findMany({
		orderBy: {
			points: "desc"
		},
		select: {
			id: true
		}
	})
	const userIds = users.map((user) => user.id)
	return userIds.indexOf(userId) + 1
}
