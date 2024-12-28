import { ModelWithRelationships, Model, UUID } from '@/api/definitions';
import { Server } from '@/api/admin/server';

interface User extends ModelWithRelationships {
    id: number;
    uuid: UUID;
    externalId: string;
    username: string;
    email: string;
    language: string;
    adminRoleId: number | null;
    roleName: string;
    isRootAdmin: boolean;
    isUsingTwoFactor: boolean;
    avatarUrl: string;
    state: string;
    createdAt: Date;
    updatedAt: Date;
    relationships: {
        role: UserRole | null;
        // TODO: just use an API call, this is probably a bad idea for performance.
        servers?: Server[];
    };
}

interface UserRole extends ModelWithRelationships {
    id: number;
    name: string;
    description: string;
}

interface ApiKeyPermission extends Model {
    r_allocations: string;
    r_database_hosts: string;
    r_eggs: string;
    r_locations: string;
    r_nests: string;
    r_nodes: string;
    r_server_databases: string;
    r_servers: string;
    r_users: string;
}

interface ApiKey extends Model {
    id?: number;
    identifier: string;
    description: string;
    allowedIps: string[];
    createdAt: Date | null;
    lastUsedAt: Date | null;
}
