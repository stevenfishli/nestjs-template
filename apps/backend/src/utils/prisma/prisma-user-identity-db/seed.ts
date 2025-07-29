import 'dotenv/config';
import {
  PrismaClient,
  UserDevice,
  UserStatus,
  UserType,
} from '../generated/user-identity-db-client-types';

const prisma = new PrismaClient();

const tenantIds = {
  demo: '7e3bb2d8-d877-456e-a74e-260ca38823a3',
};

async function main() {
  await prisma.user.createMany({
    data: [
      {
        id: '233917ce-2335-452d-bd1c-283f1547211a',
        tenantId: tenantIds.demo,
        type: UserType.BO_ADMIN,
        status: UserStatus.ACTIVE,
        email: '',
        phonePrefix: '',
        phone: '',
        deviceSrc: UserDevice.WINDOWS,
        username: 'alice',
        createdOn: new Date('2024-01-01T10:00:00Z'),
        createdBy: null,
        updatedOn: new Date('2024-01-01T10:00:00Z'),
        updatedBy: null,
      },
      {
        id: 'cd95288a-29d8-4d52-ba6d-3c97a3f0269b',
        tenantId: tenantIds.demo,
        type: UserType.BO_ADMIN,
        status: UserStatus.ACTIVE,
        email: '',
        phonePrefix: '',
        phone: '',
        deviceSrc: UserDevice.WINDOWS,
        username: 'bob',
        createdOn: new Date('2024-01-02T11:00:00Z'),
        createdBy: null,
        updatedOn: new Date('2024-01-02T11:00:00Z'),
        updatedBy: null,
      },
      {
        id: '7b047c7a-3e0d-41e6-bedf-d55554bd5393',
        tenantId: tenantIds.demo,
        type: UserType.BO_ADMIN,
        status: UserStatus.ACTIVE,
        email: '',
        phonePrefix: '',
        phone: '',
        deviceSrc: UserDevice.WINDOWS,
        username: 'carol',
        createdOn: new Date('2024-01-03T12:00:00Z'),
        createdBy: null,
        updatedOn: new Date('2024-01-03T12:00:00Z'),
        updatedBy: null,
      },
      {
        id: 'a4d3ef62-0c46-4924-b4a2-1053ba7cb2a2',
        tenantId: tenantIds.demo,
        type: UserType.BO_ADMIN,
        status: UserStatus.ACTIVE,
        email: '',
        phonePrefix: '',
        phone: '',
        deviceSrc: UserDevice.WINDOWS,
        username: 'dave',
        createdOn: new Date('2024-01-04T13:00:00Z'),
        createdBy: null,
        updatedOn: new Date('2024-01-04T13:00:00Z'),
        updatedBy: null,
      },
      {
        id: 'c13f391d-fe06-41fa-b808-9cb2d6fad410',
        tenantId: tenantIds.demo,
        type: UserType.BO_ADMIN,
        status: UserStatus.ACTIVE,
        email: '',
        phonePrefix: '',
        phone: '',
        deviceSrc: UserDevice.WINDOWS,
        username: 'eve',
        createdOn: new Date('2024-01-05T14:00:00Z'),
        createdBy: null,
        updatedOn: new Date('2024-01-05T14:00:00Z'),
        updatedBy: null,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
