import ContentLoader from 'react-content-loader'

export const Skeleton = () => (
    <ContentLoader
        speed={1}
        width={840}
        height={84}
        viewBox="0 0 840 84"
        backgroundColor="black"
        foregroundColor="#222"
    >

        <rect x="9" y="4" rx="0" ry="0" width="820" height="42" />
        <rect x="18" y="14" rx="0" ry="0" width="303" height="6" />
        <rect x="11" y="33" rx="0" ry="0" width="108" height="13" />
        <rect x="129" y="33" rx="0" ry="0" width="60" height="13" />
        <rect x="196" y="33" rx="0" ry="0" width="60" height="13" />
    </ContentLoader>
)

Skeleton.metadata = {
    name: 'Justin Irabor',
    github: 'vunderkind',
    description: 'A loading skeleton for your HackerNews clone.',
    filename: 'HackerNewsLoader',
}
