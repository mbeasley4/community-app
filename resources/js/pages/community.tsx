import CommunityLayout from '@/layouts/community-layout';
import PostFeed from '../components/post-feed'; 
import { Advertisement } from '../types/advertisement';

export default function Community({ads,}:{ads: Advertisement[] }) {
    return (
        <CommunityLayout ads={ads}>
             <PostFeed/>
        </CommunityLayout>
    );
}
