import Fit30DayCounter from "./fit30-day-counter";
import ProfileSidebar from "./profile-sidebar";

export default function LeftSidebar() {
    return (
        <>
            {/* Left Sidebar (1/4) */}
            <aside className="col-span-12 md:col-span-3">
                <div className="rounded-xl border bg-white mb-2 p-4">
                    <Fit30DayCounter startDate="2026-01-05" />
                </div>
                <div className="rounded-xl border bg-white mb-2 p-4">
                    Courses
                    <p><a href="/courses">Go to courses</a></p>
                </div>
                <div className="rounded-xl border bg-white mb-2 p-4">
                    <ProfileSidebar />
                </div>
            </aside>
        </>
    );
}