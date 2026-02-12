// Application-specific types (keep these if you want)
export interface ZegoTokenResponse {
    token: string;
    app_id: number;
    user_id: string;
}

export interface ZegoRoomData {
    room_id: string;
    room_name: string;
    created_by: string;
    created_at?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
