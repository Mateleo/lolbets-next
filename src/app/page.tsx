import { idsTracked } from "./lib/apiConnector"
import { db } from "./lib/prisma"

export default async function Home() {
	const data = await db.match.findMany({
		where: {
			league_id: {
				equals: idsTracked.leagues.get("MSI")
			}
		}
	})
	return (
		<main className="">
			{data.map((e) => (
				<div key={e.id}>
					{e.name}
				</div>
			))}
		</main>
	)
}
