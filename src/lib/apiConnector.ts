import type { ApiMatch } from "@/types/api"

const BASE_URL = "https://api.pandascore.co/lol"

export const idsTracked = {
	series: {
		"MSI 2024": 7448
		// "LEC SUMMER 2024": 
	},
	leagues: {
		MSI: 300,
		LEC: 4197,
		LFL: 4292
	}
} as const

function buildFilters(ids: typeof idsTracked) {
	let url = "?"
	Object.entries(ids.leagues).map((league) => {
		url += `filter[league_id]=${league[1]}&`
	})
	return `${url}per_page=100`
}

export async function fetchMatches(): Promise<ApiMatch[]> {
	const filters = buildFilters(idsTracked)
	const response = await fetch(`${BASE_URL}/matches${filters}`, {
		headers: {
			Authorization: process.env.PANDASCORE_API_KEY!,
			accept: "application/json"
		},
		cache: "no-cache"
	})
	return response.json()
}
