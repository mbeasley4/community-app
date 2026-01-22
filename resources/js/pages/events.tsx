import CommunityLayout from '@/layouts/community-layout';
import { Head } from '@inertiajs/react';
import EventListing from '../components/event-listing'; 


export default function Events() {
    return (
        <CommunityLayout>
            <Head title="Events" />
            <EventListing/>
        </CommunityLayout>
    );
}