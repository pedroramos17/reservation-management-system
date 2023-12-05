import { VehicleApiResponse } from './vehicle.interface';

export interface DriverData {
  id: string;
  name: string;
  rg: number;
  phone: number;
}

export interface DriverApiResponse extends DriverData {
  vehicle: VehicleApiResponse;
  created_at: string;
  updated_at: string;
}
