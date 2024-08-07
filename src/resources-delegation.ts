import { TransactionInfo } from "tronweb/lib/esm/types";
import { getTronWeb, NILE_USDT_CONTRACT, TRON_ADDRESS, USER_ADDRESS } from "../config";
import { TronWeb } from "tronweb";

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

    const userPrivateKey = process.env.USER_PRIVATE_KEY;
    if (!userPrivateKey) {
        throw new Error("Missing user private key");
    }

    const userTronWeb = getTronWeb(userPrivateKey);
    const functionSelector = "transfer(address,uint256)";
    const parameters = [
        {
            type: "address",
            value: mainAddress
        },
        {
            type: "uint256",
            value: userTronWeb.toSun(1.198805)
        }
    ];

    const tx = await userTronWeb.transactionBuilder.triggerSmartContract(
        usdtContract,
        functionSelector,
        {},
        parameters
    );

    const signedTx = await userTronWeb.trx.sign(tx.transaction);
    console.log("Sending USDT to user address:", userAddress);
    const broadcastedTx = await userTronWeb.trx.sendRawTransaction(signedTx);

    if (!broadcastedTx.result) {
        console.error(broadcastedTx);
        throw new Error("Failed to send transaction");
    }

    const txInfo = await getTransactionInfo(broadcastedTx.transaction.txID, userTronWeb);
    console.log(txInfo);
    console.log("Confirmed:", txInfo?.receipt.result);
}

async function getTransactionInfo(txId: string, tronweb: TronWeb): Promise<TransactionInfo | null> {

    let transactionInfo = {};
    const tries = 10;
    let count = 0;
    do {
        await new Promise(resolve => setTimeout(resolve, 30000));
        console.log(`Checking transaction info ${txId} ...`)
        transactionInfo = await tronweb.trx.getTransactionInfo(txId);
        count++;
    } while (Object.keys(transactionInfo).length === 0 && count <= tries);

    return Object.keys(transactionInfo).length === 0 ? null : transactionInfo as TransactionInfo;
}
