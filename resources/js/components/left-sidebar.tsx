import Fit30DayCounter from "./day-counter";
import ProfileSidebar from "./profile-sidebar";
import AdminMenu from "./admin-menu"

type Props = {
  visiblePostsCount?: number
}

export default function LeftSidebar({ visiblePostsCount }: Props) {
    return (
        <>
            {/* Left Sidebar (1/4) */}
            <aside className="col-span-12 md:col-span-3">
                <div className="rounded-xl border bg-white mb-2 p-4">
                    <Fit30DayCounter startDate="2026-01-05" />
                </div>
                <div className="rounded-xl border bg-white mb-2 p-4">
                    <ProfileSidebar visiblePostsCount={visiblePostsCount} />
                </div>
                {/* Admin-only menu */}
                <AdminMenu />
                
            </aside>
        </>
    );
}