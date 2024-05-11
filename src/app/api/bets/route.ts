import { auth } from "@/auth"
import { distributeBets } from "@/lib/actions/bet"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

export async function GET() {
	const session = await auth()
	if (!session) {
		return NextResponse.json({ error: "Must be logged in" })
	}
	await distributeBets()
	redirect("/")
}
