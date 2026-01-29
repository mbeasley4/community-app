import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'
import VideoGrid from '@/components/videos/video-grid'
import { Advertisement } from '@/types/advertisement'

type Props = {
  ads: Advertisement[]
}

export default function VideosPage({ads}: Props) {
  return (
    <CommunityLayoutNoRight ads={ads}>
      <VideoGrid />
    </CommunityLayoutNoRight>
  )
}
