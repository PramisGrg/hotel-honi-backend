import type { Request } from 'express'

export interface SecureRequestUserData {
  id: string
  name: string;
  dialCode: string;
  activeHotel?: string;
  roleName?: string;
  roleId?: string;
  permissions?: string[]
}

export interface RecentDeviceInfo {
  deviceName?: string;
  loginToken?: string;
  oneSignalId?: string;
}

export interface SecureRequest extends Request {
  imageUrl?: string[]
  currentUser?: SecureRequestUserData
}

export interface LoginRequest extends Request {
  deviceInfo?: RecentDeviceInfo
  currentUser?: SecureRequestUserData
}
