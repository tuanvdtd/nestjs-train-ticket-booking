import { SetMetadata } from "@nestjs/common";
export const REQUIRED_PERMISSIONs_KEY = 'requiredPermissions';

export const RequiredPermissions = ( ...required: string[]) => {
  return SetMetadata(REQUIRED_PERMISSIONs_KEY, required);
}