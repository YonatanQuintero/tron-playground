import { TransactionInfo } from "tronweb/lib/esm/types";
import { getTronWeb, NILE_USDT_CONTRACT, TRON_ADDRESS, USER_ADDRESS } from "../config";
import { TronWeb } from "tronweb";
import { estimateResources } from "./estimate-resources";
import { CalculateResources } from "./calculate-resources";

export const resourcesDelegation = async (): Promise<void> => {

    const mainAddress = TRON_ADDRESS;
    if (!mainAddress) {
        throw new Error("Missing main wallet address");
    }

    const sponsorPrivateKey = process.env.TRON_PRIVATE_KEY;
    if (!sponsorPrivateKey) {
        throw new Error("Missing sponsor private key");
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

    const mainTronWeb = getTronWeb();
    const userTronWeb = getTronWeb(userPrivateKey);
    const functionSelector = "transfer(address,uint256)";
    // const amount = getbalance() TODO: Get actual balance
    const parameters = [
        { type: "address", value: mainAddress },
        { type: "uint256", value: mainTronWeb.toSun(1.198805) }
    ];


    const tx = await userTronWeb.transactionBuilder.triggerSmartContract(
        usdtContract,
        "transfer(address,uint256)",
        {},
        [
            { type: "address", value: mainAddress },
            { type: "uint256", value: userTronWeb.toSun(1.198805) }
        ]
    );

    const signedTx = await userTronWeb.trx.sign(tx.transaction);
    const calculateResources = new CalculateResources(userTronWeb);
    const resources = await calculateResources.getResources(
        usdtContract,
        functionSelector,
        parameters,
        signedTx
    );

    if (resources.trxToBurn > 0) {
        await sendTrxToBurn(mainTronWeb, resources.trxToBurn, userAddress);
    }

    console.log(`Sending USDT from ${userAddress} to ${mainAddress}...`);
    
    const tx2 = await userTronWeb.transactionBuilder.triggerSmartContract(
        usdtContract,
        "transfer(address,uint256)",
        {},
        [
            { type: "address", value: mainAddress },
            { type: "uint256", value: userTronWeb.toSun(1.198805) }
        ]
    );

    const signedTx2 = await userTronWeb.trx.sign(tx2.transaction);
    const broadcastedTx = await userTronWeb.trx.sendRawTransaction(signedTx2);

    if (!broadcastedTx.result) {
        console.error(broadcastedTx);
        throw new Error("Failed to send transaction");
    }

    const txInfo = await getTransactionInfo(broadcastedTx.transaction.txID, userTronWeb);
    console.log(txInfo);
    console.log("Status:", txInfo?.receipt.result);
}

async function sendTrxToBurn(tronWeb: TronWeb, amountInTrx: number, address: string): Promise<void> {
    console.log(`Sending ${amountInTrx} TRX to ${address}...`);
    const broadcastedTx = await tronWeb.trx.sendTrx(address, Number(tronWeb.toSun(amountInTrx)));
    if (!broadcastedTx.result) {
        console.error(broadcastedTx);
        throw new Error("Failed to send transaction");
    }
    const txInfo = await getTransactionInfo(broadcastedTx.transaction.txID, tronWeb);
    console.log(txInfo);
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
