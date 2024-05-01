export interface ApiMatch {
	begin_at: string
	draw: boolean
	end_at: string | null
	forfeit: boolean
	game_advantage: null
	games: ApiGame[]
	id: number
	league: ApiLeague
	league_id: number
	match_type: string
	modified_at: string | null
	name: string
	number_of_games: number
	opponents: ApiOpponent[]
	original_scheduled_at: string
	rescheduled: boolean
	results: {
		score: number
		team_id: number
	}[]
	scheduled_at: string
	slug: string
	status: MatchStatus
	streams_list: {
		embeded_url: string
		language: string
		main: boolean
		official: boolean
		raw_url: string
	}[]
	winner: ApiTeam
	winner_id: number
	winner_type: string
}

export interface ApiOpponent {
	opponent: ApiTeam
	type: string
}

export interface ApiGame {
	begin_at: string | null
	complete: boolean
	end_at: string | null
	finished: boolean
	forfeit: boolean
	id: number
	length: number | null
	match_id: number
	position: number
	status: MatchStatus
	winner: {
		id: number | null
		type: string
	}
	winner_type: string
}

export interface ApiLeague {
	id: number
	image_url: string | null
	modified_at: string
	name: string
	slug: string
	url: string
}

interface ApiTeam {
	acronym: string | null
	id: number
	image_url: string
	location: string | null
	modified_at: string
	name: string
	slug: string
}

export type MatchStatus = "not_started" | "running" | "finished" | "canceled"
