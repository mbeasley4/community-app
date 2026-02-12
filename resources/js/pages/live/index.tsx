import CommunityLayout from '@/layouts/community-layout';
import { Head } from '@inertiajs/react';
import { Advertisement } from '@/types/advertisement';
import LiveStreamApp from '@/components/livestream/live-stream-app'; 
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right';

type Props = {
  ads: Advertisement[]
}

export default function EventsPage({ads}:Props) {
    return (
        <CommunityLayoutNoRight ads={ads}>
            <Head title="Events" />
            <LiveStreamApp />
        </CommunityLayoutNoRight>
    );
}