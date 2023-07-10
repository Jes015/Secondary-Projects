import { getLastNews } from "@src/services"
import { useEffect, useRef, useState } from "react"

const togglePageNumber = 1

export const useLastNews = () => {

    const [lastNews, setLastNews] = useState<number[]>([])
    const [page, setPage] = useState(0)
    const limit = useRef(10)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const newsContext = async () => {
            const news = await getLastNews(page, limit.current)
            setLastNews([...lastNews, ...news])
            setLoading(false)
        }
        newsContext()
    }, [page])

    const increasePage = () => {
        setPage((actualPage) => actualPage + togglePageNumber)
    }

    return { lastNews, increasePage, loading }
}