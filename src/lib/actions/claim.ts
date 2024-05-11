"use server"

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { getSecondsSinceLastClaim } from "../claim"
import { db } from "../prisma"

const SECONDS_IN_HOUR = 3600
const MINUTES_IN_DAY = 60 * 24
const SECONDS_IN_DAY = 60 * 60 * 24

export async function isClaimAvailable() {
	const session = await auth()
	if (!session) return { available: true, secondsUntilClaim: 0 }

	const user = await db.user.findFirst({
		where: {
			id: {
				equals: session.user?.id
			}
		},
		include: {
			claims: {
				orderBy: {
					date: "desc"
				},
				take: 1
			}
		}
	})
	if (!user) return { available: true, secondsUntilClaim: 0 }

	if (user.claims.length === 0) return { available: true, secondsUntilClaim: 0 }

	const lastClaim = user.claims.at(0)
	const seconds = getSecondsSinceLastClaim(lastClaim?.date!)

	if (seconds < SECONDS_IN_DAY) {
		return { available: false, secondsUntilClaim: SECONDS_IN_DAY - seconds }
	}
	return { available: true, secondsUntilClaim: 0 }
}

export async function claim() {
	const session = await auth()
	if (!session) return { error: "not logged in" }

	const user = await db.user.findFirst({
		where: {
			id: {
				equals: session.user?.id
			}
		},
		include: {
			claims: {
				orderBy: {
					date: "desc"
				},
				take: 1
			}
		}
	})
	if (!user) return { error: "user not found" }
	const { available, secondsUntilClaim } = await isClaimAvailable()

	if (!available) {
		return { error: `Too soon, ${MINUTES_IN_DAY - Math.floor(secondsUntilClaim / 60)} minutes remaining` }
	}

	const amount: number = Math.floor(Math.random() * 10) ** 3

	await db.claim.create({
		data: {
			amount: amount,
			userId: user.id
		}
	})

	await db.user.update({
		where: {
			id: user.id
		},
		data: {
			points: {
				increment: amount
			}
		}
	})

	revalidatePath("/")
	return amount
}
