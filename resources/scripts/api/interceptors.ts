import type { AxiosError } from 'axios';
import type { NavigateFunction } from 'react-router-dom';
import { store } from '@/state';
import http from '@/api/http';

export const setupInterceptors = (navigate: NavigateFunction) => {
    http.interceptors.response.use(
        resp => resp,
        (error: AxiosError) => {
            if (error.response?.status === 400) {
                if (
                    (error.response?.data as Record<string, any>).errors?.[0].code === 'TwoFactorAuthRequiredException'
                ) {
                    if (!window.location.pathname.startsWith('/account')) {
                        navigate('/account', { state: { twoFactorRedirect: true } });
                    }
                }
            }
            throw error;
        },
    );

    http.interceptors.request.use(req => {
        if (!req.url?.endsWith('/resources')) {
            store.getActions().progress.startContinuous();
        }

        return req;
    });

    http.interceptors.response.use(
        resp => {
            if (!resp.request?.url?.endsWith('/resources')) {
                store.getActions().progress.setComplete();
            }

            return resp;
        },
        error => {
            store.getActions().progress.setComplete();

            throw error;
        },
    );
};
