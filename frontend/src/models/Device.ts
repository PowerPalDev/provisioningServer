// TypeScript Interface
export interface Device {
    id: number;
    name: string;
    devicePassword: string;
    type: string;
    user_id: number;
    serial_number: string;
    status: number;
    firmware_version: string;
    registration_date: string;
    last_seen: string;
    ip_address: string;
    mac_address: string;
    prov_key: number;
    config: object;
    isonline: boolean;
    encryption_key: string;
    auth_token: string;
    notes: string;
    created_at: string;
}

export class DeviceClass implements Device {
    id: number;
    name: string;
    devicePassword: string = "default";
    type: string = "default";
    user_id: number;
    serial_number: string = "default";
    status: number = 0;
    firmware_version: string = "default";
    registration_date: string = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    last_seen: string = new Date().toLocaleTimeString("en-US", { hour12: false }); // HH:mm:ss
    ip_address: string = "0.0.0.0";
    mac_address: string;
    prov_key: number = 0;
    config: object = {};
    isonline: boolean = true;
    encryption_key: string = "default";
    auth_token: string = "default";
    notes: string = "default";
    created_at: string = new Date().toISOString(); // ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)

    constructor(
        id: number,
        mac_address: string,
        name: string,
        user_id: number
    ) {
        this.id = id;
        this.mac_address = mac_address;
        this.name = name;
        this.user_id = user_id;
    }
}
