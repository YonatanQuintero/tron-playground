import { TronWeb } from "tronweb";
import { TronService } from "./tron.service";
import { BroadcastReturn, ContractParamter, SignedTransaction, Transaction } from "tronweb/lib/esm/types";
import { Resources } from "../types/resources.type";

export class TheterService extends TronService {

    constructor(
        protected readonly tronWeb: TronWeb,
        private readonly contractAddress: string
    ) {
        super(tronWeb);
    }

    async getBalanceInSun(address: string): Promise<number> {
        const contract = await this.tronWeb.contract().at(this.contractAddress);
        return await contract.balanceOf(address).call();
    }

    async getBalanceInDecimal(address: string): Promise<number> {
        const balanceInSun = await this.getBalanceInSun(address);
        return Number(this.tronWeb.fromSun(balanceInSun));
    }

    async transfer(address: string, amountInSun: number):
        Promise<BroadcastReturn<SignedTransaction & Transaction<ContractParamter>>> {

        const tx = await this.tronWeb.transactionBuilder.triggerSmartContract(
            this.contractAddress,
            "transfer(address,uint256)",
            {},
            [{
                type: "address", value: address
            }, {
                type: "uint256", value: amountInSun
            }]
        );

        const signedTx = await this.tronWeb.trx.sign(tx.transaction);
        return await this.tronWeb.trx.sendRawTransaction(signedTx);
    }

    async getTransferResources(address: string, amountInSun: number): Promise<Resources> {
        return await this.getResources(
            this.contractAddress,
            "transfer(address,uint256)",
            [{
                type: "address", value: address
            }, {
                type: "uint256", value: amountInSun
            }],
        );
    }

}