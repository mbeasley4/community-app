import AdForm from "./ad-form"
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'

export default function Edit({ ad }) {
  return (
    <CommunityLayoutNoRight>
      <div className="p-6">
        <h1 className="text-xl mb-4">Edit Advertisement</h1>
        <AdForm ad={ad} />
      </div>
    </CommunityLayoutNoRight>
  )
}
