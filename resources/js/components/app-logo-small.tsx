import AppLogoSquare from './app-logo-square';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-12 items-center justify-center rounded-md">
                <AppLogoSquare className="size-12" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Fit30 Community
                </span>
            </div>
        </>
    );
}
 