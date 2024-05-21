"use client"

import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Props {
	users?: { image: string | null; name: string | null }[]
}

export function PlayerSearch({ users = [] }: Props) {
	const [searchInput, setSearchInput] = useState<string>("")
	const [results, setResults] = useState<{ image: string | null; name: string | null }[]>([])

	useEffect(() => {
		if (searchInput.length === 0) {
			setResults([])
			return
		}
		setResults(users.filter((user) => user.name?.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())))
	}, [searchInput, users])

	return (
		<div className="bg-custom-background-200 border-[3px] border-custom-border-100 rounded-lg flex flex-col">
			<Input
				className="bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 border-0"
				value={searchInput}
				onChange={(e) => setSearchInput(e.target.value)}
				placeholder="Search player..."
			/>
			{results.length !== 0 && (
				<ul className="flex flex-col shadow-xl">
					{results.map((result, index) => (
						<Link
							href={`/player/${result.name}`}
							key={`${result.name}${index}`}
							className="flex gap-2 p-2 items-center border-custom-border-100 border-b-[3px] last:border-b-0 last:rounded-b first:border-t-[3px] hover:bg-custom-button-100/20 transition-all odd:bg-custom-background-100"
						>
							<Image src={result.image!} width={24} height={24} alt={`${result.name} pp`} className="rounded-xl" />
							<p className="text-custom-text-200">{result.name}</p>
						</Link>
					))}
				</ul>
			)}
		</div>
	)
}
