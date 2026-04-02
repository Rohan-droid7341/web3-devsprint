export const LEVELS = [
  {
    level: 1,
    title: "The Genesis",
    description: "Welcome to the Web3 Devsprint. Your first task is to understand the foundations of decentralized technology.",
    content: "Task: Find the hidden message in the Genesis block of the testnet explorer linked below. Once you find it, present it to the admins in person.",
    badges: ["Badge 1: Pioneer"],
    link: process.env.LEVEL_1_GIST 
  },
  {
    level: 2,
    title: "Mastering Smart Contracts",
    description: "Move beyond the basics and dive into the logic of the machine.",
    content: "Task: Carefully read the instructions in the Gist and complete the smart contract challenge. Present your solution to the admins.",
    badges: ["Badge 2: Alchemist"],
    link: process.env.LEVEL_2_GIST 
  },
  {
    level: 3,
    title: "The Architecture of Trust",
    description: "Deep dive into the structural integrity of decentralized systems.",
    content: "Task: Study the architectural requirements provided in the manual. Build a diagram or mockup and explain it to the admins.",
    badges: ["Badge 3: Architect"],
    link: process.env.LEVEL_3_GIST 
  },
  {
    level: 4,
    title: "The Final Sprint",
    description: "The ultimate challenge. Integrate everything you've learned into a final masterpiece.",
    content: "Task: Access the final Repository through the Gist below. Follow the README to complete the sprint.",
    badges: ["Badge 4: Master of the Sprint"],
    link: process.env.LEVEL_4_GIST
  }
]
