import {
  CreateTransactionRequest,
  CreateTransactionResponse,
  GetNotesResponse,
  GetPublicKeyResponse,
  PostTransactionRequest,
  PostTransactionResponse,
} from '../interface';
import Service from './service';

class RpcService extends Service {
  constructor(rpcUrl: string) {
    super(rpcUrl);
  }

  getAddress(account: string): Promise<GetPublicKeyResponse> {
    return this.fetcher.post('wallet/getPublicKey', { account });
  }

  getNotes(account: string): Promise<GetNotesResponse> {
    return this.fetcher.post('/wallet/getNotes', {
      account,
      filter: {
        spent: false,
      },
    });
  }

  createTx(
    createTxRq: CreateTransactionRequest,
  ): Promise<CreateTransactionResponse> {
    return this.fetcher.post('wallet/createTransaction', createTxRq);
  }

  postTx(postTxRq: PostTransactionRequest): Promise<PostTransactionResponse> {
    return this.fetcher.post('wallet/postTransaction', postTxRq);
  }

  toString(): string {
    return 'RpcService';
  }
}

export default RpcService;
