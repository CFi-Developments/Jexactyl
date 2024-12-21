import http, { FractalResponseData } from '@/api/http';

export interface ServerGroup {
    id: number;
    name: string;
    color?: string;
}

export interface Values {
    name: string;
    color?: string;
}

export const rawDataToServerGroup = ({ attributes: data }: FractalResponseData): ServerGroup => ({
    id: data.id,
    name: data.name,
    color: data.color,
});

export const getServerGroups = (): Promise<ServerGroup[]> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/client/groups`)
            .then(({ data }) => resolve((data.data || []).map((datum: any) => rawDataToServerGroup(datum))))
            .catch(reject);
    });
};

export const createServerGroup = (values: Values): Promise<ServerGroup> => {
    return new Promise((resolve, reject) => {
        http.post('/api/client/groups', values)
            .then(({ data }) => resolve(rawDataToServerGroup(data)))
            .catch(reject);
    });
};

export const addServerToGroup = (id: number, server: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.post(`/api/client/groups/${id}/add`, { server })
            .then(() => resolve())
            .catch(reject);
    });
};

export const removeServerFromGroup = (id: number, server: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.post(`/api/client/groups/${id}/remove`, { server })
            .then(() => resolve())
            .catch(reject);
    });
};

export const updateServerGroup = (id: number, values: Values): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.patch(`/api/client/groups/${id}`, values)
            .then(() => resolve())
            .catch(reject);
    });
};

export const deleteServerGroup = (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.delete(`/api/client/groups/${id}`)
            .then(() => resolve())
            .catch(reject);
    });
};
