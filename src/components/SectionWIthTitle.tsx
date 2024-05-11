import { cn } from "@/lib/utils"
import type { PropsWithClass } from "@/types/common"
import type { PropsWithChildren, ReactNode } from "react"

interface Props {
	title: ReactNode
}

export function SectionWithTitle({ children, className, title }: PropsWithClass<PropsWithChildren<Props>>) {
	return (
		<section className={cn("flex flex-col", className)}>
			<h3 className="text-custom-text-100 font-semibold text-lg pb-2">{title}</h3>
			{children}
		</section>
	)
}
