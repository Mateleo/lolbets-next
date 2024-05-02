"use server"

import { auth } from "@/auth"
import { db } from "../prisma"
import { revalidatePath } from "next/cache"
import { getSecondsSinceLastClaim } from "../claim"

const SECONDS_IN_HOUR = 3600
const MINUTES_IN_DAY = 60 * 24
const SECONDS_IN_DAY = 60 * 60 * 24

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
				}
			}
		}
	})
	if (!user) return { error: "user not found" }

	const amount: number = 100

	if (user.claims.length === 0) {
		await db.claim.create({
			data: {
				amount: amount,
				userId: user.id
			}
		})
		revalidatePath("/")
		return amount
	}

	const lastClaim = user.claims.at(0)
	const seconds = getSecondsSinceLastClaim(lastClaim?.date!)

	if (seconds < SECONDS_IN_DAY) {
		return { error: `Too soon, ${MINUTES_IN_DAY - Math.floor(seconds / 60)} minutes remaining` }
	}

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
