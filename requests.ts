export interface ServiceRequest {
  id: string;
  title: string;
  description?: string;
  category?: string;
  reference_number?: string;
  status?: string;
  priority?: string;
  assigned_department?: string;
  created_date?: string;
  anonymous?: boolean;
  progress?: number;
  days_open?: number;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  head?: string;
}
