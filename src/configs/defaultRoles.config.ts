function getPermissions(keyname: string) {
  switch (keyname) {
    case 'SUPERADMIN':
      return superadminPermissions;

    case 'ADMIN':
      return adminPermissions;

    default:
      return adminPermissions; //later will be replace by default role. i.e server
  }
}

const superadminPermissions = ['ALL']
const adminPermissions = ["ALL"] // for now else ex. ["order", "finance", "restaurant_setting"];

import { roleName } from "@prisma/client";

export const generateRole = () => {
  let roles = []
  for (let key in roleName) {
    if (!key) break;
    roles.push({
      name: key,
      permissions: getPermissions(key)
    })
  }
  return roles;
}

export const SuperAdminRole = {
  name: roleName.SUPERADMIN,
  permissions: [
    "ALL"
  ],
}

