export interface Question {
  id: number;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is the primary characteristic that distinguishes Web3 from Web2?",
    options: [
      { id: "A", text: "Decentralization, blockchain integration, and user ownership of data." },
      { id: "B", text: "The creation of static, read-only web pages." },
      { id: "C", text: "The introduction of mobile applications and responsive design." },
      { id: "D", text: "Total reliance on central servers for faster processing speeds." },
    ],
    correctOptionId: "A"
  },
  {
    id: 2,
    text: "In a blockchain, what cryptographic concept links each block to the previous one, ensuring the data cannot be tampered with?",
    options: [
      { id: "A", text: "Smart Contracts" },
      { id: "B", text: "Cryptographic Hash" },
      { id: "C", text: "Symmetric Encryption" },
      { id: "D", text: "Public Key Infrastructure (PKI)" },
    ],
    correctOptionId: "B"
  },
  {
    id: 3,
    text: "Which of the following best describes the difference between Proof of Work (PoW) and Proof of Stake (PoS) consensus mechanisms?",
    options: [
      { id: "A", text: "PoW is inherently faster and more energy-efficient than PoS." },
      { id: "B", text: "PoW requires validators to hold cryptocurrency, while PoS requires solving complex mathematical puzzles." },
      { id: "C", text: "PoW relies on computational power to validate blocks, whereas PoS selects validators based on the amount of cryptocurrency they hold and 'lock up'." },
      { id: "D", text: "PoW is used exclusively for smart contracts, while PoS is used for simple transactions." },
    ],
    correctOptionId: "C"
  },
  {
    id: 4,
    text: "Once deployed on a blockchain like Ethereum, what is a fundamental property of a standard smart contract?",
    options: [
      { id: "A", text: "Its code can be freely modified or deleted by the original creator at any time." },
      { id: "B", text: "It requires a central legal authority to verify its execution and enforce its rules." },
      { id: "C", text: "It is hidden from public view to protect the privacy of the participants." },
      { id: "D", text: "It executes automatically when predetermined conditions are met and its code is immutable." },
    ],
    correctOptionId: "D"
  },
  {
    id: 5,
    text: "What does the ERC-721 token standard primarily enable on the Ethereum blockchain?",
    options: [
      { id: "A", text: "The execution of privacy-preserving zero-knowledge proofs." },
      { id: "B", text: "The creation of Non-Fungible Tokens (NFTs), representing unique digital items." },
      { id: "C", text: "The creation of fungible tokens, similar to standard fiat currencies." },
      { id: "D", text: "The bridging of assets between Ethereum and the Bitcoin network." },
    ],
    correctOptionId: "B"
  },
  {
    id: 6,
    text: "In a Decentralized Autonomous Organization (DAO), how are critical decisions and protocol upgrades typically made?",
    options: [
      { id: "A", text: "By a randomly selected group of blockchain miners or validators." },
      { id: "B", text: "By a centralized board of directors elected annually through traditional off-chain voting." },
      { id: "C", text: "Exclusively by the original founders and core developers of the protocol." },
      { id: "D", text: "Through automated smart contract voting mechanisms where members use governance tokens to vote." },
    ],
    correctOptionId: "D"
  },
  {
    id: 7,
    text: "The 'Blockchain Trilemma' posits that it is extremely difficult for a simple blockchain network to simultaneously optimize which three properties?",
    options: [
      { id: "A", text: "Transparency, Anonymity, and Interoperability" },
      { id: "B", text: "Low Fees, High Yield, and Absolute Security" },
      { id: "C", text: "Decentralization, Security, and Scalability" },
      { id: "D", text: "Speed, Privacy, and Scalability" },
    ],
    correctOptionId: "C"
  },
  {
    id: 8,
    text: "How do Optimistic Rollups attempt to scale Layer 1 blockchains like Ethereum?",
    options: [
      { id: "A", text: "By replacing the Layer 1 consensus mechanism with a much faster Proof of Authority network." },
      { id: "B", text: "By increasing the block size and reducing the block time of the Layer 1 network directly." },
      { id: "C", text: "By generating cryptographic zero-knowledge proofs for every single transaction before it hits the mainnet." },
      { id: "D", text: "By executing transactions off-chain and posting batched data to Layer 1, assuming validity unless challenged via a fraud proof." },
    ],
    correctOptionId: "D"
  },
  {
    id: 9,
    text: "What vulnerability does a '51% attack' primarily exploit in a Proof of Work (PoW) blockchain?",
    options: [
      { id: "A", text: "A flaw in a popular smart contract coding language that allows liquidity pools to be drained." },
      { id: "B", text: "An entity gaining control of the majority of the network's mining hash rate, allowing them to reverse recent transactions and double-spend." },
      { id: "C", text: "A failure in the cryptographic hash function (like SHA-256) used by the network." },
      { id: "D", text: "A coordinated effort to flood the network with micro-transactions, causing a Denial of Service (DoS)." },
    ],
    correctOptionId: "B"
  },
  {
    id: 10,
    text: "In the context of Web3 and DeFi, what does MEV (Maximal Extractable Value) refer to?",
    options: [
      { id: "A", text: "The profit a miner or validator can make through their ability to arbitrarily include, exclude, or re-order transactions within a block." },
      { id: "B", text: "The maximum amount of interest a user can theoretically earn in a decentralized lending protocol." },
      { id: "C", text: "The total value of all assets locked (TVL) within a specific layer-1 ecosystem." },
      { id: "D", text: "A cryptographic technique used by hackers to extract private keys from poorly secured hardware wallets." },
    ],
    correctOptionId: "A"
  }
];
