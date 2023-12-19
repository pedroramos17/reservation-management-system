// import axios from 'axios';
// import authHeader from './authHeader';
// import { GatewayApiResponse } from '../../interfaces/gateway.interface';
// import API_HOST from '../../config/api';

// const GATEWAY_ROUTE = `${API_HOST}/gateway/`;

// const getGateways = async () => {
//   return axios.get(GATEWAY_ROUTE, { headers: authHeader() });
// };

// const findGateway = async (id: string) => {
//   return axios.get(`${GATEWAY_ROUTE}${id}`, { headers: authHeader() });
// };

// const postGateway = async (gateway: GatewayApiResponse) => {
//   return axios.post(GATEWAY_ROUTE, gateway, { headers: authHeader() });
// };

// const putGateway = async (id: string, gateway: GatewayApiResponse) => {
//   return axios.put(`${GATEWAY_ROUTE}${id}`, gateway, { headers: authHeader() });
// };

// const deleteGateway = async (id: string) => {
//   return axios.delete(`${GATEWAY_ROUTE}${id}`, { headers: authHeader() });
// };

// export { getGateways, findGateway, postGateway, putGateway, deleteGateway };
