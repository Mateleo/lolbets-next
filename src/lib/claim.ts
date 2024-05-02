import dayjs from "dayjs"
import "dayjs/locale/fr"

dayjs.locale("fr")

export function getSecondsSinceLastClaim(lastClaimDate: Date) {
	const lastDate = dayjs(lastClaimDate)
	const diff = lastDate.diff(dayjs(), "seconds")
	return Math.abs(diff)
}
