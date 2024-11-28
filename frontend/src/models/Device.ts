export interface Device {
    id: number;
    mac_address: string;
    name: string;
    created_at: string;
    notes: string;
    user_name: string;
  }
  

  export class DeviceClass implements Device {
    id: number = 0;
    mac_address: string;
    name: string;
    created_at: string;
    notes: string;
    user_name: string;
  
    constructor(deviceMac: string, deviceName: string, notes: string, username: string) {
      this.mac_address = deviceMac.trim(); // Rimuove spazi indesiderati
      this.name = deviceName;
      this.created_at = new Date().toISOString().split("T")[0];
      this.notes = notes;
      this.user_name = username;
    }
  
    getCreatedAtAsDate(): Date {
      return new Date(this.created_at);
    }
  
    toString(): string {
      return `Device ${this.id}: ${this.name} (${this.mac_address}) "${this.notes}" Owned by ${this.user_name}`;
    }
  }
  
