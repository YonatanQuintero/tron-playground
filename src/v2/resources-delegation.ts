/**
 * This script performs the resources delegation process by sending USDT and TRX to a main wallet.
 *
 * @author Yonatan A Quintero R
 */

import { TronWeb } from "tronweb";
import { DEFAULT_USDT_CONTRACT, TRON_ADDRESS, USER_ADDRESS, USER_PRIVATE_KEY } from "../../config";
import { TheterService } from "../services/theter.service";
import { TronWebService } from "../services/tron-web.service";
import { TronService } from "../services/tron.service";

/**
 * Performs the resources delegation process.
 *
 * @remarks
 * This function retrieves necessary configuration settings, creates TronWeb instances,
 * and initiates the delegation process by sending TRX to user wallet and send USDT to the main wallet.
 */
export const resourcesDelegation = async (): Promise<void> => {

    const {
        mainAddress,
        usdtContract,
        userAddress,
        userPrivateKey
    } = validateAndRetrieveConfig();

    const mainTronWeb = await TronWebService.create();
    await TronWebService.checkConnection(mainTronWeb);

    const userTronWeb = await TronWebService.create(userPrivateKey);
    await TronWebService.checkConnection(userTronWeb);

    const userTronService = new TronService(userTronWeb);
    const userTheterService = new TheterService(userTronService, usdtContract);
    const amountInSun = await userTheterService.getBalanceInSun(userAddress);
    const resources = await userTheterService.getTransferResources(mainAddress, amountInSun);
    await sendTrxToBurn(
        resources.trxToBurn, userAddress, mainTronWeb, userTronService
    );
    await sendUsdtToMainWallet(
        userAddress, mainAddress, amountInSun, userTheterService, userTronService
    );
};

/**
 * Sends USDT to the main wallet.
 *
 * @param userAddress - The address of the user sending USDT.
 * @param mainAddress - The address of the main wallet receiving USDT.
 * @param amountInSun - The amount of USDT to send, in sun (Tron's smallest unit).
 * @param theterService - The service for interacting with the USDT contract.
 * @param tronService - The service for interacting with the Tron network.
 */
async function sendUsdtToMainWallet(
    userAddress: string,
    mainAddress: string,
    amountInSun: number,
    theterService: TheterService,
    tronService: TronService
): Promise<void> {
    console.log(`Sending USDT from ${userAddress} to ${mainAddress}...`);
    const broadcastedTx = await theterService.transfer(mainAddress, amountInSun);

    if (!broadcastedTx.result) {
        console.error(broadcastedTx);
        throw new Error("Failed transaction to send usdt");
    }

    const txInfo = await tronService.getTransactionInfo(broadcastedTx.transaction.txID);
    console.log(txInfo);
    console.log("Status:", txInfo?.receipt.result);
}

/**
 * Sends TRX to the user's address.
 *
 * @param amountInTrx - The amount of TRX to send, in TRX.
 * @param userAddress - The address of the user receiving TRX.
 * @param tronWeb - The TronWeb instance for interacting with the Tron network.
 * @param tronService - The service for interacting with the Tron network.
 */
async function sendTrxToBurn(
    amountInTrx: number,
    userAddress: string,
    tronWeb: TronWeb,
    tronService: TronService
): Promise<void> {
    if (amountInTrx > 0) {
        console.log(`Sending ${amountInTrx} TRX to ${userAddress}...`);
        const broadcastedTx = await tronWeb.trx.sendTrx(
            userAddress, Number(tronWeb.toSun(amountInTrx))
        );
        if (!broadcastedTx.result) {
            console.error(broadcastedTx);
            throw new Error("Failed transaction to send trx");
        }
        const txInfo = await tronService.getTransactionInfo(
            broadcastedTx.transaction.txID
        );
        console.log(txInfo);
    }
}

/**
 * Custom type representing the necessary configuration settings for the resources delegation process.
 */
type ResourcesDelegationConfig = {
    mainAddress: string;
    usdtContract: string;
    userAddress: string;
    userPrivateKey: string;
};

/**
 * Validates and retrieves necessary configuration settings for the resources delegation process.
 *
 * @returns An object of type `ResourcesDelegationConfig` containing the validated configuration settings.
 *
 * @throws An error if any of the required configuration settings are missing.
 */
const validateAndRetrieveConfig = (): ResourcesDelegationConfig => {
    const mainAddress = TRON_ADDRESS;
    if (!mainAddress) {
        throw new Error("Missing main wallet address");
    }

    const usdtContract = DEFAULT_USDT_CONTRACT;
    if (!usdtContract) {
        throw new Error("Missing usdt contract");
    }

    const userAddress = USER_ADDRESS;
    if (!userAddress) {
        throw new Error("Missing user address");
    }

    const userPrivateKey = USER_PRIVATE_KEY;
    if (!userPrivateKey) {
        throw new Error("Missing user private key");
    }

    return { mainAddress, usdtContract, userAddress, userPrivateKey };
};