import { TronWeb } from "tronweb";
import { NILE_USDT_CONTRACT, TRON_ADDRESS, USER_ADDRESS, USER_PRIVATE_KEY } from "../../config";
import { TheterService } from "../services/theter.service";
import { TronWebService } from "../services/tron-web.service";

export const resourcesDelegation = async (): Promise<void> => {

    const mainAddress = TRON_ADDRESS;
    if (!mainAddress) {
        throw new Error("Missing main wallet address");
    }

    const usdtContract = NILE_USDT_CONTRACT;
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

    const mainTronWeb = await TronWebService.create();
    const userTronWeb = await TronWebService.create(userPrivateKey);
    const userTheterService = new TheterService(userTronWeb, usdtContract);
    const amountInSun = await userTheterService.getBalanceInSun(userAddress);
    const resources = await userTheterService.getTransferResources(mainAddress, amountInSun);
    await sendTrxToBurn(resources.trxToBurn, userAddress, mainTronWeb, mainAddress, userTheterService);
    await sendUsdtToMainWallet(userAddress, mainAddress, userTheterService, amountInSun);
}

async function sendUsdtToMainWallet(
    userAddress: string, mainAddress: string, theterService: TheterService, amountInSun: number
): Promise<void> {
    console.log(`Sending USDT from ${userAddress} to ${mainAddress}...`);
    const broadcastedTx = await theterService.transfer(mainAddress, amountInSun);

    if (!broadcastedTx.result) {
        console.error(broadcastedTx);
        throw new Error("Failed transaction to send usdt");
    }

    const txInfo = await theterService.getTransactionInfo(broadcastedTx.transaction.txID);
    console.log(txInfo);
    console.log("Status:", txInfo?.receipt.result);
}

async function sendTrxToBurn(
    amountInTrx: number, userAddress: string, tronWeb: TronWeb, mainAddress: string, theterService: TheterService
): Promise<void> {
    if (amountInTrx > 0) {
        console.log(`Sending ${amountInTrx} TRX to ${userAddress}...`);
        const broadcastedTx = await tronWeb.trx.sendTrx(mainAddress, amountInTrx);
        if (!broadcastedTx.result) {
            console.error(broadcastedTx);
            throw new Error("Failed transaction to send trx");
        }
        const txInfo = await theterService.getTransactionInfo(broadcastedTx.transaction.txID);
        console.log(txInfo);
    }
}
