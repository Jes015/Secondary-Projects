import { Comment, Skeleton } from "@src/components/"
import { useItem } from "@src/hooks/"

interface Props {
    newId: number
}

export const New: React.FC<Props> = ({ newId }) => {
    const { data: { id, title, time, kids, url }, showComments, toggleComments, loading } = useItem(newId)

    if (loading) {
        return <Skeleton />
    }
    return (
        <div className="rounded-md overflow-hidden">
            <header
                className="flex justify-between items-center bg-backgroundmain p-2 border-b-textColor border-b"
            >
                <span><a target="_blank" href={`${url}`}>{title}</a></span>
                <span className="text-xs">{time}</span>
            </header>
            <footer
                className="text-xs flex justify-between bg-backgroundmain p-2"
            >
                {kids != null && kids.length !== 0 && <button onClick={toggleComments}>{showComments ? 'Hide' : 'Show'} comments ({kids?.length})</button>}
                <a href={url}>See new</a>
            </footer>
            <div>
                <ol>
                    {showComments && kids?.slice(0, 10).map((kidID: number) => (<li key={kidID}><Comment idComment={kidID} /></li>))}
                </ol>
            </div>
        </div>
    )
}