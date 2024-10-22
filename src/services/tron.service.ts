import { TronWeb } from "tronweb";
import { Resources } from "../types/resources.type";
import { SignedTransaction, TransactionInfo } from "tronweb/lib/esm/types";

export class TronService {
    constructor(private readonly tronWeb: TronWeb) { }

    /**
     * Calculates the estimated energy, bandwidth, and TRX to burn for a given TronWeb transaction.
     *
     * @param contract - The contract address to call.
     * @param functionSelector - The function selector to call on the contract.
     * @param parameters - The parameters to pass to the contract function.
     * @returns A promise that resolves to an object containing the estimated energy, bandwidth, and TRX to burn.
     */
    async getResources(
        contract: string,
        functionSelector: string,
        parameters: any[],
    ): Promise<Resources> {

        try {
            const tx = await this.tronWeb.transactionBuilder.triggerSmartContract(
                contract,
                functionSelector,
                {},
                parameters
            );

            const signedTx = await this.tronWeb.trx.sign(tx.transaction);

            const estimatedEnergy = await this.getEstimateEnergy(
                contract, functionSelector, parameters
            );
            const estimatedBandwidth = this.getEstimateBandwidth(signedTx);
            const trxToBurn = await this.calculateTrxToBurn(
                estimatedEnergy,
                estimatedBandwidth
            );

            return {
                estimatedEnergy,
                estimatedBandwidth,
                trxToBurn
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // This function does not work correctly
    // It is throwing an error
    // Main Network Error: this node does not support estimate energy
    async getEstimateEnergyWithTronWeb(
        contract: string,
        functionSelector: string,
        parameters: any[]
    ): Promise<number> {

        const result = await this.tronWeb.transactionBuilder.estimateEnergy(
            contract,
            functionSelector,
            {},
            parameters
        );
        return result.energy_required || 0;
    }

    /**
     * This function does not work correctly
     * It is throwing an error: REVERT opcode executed
     * Retrieves the estimated energy required for a transaction using the TriggerConstantContract method.
     *
     * @param contract - The contract address to call.
     * @param functionSelector - The function selector to call on the contract.
     * @param parameters - The parameters to pass to the contract function.
     * @returns A promise that resolves to the estimated energy required for the transaction.
     *          If the energy_used property is not present in the response, it returns 0.
     */
    async getEstimateEnergy(
        contract: string,
        functionSelector: string,
        parameters: any[]
    ): Promise<number> {

        const txConstant = await this.tronWeb.transactionBuilder.triggerConstantContract(
            contract,
            functionSelector,
            {},
            parameters
        );

        return txConstant.energy_used || 0;
    }


    /**
    * Retrieves transaction information from the Tron network for a given transaction ID.
    *
    * @param txId - The transaction ID to retrieve information for.
    * @returns A promise that resolves to the transaction information if found, or null if not found after a certain number of attempts.
    */
    async getTransactionInfo(txId: string): Promise<TransactionInfo | null> {

        let transactionInfo = {};
        const tries = 20;
        let count = 0;
        do {
            await new Promise(resolve => setTimeout(resolve, 30000));
            console.log(`Checking transaction info ${txId} ...`)
            transactionInfo = await this.tronWeb.trx.getTransactionInfo(txId);
            count++;
        } while (Object.keys(transactionInfo).length === 0 && count <= tries);

        return Object.keys(transactionInfo).length === 0 ? null : transactionInfo as TransactionInfo;
    }

    /**
     * Calculates the estimated bandwidth for a given signed transaction.
     *
     * @param signedTx - The signed transaction to estimate bandwidth for.
     * @returns The estimated bandwidth.
     */
    private getEstimateBandwidth(signedTx: SignedTransaction): number {
        let estimateBandwidth = signedTx.raw_data_hex.length + signedTx.signature[0].length;
        return estimateBandwidth = (estimateBandwidth / 2) + 68;
    }

    /**
     * Calculates the TRX to burn for a given amount of energy and bandwidth.
     *
     * @param requiredEnergy - The required energy for the transaction.
     * @param requiredBandwidth - The required bandwidth for the transaction.
     * @returns A promise that resolves to the TRX to burn in decimal format.
     */
    private async calculateTrxToBurn(
        requiredEnergy: number,
        requiredBandwidth: number
    ): Promise<number> {

        const chainParameters = await this.tronWeb.trx.getChainParameters();
        const energyFee = chainParameters.find(param => param.key === 'getEnergyFee')?.value || 0;
        const bandwidthFee = chainParameters.find(param => param.key === 'getTransactionFee')?.value || 0;
        const trxForEnergy = (requiredEnergy * energyFee) / 1000000;
        const trxForBandwidth = (requiredBandwidth * bandwidthFee) / 1000000;
        return trxForEnergy + trxForBandwidth;

    }

    /**
     * Retrieves the TronWeb instance used by the TronService.
     *
     * @returns The TronWeb instance.
     */
    getTronWeb(): TronWeb {
        return this.tronWeb;
    }
}