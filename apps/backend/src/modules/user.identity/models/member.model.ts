import { UserDevice } from '../../../utils/prisma/generated/user-identity-db-client-types';

export type CreateMemberArg = {
  tenantId: string;
  email?: string;
  emailConfirmed?: boolean;
  username: string;
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
