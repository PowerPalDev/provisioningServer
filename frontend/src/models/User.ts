import { Device } from "./Device";

export interface User{
    created_at: string,
    devices: Device[],
    user_id: number,
    username: string
}