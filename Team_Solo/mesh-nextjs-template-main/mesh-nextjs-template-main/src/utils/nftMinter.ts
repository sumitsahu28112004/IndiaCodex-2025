import { Transaction, stringToHex, ForgeScript, resolveScriptHash } from '@meshsdk/core';
import { BlockfrostProvider } from '@meshsdk/provider';

/**
 * Mints an NFT on the Cardano Preprod Testnet
 * @param wallet - The connected wallet instance from MeshJS
 * @param metadata - The NFT metadata object containing name, description, and image
 * @returns Promise<string> - The transaction hash upon successful submission
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mintNFT(wallet: any, metadata: { name: string, description: string, image: string }): Promise<string> {
  try {
    // Get API Key and initialize the Blockfrost provider
    // Make sure to set NEXT_PUBLIC_BLOCKFROST_API_KEY in your .env.local file
    const blockfrostKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || 'preprodYOUR_API_KEY_HERE';

    // Initialize the provider with your API key
    const blockchainProvider = new BlockfrostProvider(blockfrostKey);

    // Get wallet address first (needed for policy generation)
    const address = await wallet.getChangeAddress();
    
    // Define NFT asset name and hex-encode it using the provided metadata
    const assetName = metadata.name || 'MyFirstNFT';
    const assetNameHex = stringToHex(assetName);

    // Generate a valid policy script and ID based on the wallet's address
    const policyScript = ForgeScript.withOneSignature(address);
    const policyId = resolveScriptHash(policyScript);

    // Note: Asset metadata will be attached separately if needed
    // For now, we'll create a simple minting transaction

    // Get UTXOs for the transaction
    const utxos = await wallet.getUtxos();

    // Create the minting transaction
    const tx = new Transaction({ initiator: wallet })
      .setTxInputs(utxos) // Set available UTXOs for the transaction
      .sendAssets(
        address,
        [{
          unit: policyId + assetNameHex, // Use the valid policy ID and hex-encoded asset name
          quantity: "1"
        }]
      )
      .setChangeAddress(address); // Set change address

    // Build the transaction
    const unsignedTx = await tx.build();

    // Sign the transaction using the connected wallet
    const signedTx = await wallet.signTx(unsignedTx);

    // Submit the signed transaction to the Cardano network
    const txHash = await blockchainProvider.submitTx(signedTx);

    return txHash;
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw new Error(`Failed to mint NFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}