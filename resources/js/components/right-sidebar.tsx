export default function RightSidebar({ ads }) {
  return (
    <>
      {ads.map(ad => (
        <a key={ad.id} href={ad.link_url ?? '#'} target="_blank">
          <img
            src={ad.image_url}
            alt={ad.title ?? 'advertisement'}
            className="w-auto my-3 rounded-md"
          />
        </a>
      ))}
    </>
  )
}
