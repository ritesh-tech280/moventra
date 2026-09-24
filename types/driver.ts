export type DriverAccountStatus = "pending" | "active" | "rejected" | "suspended";

export type DriverVerificationStatus =
  | "incomplete"
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "suspended";

export interface DriverVerification {
  profileCompleted: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
  licenseVerified: boolean;
  vehicleVerified: boolean;
  documentsVerified: boolean;
  status: DriverVerificationStatus;
}

export interface DriverAddress {
  line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface DriverProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profilePhotoKey?: string;
  address?: DriverAddress;
  status: DriverAccountStatus;
  availability?: "online" | "offline";
  role: "driver" | "admin";
  verification: DriverVerification;
  createdAt?: string;
  updatedAt?: string;
}

export type VehicleType = "Mini" | "Sedan" | "SUV" | "Auto" | "Electric";
export type VehicleVerificationStatus = "pending" | "approved" | "rejected";

export interface DriverVehicle {
  _id: string;
  vehicleType: VehicleType;
  brand: string;
  model: string;
  manufacturingYear: number;
  color: string;
  registrationNumber: string;
  seats: number;
  fuelType: string;
  verificationStatus: VehicleVerificationStatus;
}

export type DriverDocumentType =
  | "DRIVING_LICENSE"
  | "VEHICLE_RC"
  | "VEHICLE_INSURANCE"
  | "POLLUTION_CERTIFICATE";
export type DocumentVerificationStatus = "pending" | "approved" | "rejected";

export interface DriverDocumentSummary {
  _id: string;
  documentType: DriverDocumentType;
  verificationStatus: DocumentVerificationStatus;
  rejectionReason?: string | null;
  expiryDate?: string;
}

export interface DriverDashboardData {
  driver: DriverProfile;
  vehicle: DriverVehicle | null;
  documents: DriverDocumentSummary[];
}

export interface DriverApiResponse<T> {
  success: boolean;
  message?: string;
  token?: string;
  driver?: DriverProfile;
  vehicle?: DriverVehicle | null;
  documents?: DriverDocumentSummary[];
  availability?: "online" | "offline";
  data?: T;
}

export type DriverDashboardSection =
  | "dashboard"
  | "rides"
  | "earnings"
  | "profile"
  | "vehicle"
  | "verification"
  | "settings";

export interface DriverNavigationItem {
  id: DriverDashboardSection | "logout";
  label: string;
  mobileLabel?: string;
}

export interface DriverStat {
  label: string;
  value: string;
  detail: string;
  kind: "rides" | "earnings" | "rating" | "completed";
}

export type RideStatus = "completed" | "cancelled" | "upcoming";

export interface DriverRide {
  id: string;
  pickup: string;
  destination: string;
  fare: number;
  status: RideStatus;
  completedAt: string;
}

export interface DriverAvailabilityResponse {
  success: boolean;
  availability?: "online" | "offline";
  message?: string;
}
