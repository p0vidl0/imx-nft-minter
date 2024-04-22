const { randomBytes } = require('node:crypto');
const { ImmutableX, Config } = require('@imtbl/core-sdk');
const { getDefaultProvider } = require('@ethersproject/providers');
const { Wallet } = require('@ethersproject/wallet');

const imxClient = new ImmutableX(Config.SANDBOX);

/** Test NFT contract 1 */
const CONTRACT_1 = '0x437F659719Bc617fef12054d1592fA8b31e1ce58';

/** Test NFT contract 2 */
const CONTRACT_2 = '0xe478e589401f77efd46ee23921f74d75c77786ab';

/** Private key of the minter wallet */
const PRIVATE_KEY = 'bce4c2251a48fdfdcbdb7c4c0b5bfdee2c4dfa31041b2ddfa93a02c5c8f66d3e';

/** Ethereum RPC endpoint */
const ETH_RPC = 'https://rpc.sepolia.org';

const signer = new Wallet(PRIVATE_KEY).connect(getDefaultProvider(ETH_RPC));

/**
 * Mint an ERC721 token
 * @param {string} contract - NFT contract address
 * @param {string} receiver - Ethereum address of Passport wallet
 * @param {string} [tokenId] - integer numeric string, random value will be generated if not provided
 * @returns {Promise<{ contract: address; tokenId: string }>}
 */
const mint = async (contract, receiver, tokenId) => {
  const id =
    tokenId || BigInt(`0x${randomBytes(8).toString('hex')}`).toString();

  await imxClient.mint(signer, {
    contract_address: contract,
    royalties: [],
    users: [
      {
        user: receiver,
        tokens: [{ id, blueprint: 'onchain-metadata' }],
      },
    ],
  });

  return { contract, tokenId: id };
};

const RECEIVER = '0x0b991666d3f30b35c962844050d6feb51c1dbdfe';
const TOKEN_ID = '1123'

// Mint a token with the ID '1' to the address '0x0b991666d3f30b35c962844050d6feb51c1dbdfe'
mint(CONTRACT_2, RECEIVER, TOKEN_ID)
  .then((result) => console.log('Minted successfully', result))
  .catch((err) => console.error('Minting error', err));

// Mint a random token with random ID to the address '0x0b991666d3f30b35c962844050d6feb51c1dbdfe'
mint(CONTRACT_1, RECEIVER)
  .then((result) => console.log('Minted successfully', result))
  .catch((err) => console.error('Minting error', err));
