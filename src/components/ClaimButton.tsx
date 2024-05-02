"use client"

import { claim } from "@/lib/actions/claim"
import { Button } from "./ui/button"
import { toast } from "sonner"

export function ClaimButton() {
	return (
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
	)
}
