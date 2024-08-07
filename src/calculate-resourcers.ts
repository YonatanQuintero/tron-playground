import { TronWeb } from "tronweb";
import { Resources } from "./types/resources.type";
import { SignedTransaction } from "tronweb/lib/esm/types";

/**
 * Class to calculate estimated energy, bandwidth, and TRX to burn for a given TronWeb transaction.
 *
 * @author Yonatan A Quintero R
 */
export class CalculateResources {

    /**
     * TronWeb instance for interacting with the Tron network.
     */
    private readonly tronWeb: TronWeb;

    /**
     * Constructor.
     *
     * @param tronWeb - The TronWeb instance for interacting with the Tron network.
     */
    constructor(tronWeb: TronWeb) {
        this.tronWeb = tronWeb;
    }

    /**
     * Calculates the estimated energy, bandwidth, and TRX to burn for a given TronWeb transaction.
     *
     * @param contract - The contract address to call.
     * @param functionSelector - The function selector to call on the contract.
     * @param parameters - The parameters to pass to the contract function.
     * @param signedTx - The signed transaction to estimate resources for.
     * @returns A promise that resolves to an object containing the estimated energy, bandwidth, and TRX to burn.
     */
    public async getResources(
        contract: string,
        functionSelector: string,
        parameters: any[],
        signedTx: SignedTransaction
    ): Promise<Resources> {

        const txConstant = await this.tronWeb.transactionBuilder.triggerConstantContract(
            contract,
            functionSelector,
            {},
            parameters
        );

        const estimatedEnergy = txConstant.energy_used || 0;
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
     * @returns A promise that resolves to the TRX to burn.
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
}