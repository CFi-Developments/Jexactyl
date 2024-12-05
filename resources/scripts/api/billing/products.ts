import http, { FractalResponseData } from '@/api/http';

export interface Product {
    id: string;
    name: string;
    icon?: string;
    price: number;
    description?: string;
    eggId: number;
    limits: {
        cpu: number;
        memory: number;
        disk: number;
        backup: number;
        database: number;
        allocation: number;
    };
}

export const rawDataToProduct = ({ attributes: data }: FractalResponseData): Product => ({
    id: data.id,
    name: data.name,
    icon: data.icon,
    price: data.price,
    description: data.description,
    eggId: data.egg_id,
    limits: {
        cpu: data.limits.cpu,
        memory: data.limits.memory,
        disk: data.limits.disk,
        backup: data.limits.backup,
        database: data.limits.database,
        allocation: data.limits.allocation,
    },
});

export const getProducts = (id: number): Promise<Product[]> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/client/billing/categories/${id}`)
            .then(({ data }) => resolve((data.data || []).map((datum: any) => rawDataToProduct(datum))))
            .catch(reject);
    });
};

export const getProduct = (id: number): Promise<Product> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/client/billing/products/${id}`)
            .then(({ data }) => resolve(rawDataToProduct(data)))
            .catch(reject);
    });
};
