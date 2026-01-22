import AdForm from "./ad-form"
import CommunityLayoutNoRight from "@/layouts/community-layout-no-right"

export default function Create() {
  return (
    <CommunityLayoutNoRight>
      <div className="p-6">
        <h1 className="text-xl mb-4">Create Advertisement</h1>
        <AdForm /> 
      </div>
    </CommunityLayoutNoRight>
  )
}
