import CommunityLayout from '@/layouts/community-layout';
import { Head } from '@inertiajs/react';
import EventListing from '../components/event-listing'; 
import { Advertisement } from '@/types/advertisement';

type Props = {
  ads: Advertisement[]
}

export default function Events({ads}:Props) {
    return (
        <CommunityLayout ads={ads}>
            <Head title="Events" />
            <EventListing/>
        </CommunityLayout>
    );
}