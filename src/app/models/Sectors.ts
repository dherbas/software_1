export interface sector {
  id: string;
  name: string;
  price: string;
  quantity: number;
  max_selected: number;
  external_sector_id: string;
  position: number;
  with_seats: boolean;
  enable: boolean;
  code: string;
  service_function_id: string;
  visible_in_portal: boolean;
  sector_duration: SectorDuration;
}

export interface SectorDuration {
  id: number;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  sector_id: string;
  initial_day: number;
  final_day: number;
}
