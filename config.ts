import * as dotenv from "dotenv";

dotenv.config();

//hosts: https://developers.tron.network/reference/background 
//nile usdt contract: TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj
//main net usdt contract: TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t

export const TRON_ADDRESS = process.env.TRON_ADDRESS;
export const TRON_PRIVATE_KEY = process.env.TRON_PRIVATE_KEY;
export const TRON_API_KEY = process.env.TRON_API_KEY;
export const USER_ADDRESS = process.env.USER_ADDRESS;
export const USER_PRIVATE_KEY = process.env.USER_PRIVATE_KEY;
export const DEFAULT_FULL_HOST = process.env.DEFAULT_FULL_HOST;
export const DEFAULT_USDT_CONTRACT = process.env.DEFAULT_USDT_CONTRACT;
