import {
  UserDevice,
  UserType,
} from '../../../utils/prisma/generated/user-identity-db-client-types';

export type CreateUserArg = {
  tenantId: string;
  email?: string;
  emailConfirmed?: boolean;
  username: string;
  type: UserType;
  agentId?: string;
  srcFrom?: string;
  deviceSrc?: UserDevice;
  ipFrom?: string;
  phonePrefix?: string;
  phone?: string;
  phoneConfirmed?: boolean;
  dob?: Date;
  latestLoginOn?: Date;
};
