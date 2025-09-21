import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { mintNFT } from "../utils/nftMinter";

export default function Home() {
  const { wallet, connected } = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // NFT metadata form state
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [nftImageUrl, setNftImageUrl] = useState('');
  
  // Minted NFT display state
  const [mintedNftData, setMintedNftData] = useState<{
    name: string;
    description: string;
    image: string;
    txHash: string;
  } | null>(null);

  const handleMintNFT = async () => {
    if (!connected || !wallet) {
      setError("Please connect your wallet first");
      return;
    }

    // Validate form inputs
    if (!nftName.trim() || !nftDescription.trim() || !nftImageUrl.trim()) {
      setError("Please fill in all fields (name, description, and image URL)");
      return;
    }

    setIsMinting(true);
    setError(null);
    setTxHash(null);
    setMintedNftData(null);

    try {
      const metadata = {
        name: nftName.trim(),
        description: nftDescription.trim(),
        image: nftImageUrl.trim()
      };

      const hash = await mintNFT(wallet, metadata);
      setTxHash(hash);
      
      // Set the minted NFT data for display
      setMintedNftData({
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        txHash: hash
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mint NFT");
    } finally {
      setIsMinting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <Head>
        <title>NFT Minter</title>
        <meta name="description" content="Mint your NFTs on Cardano blockchain" />
      </Head>
      
      {/* Subtle geometric pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        }}></div>
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 lg:p-24">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            NFT Minter
        </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create and mint your unique digital assets on the Cardano blockchain
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8">
          <CardanoWallet />
        </div>

        {/* NFT Metadata Form */}
        {connected && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 max-w-lg w-full shadow-2xl mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">NFT Details</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="nftName" className="block text-sm font-medium text-gray-300 mb-2">
                  NFT Name *
                </label>
                <input
                  type="text"
                  id="nftName"
                  value={nftName}
                  onChange={(e) => setNftName(e.target.value)}
                  placeholder="Enter your NFT name"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="nftDescription" className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  id="nftDescription"
                  value={nftDescription}
                  onChange={(e) => setNftDescription(e.target.value)}
                  placeholder="Describe your NFT"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
              
              <div>
                <label htmlFor="nftImageUrl" className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  id="nftImageUrl"
                  value={nftImageUrl}
                  onChange={(e) => setNftImageUrl(e.target.value)}
                  placeholder="https://example.com/your-image.jpg"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>
        )}

        {/* NFT Minting Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Mint Your NFT</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Fill in the NFT details above and mint your unique digital asset on Cardano Preprod Testnet
            </p>
            
            <button
              onClick={handleMintNFT}
              disabled={!connected || isMinting}
              className={`w-full px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                connected && !isMinting
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25 hover:scale-105'
                  : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isMinting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Minting...
                </span>
              ) : (
                'Mint My NFT'
              )}
            </button>

            {/* Success Message */}
            {txHash && (
              <div className="mt-6 p-4 bg-green-500/20 border border-green-400/30 rounded-xl backdrop-blur-sm">
                <p className="text-green-300 font-semibold text-lg">🎉 NFT Minted Successfully!</p>
                <p className="text-sm text-green-200 mt-2 break-all">
                  <span className="font-mono bg-green-900/30 px-2 py-1 rounded">{txHash}</span>
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm">
                <p className="text-red-300 font-semibold text-lg">⚠️ Error</p>
                <p className="text-sm text-red-200 mt-2">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Minted NFT Display */}
        {mintedNftData && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 max-w-lg w-full shadow-2xl mt-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-6">🎉 Your NFT is Ready!</h3>
              
              {/* NFT Image */}
              <div className="mb-6">
                <div className="relative w-full max-w-sm mx-auto">
                  <Image
                    src={mintedNftData.image}
                    alt={mintedNftData.name}
                    width={300}
                    height={300}
                    className="rounded-xl shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=NFT+Image';
                    }}
                  />
                </div>
              </div>
              
              {/* NFT Details */}
              <div className="text-left bg-white/5 rounded-xl p-6 mb-6">
                <h4 className="text-xl font-bold text-white mb-2">{mintedNftData.name}</h4>
                <p className="text-gray-300 mb-4 leading-relaxed">{mintedNftData.description}</p>
                
                {/* Transaction Hash */}
                <div className="border-t border-white/20 pt-4">
                  <p className="text-sm text-gray-400 mb-2">Transaction Hash:</p>
                  <p className="text-xs text-gray-300 break-all font-mono bg-white/10 px-3 py-2 rounded">
                    {mintedNftData.txHash}
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`https://preprod.cardanoscan.io/transaction/${mintedNftData.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 text-center"
                >
                  View on Cardanoscan
                </a>
                <button
                  onClick={() => {
                    setMintedNftData(null);
                    setNftName('');
                    setNftDescription('');
                    setNftImageUrl('');
                    setTxHash(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Mint Another NFT
                </button>
              </div>
            </div>
        </div>
        )}
      </main>
    </div>
  );
}
