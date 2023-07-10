import type { IComment, INew } from "@src/models"
import { getItem } from "@src/services"
import { useEffect, useState } from "react"

export const useItem = (id: number) => {
    const [data, setData] = useState<INew | IComment>()
    const [showComments, setShowComments] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const newContext = async () => {
            const newData = await getItem(id)
            setData(newData)
            setLoading(false)
        }
        newContext()
    }, [])

    const toggleComments = () => {
        setShowComments(actualComment => !actualComment)
    }

    return { data: { ...data }, showComments, toggleComments, loading }
}