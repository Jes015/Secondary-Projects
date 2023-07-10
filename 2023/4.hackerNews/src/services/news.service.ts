const domain = 'https://hacker-news.firebaseio.com/v0/'
let pathname = ''

const getLastNews = async (page: number, limit: number) => {
    pathname = 'topstories.json'
    const response = await fetch(domain + pathname)
    const toObj = await response.json()

    const offset = page * limit
    limit = offset + limit

    const data = toObj.slice(offset, limit)

    return data
}

const getItem = async (id: number) => {
    pathname = `item/${id}.json`
    const response = await fetch(domain + pathname)
    const toObj = await response.json()

    const data = toObj

    return data
}

export { getItem, getLastNews }

