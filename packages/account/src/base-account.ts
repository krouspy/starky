import {
  CallOptions,
  ContractInteractionFunction,
  EstimateFeeOptions,
  FeeEstimation,
  InteractChoice,
  InteractOptions,
  InvokeOptions,
  InvokeResponse,
  StarknetContract,
  StringMap,
} from './types';
import {
  CallParameters,
  generateKeys,
  handleAccountContractArtifacts,
  handleMultiCall,
  parseMulticallOutput,
  signMultiCall,
} from './account-utils';
import { copyWithBigint } from './utils';
import { KeyPair } from '@starky/key-pair';

/**
 * Representation of an Account.
 * Multiple implementations can exist, each will be defined by an extension of this Abstract class
 */
export abstract class Account {
  protected constructor(
    public starknetContract: StarknetContract,
    public privateKey: string,
    public publicKey: string,
    public keyPair: KeyPair
  ) {}

  /**
   * Uses the account contract as a proxy to invoke a function on the target contract with a signature
   *
   * @param toContract target contract to be called
   * @param functionName function in the contract to be called
   * @param calldata calldata to use as input for the contract call
   */
  async invoke(
    toContract: StarknetContract,
    functionName: string,
    calldata?: StringMap,
    options?: InvokeOptions
  ): Promise<InvokeResponse> {
    return (
      await this.interact(InteractChoice.INVOKE, toContract, functionName, calldata, options)
    ).toString();
  }

  /**
   * Uses the account contract as a proxy to call a function on the target contract with a signature
   *
   * @param toContract target contract to be called
   * @param functionName function in the contract to be called
   * @param calldata calldata to use as input for the contract call
   */
  async call(
    toContract: StarknetContract,
    functionName: string,
    calldata?: StringMap,
    options?: CallOptions
  ): Promise<StringMap> {
    const { response } = <{ response: string[] }>(
      await this.interact(InteractChoice.CALL, toContract, functionName, calldata, options)
    );
    return toContract.adaptOutput(functionName, response.join(' '));
  }

  async estimateFee(
    toContract: StarknetContract,
    functionName: string,
    calldata?: StringMap,
    options?: EstimateFeeOptions
  ): Promise<FeeEstimation> {
    return await this.interact(
      InteractChoice.ESTIMATE_FEE,
      toContract,
      functionName,
      calldata,
      options
    );
  }

  private async interact(
    choice: InteractChoice,
    toContract: StarknetContract,
    functionName: string,
    calldata?: StringMap,
    options?: InteractOptions
  ) {
    const call: CallParameters = {
      functionName: functionName,
      toContract: toContract,
      calldata: calldata,
    };

    return await this.multiInteract(choice, [call], options);
  }

  /**
   * Performs a multicall through this account
   * @param callParameters an array with the paramaters for each call
   * @returns an array with each call's repsecting response object
   */
  async multiCall(callParameters: CallParameters[], options?: CallOptions): Promise<StringMap[]> {
    const { response } = <{ response: string[] }>(
      await this.multiInteract(InteractChoice.CALL, callParameters, options)
    );
    const output: StringMap[] = parseMulticallOutput(response, callParameters);
    return output;
  }

  /**
   * Performes multiple invokes as a single transaction through this account
   * @param callParameters an array with the paramaters for each invoke
   * @returns the transaction hash of the invoke
   */
  async multiInvoke(callParameters: CallParameters[], options?: InvokeOptions): Promise<string> {
    // Invoke only returns one transaction hash, as the multiple invokes are done by the account contract, but only one is sent to it.
    return await this.multiInteract(InteractChoice.INVOKE, callParameters, options);
  }

  /**
   * Etimate the fee of the multicall.
   * @param callParameters an array with the parameters for each call
   * @returns the total estimated fee
   */
  async multiEstimateFee(
    callParameters: CallParameters[],
    options?: EstimateFeeOptions
  ): Promise<FeeEstimation> {
    return await this.multiInteract(InteractChoice.ESTIMATE_FEE, callParameters, options);
  }

  private async multiInteract(
    choice: InteractChoice,
    callParameters: CallParameters[],
    options: InteractOptions = {}
  ) {
    options = copyWithBigint(options);
    options.maxFee = BigInt(options?.maxFee || '0');
    const nonce = options.nonce || (await this.getNonce());
    delete options.nonce; // the options object is incompatible if passed on with nonce

    const { messageHash, args } = handleMultiCall(
      this.starknetContract.address,
      callParameters,
      nonce,
      options.maxFee,
      choice.transactionVersion
    );

    const signatures = this.getSignatures(messageHash);
    const contractInteractOptions = { signature: signatures, ...options };

    const contractInteractor = (<ContractInteractionFunction>(
      this.starknetContract[choice.internalCommand]
    )).bind(this.starknetContract);
    const executionFunctionName = this.getExecutionFunctionName();
    return contractInteractor(executionFunctionName, args, contractInteractOptions);
  }

  protected abstract getSignatures(messageHash: string): bigint[];

  protected abstract getExecutionFunctionName(): string;

  protected abstract getNonce(): Promise<bigint>;
}

/* import { Provider } from '@starky/providers';
import { KeyPair } from '@starky/key-pair';

export abstract class BaseAccount {
  constructor(
    public readonly provider: Provider,
    public readonly privateKey: string,
    public readonly publicKey: string,
    public readonly keyPair: KeyPair
  ) {}

	private async interact()

  async getNonce() {
    return this.provider.getNonce(this.privateKey);
  }
} */
