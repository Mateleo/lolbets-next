"use client"

import { Input } from "@/components/ui/input"
import { useState } from "react"

interface Props {
	users?: { img: string; name: string }[]
}

export function PlayerSearch({ users = [] }: Props) {
	const [searchInput, setSearchInput] = useState<string>("")
	const [results, setResults] = useState<{ img: string; name: string }[]>(users)

	return (
		<div className="bg-custom-background-200 border-[3px] border-custom-border-100 rounded-lg flex flex-col">
			<Input
				className="bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
				value={searchInput}
				onChange={(e) => setSearchInput(e.target.value)}
				placeholder="Search player..."
			/>
			{results.length !== 0 && results.map((result, index) => <li key={`${result.name}${index}`}>{result.name}</li>)}
		</div>
	)
}
