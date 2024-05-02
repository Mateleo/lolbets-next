"use client"

import { bet } from "@/lib/actions/bet"
import { Button } from "./ui/button"
import type { Bet } from "@prisma/client"
import { Input } from "./ui/input"
import { useState } from "react"
import { Coins } from "lucide-react"
import { toast } from "sonner"

interface BetInputProps {
	matchId: number
	teamId: number
	teamName: string
	teamBets: Bet[]
	percentage: number
	displayInput: boolean
	teamUserBets: Bet | undefined
}

export function BetSection({
	matchId,
	teamId,
	teamName,
	teamBets,
	percentage,
	displayInput,
	teamUserBets
}: BetInputProps) {
	const [amount, setAmount] = useState<string>("")

	const hasUserBettedOnThisTeam = teamUserBets?.teamId === teamId

	return (
		<div className="flex gap-4 items-center">
			{displayInput && (
				<div className="flex items-center w-28">
					<Input
						placeholder={teamName}
						className={
							"border-custom-border-100 bg-transparent border-[3px] border-r-0 rounded-r-none h-min p-1 w-full focus-visible:ring-0 focus-visible:ring-offset-0"
						}
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
					/>
					<Button
						className={
							"bg-transparent border-custom-border-100 hover:bg-transparent/20 h-min p-1 text-custom-text-100 rounded-l-none border-[3px]"
						}
						onClick={async () => {
							const response = await bet({
								amount: parseInt(amount),
								matchId,
								teamId
							})
							if (response?.error) {
								toast.error(response.error)
							} else {
								toast.success( `You betted ${amount} on ${teamName} 🪙`)
							}
						}}
					>
						Bet
					</Button>
				</div>
			)}
			<div
				className={`w-24 flex flex-col font-semibold ${
					hasUserBettedOnThisTeam ? " text-custom-green-100" : "text-custom-button-100"
				}`}
			>
				<div className="flex gap-1 p-1">
					<Coins />
					<p>{teamBets.reduce((sum, bet) => sum + bet.amount, 0) as number}</p>
				</div>
				<div
					className={`h-1  rounded-full ${hasUserBettedOnThisTeam ? "bg-custom-green-100" : "bg-custom-button-100"}`}
					style={{
						width: `${96 * percentage}px`
					}}
				/>
			</div>
		</div>
	)
}
