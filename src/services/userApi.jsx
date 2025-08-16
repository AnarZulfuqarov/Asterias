import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import Cookies from "js-cookie";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://asterias-back-production.up.railway.app/api',
        prepareHeaders: (headers) => {
            const token = Cookies.get('asteriasToken');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        postAdminLogin: builder.mutation({
            query: (admin) => ({
                url: `/Admins/login`,
                method: 'POST',
                body: admin,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        postContact: builder.mutation({
            query: (contact) => ({
                url: `/Contacts`,
                method: 'POST',
                body: contact,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        getAllContact: builder.query({
            query: () => ({
                url: `/Contacts`,
            }),
        }),
        getAllOffers: builder.query({
            query: () => ({
                url: `/Offers`,
            }),
        }),
        postOffers: builder.mutation({
            query: (project) => ({
                url: `/Offers`,
                method: 'POST',
                body: project
            }),
        }),
        deleteOffers: builder.mutation({
            query: (id) => ({
                url: `/Offers/?id=${id}`,
                method: 'DELETE',
            }),
        }),
        putOffers: builder.mutation({
            query: (project) => ({
                url: `/Offers`,
                method: 'PUT',
                body: project,
            }),
        }),
        getOffersById: builder.query({
            query: (id) => ({
                url: `/Offers/${id}`,
            }),
        }),
    }),
})
export const {
    useGetAllContactQuery,
    usePostContactMutation,
    usePostAdminLoginMutation,

    useGetAllOffersQuery,
    usePostOffersMutation,
    useDeleteOffersMutation,
    usePutOffersMutation,
    useGetOffersByIdQuery,

} = userApi