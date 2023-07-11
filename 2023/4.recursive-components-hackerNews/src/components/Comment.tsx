import { IconCircleUser, Skeleton } from "@src/components/"
import { useItem } from "@src/hooks"

interface props {
    idComment: number
}
export const Comment: React.FC<props> = ({ idComment }) => {

    const { data: { by, id, kids, parent, text, time, type }, showComments, toggleComments, loading } = useItem(idComment)

    if (loading) {
        return <Skeleton />
    }
    return (
        <div className="m-5">
            <header
                className="flex items-center gap-2 border-b-textColor border-b"
            >
                <IconCircleUser />
                <span>{by}</span>
            </header>
            <main className="text-xs max-h-16 overflow-auto">
                <p>{text}</p>
            </main>
            <footer className="text-xs flex justify-between bg-backgroundmain p-2">
                {kids != null && kids.length !== 0 && <button onClick={toggleComments}>{showComments ? 'Hide' : 'Show'} comments ({kids.length})</button>}
                <span className="text-xs">{time}</span>
            </footer>
            <ol>
                {showComments && kids?.map((kidID: number) => {
                    console.log(kidID)
                    return (<li key={kidID}><Comment idComment={kidID} /></li>)
                })}
            </ol>
        </div>
    )
}