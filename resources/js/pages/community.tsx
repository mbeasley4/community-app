import CommunityLayout from '@/layouts/community-layout';
import PostFeed from '../components/post-feed'; 

export default function Community() {
    return (
        <CommunityLayout>
             <PostFeed/>
        </CommunityLayout>
    );
}
