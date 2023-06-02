export type GetPublicKeyRequest = { account?: string };
export type GetPublicKeyResponse = { account: string; publicKey: string };

export type CreateTransactionRequest = {
  account: string;
  outputs: {
    publicAddress: string;
    amount: string;
    memo: string;
    assetId?: string;
  }[];
  mints?: {
    assetId?: string;
    name?: string;
    metadata?: string;
    value: string;
  }[];
  burns?: {
    assetId: string;
    value: string;
  }[];
  fee?: string | null;
  feeRate?: string | null;
  expiration?: number;
  expirationDelta?: number;
  confirmations?: number;
  notes?: string[];
};

export type CreateTransactionResponse = {
  transaction: string;
};

export type PostTransactionRequest = {
  account?: string;
  transaction: string;
  broadcast?: boolean;
};

export type PostTransactionResponse = {
  hash: string;
  transaction: string;
};

export type RpcWalletNote = {
  value: string;
  assetId: string;
  assetName: string;
  memo: string;
  sender: string;
  owner: string;
  noteHash: string;
  transactionHash: string;
  index: number | null;
  nullifier: string | null;
  spent: boolean;
  /**
   * @deprecated Please use `owner` address instead
   */
  isOwner: boolean;
  /**
   * @deprecated Please use `noteHash` instead
   */
  hash: string;
};

export type GetNotesResponse = {
  notes: Array<RpcWalletNote>;
  nextPageCursor: string | null;
};
