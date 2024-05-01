import type { ApiMatch } from "../types/api"

const BASE_URL = "https://api.pandascore.co/lol"

export const idsTracked = {
	series: new Map([["MSI 2024", 7448]]),
	leagues: new Map([["MSI", 300]])
} as const

function buildFilters(ids: typeof idsTracked) {
	let url = "?"
	ids.series.forEach((id) => {
		url += `filter[serie_id]=${id}&`
	})
	return `${url}per_page=100`
}

export async function fetchMatches(): Promise<ApiMatch[]> {
	const filters = buildFilters(idsTracked)
	const response = await fetch(`${BASE_URL}/matches${filters}`, {
		headers: {
			Authorization: process.env.PANDASCORE_API_KEY!,
			accept: "application/json"
		}
	})
	return response.json()
}
