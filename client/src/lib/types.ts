export interface StudentData {
  id?: string;
  name: string;
  rollNumber: string;
  class: string;
  allergies: string[];
  photo: string;
  rackNumber: string;
  busRoute: string;
  createdAt?: string;
}

export interface StudentFormData {
  name: string;
  rollNumber: string;
  class: string;
  allergies: string[];
  photo: File | null;
  rackNumber: string;
  busRoute: string;
}
