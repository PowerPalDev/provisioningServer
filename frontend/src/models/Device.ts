export interface Device {
    name: string;
    type: string;
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
    name: string;
    type: string = "default";
    serial_number: string;
    status: number = 0;
    firmware_version: string = "default";
    registration_date: string = new Date().toISOString().split('T')[0];
    last_seen: string = new Date().toISOString();
    ip_address: string = "default";
    mac_address: string;
    prov_key: number = 0;
    config: object = {};
    isonline: boolean = true;
    encryption_key: string = "default";
    auth_token: string = "default";
    notes: string = "";
    created_at: string = new Date().toISOString();

    constructor(mac_address: string, name: string, serial_number: string) {
        this.mac_address = mac_address;
        this.name = name;
        this.serial_number = serial_number;
    }
}
