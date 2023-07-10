import { useInfinityScroll, useLastNews } from "@src/hooks/"
import type { LegacyRef } from "react"
import { New } from "./New"

export const LastNews = () => {
    const { lastNews, increasePage, loading } = useLastNews()

    const { elementObservable } = useInfinityScroll(loading, increasePage)
    return (
        <>
            <span>Last news</span>
            <button onClick={increasePage}>increasePage</button>
            <ol className="flex flex-col gap-5">
                {lastNews.map((newID) => (<li key={newID}><New newId={newID} /></li>))}
                <li>
                    <div ref={elementObservable as LegacyRef<HTMLDivElement>}></div>
                </li>
            </ol>
        </>
    )
}