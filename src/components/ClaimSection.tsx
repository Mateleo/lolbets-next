"use client"

import { claim } from "@/lib/actions/claim"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import dayjs from "dayjs"

type Props = {
	available: boolean
	secondsUntilClaim?: number
}

export function ClaimSection({ available, secondsUntilClaim }: Props) {
	const [displayTime, setDisplayTime] = useState(new Date(secondsUntilClaim! * 1000))

	useEffect(() => {
		setInterval(() => {
			setDisplayTime(dayjs(displayTime).add(-1, "second").toDate())
		}, 1000)
	}, [displayTime])

	return (
		<>
			{available ? (
				<Button
					className="bg-custom-button-100 text-custom-text-100 hover:bg-custom-button-100/80"
					onClick={async () => {
						const response = await claim()
						if (typeof response === "number") {
							toast.success(`You claimed ${response} points !`)
						} else {
							toast.error(response.error)
						}
					}}
				>
					Claim
				</Button>
			) : (
				<div>{displayTime.toISOString().slice(11, 19)} until next claim</div>
			)}
		</>
	)
}
