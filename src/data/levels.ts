export interface Level {
  level: number;
  title: string;
  description: string;
  content?: string;
  badges: string[];
  link: string | undefined;
}

export const LEVELS: Level[] = [
  {
    level: 1,
    title: "The Genesis",
    description: "Every master was once a beginner — understand the blocks before you build the chain.",
    badges: ["Badge 1: Bronze"],
    link: process.env.LEVEL_1_GIST 
  },
  {
    level: 2,
    title: "Hacker's Gambit",
    description: "In the sea of bytes, only the precise transaction finds the shore.",
    badges: ["Badge 2: Silver"],
    link: process.env.LEVEL_2_GIST 
  },
  {
    level: 3,
    title: "The Architecture of Trust",
    description: "Deep dive into the structural integrity of decentralized systems.",
    badges: ["Badge 3: Gold"],
    link: process.env.LEVEL_3_GIST 
  },
  {
    level: 4,
    title: "The Final Audit",
    description: "Logic is the law, but time is the loophole; secure the state or lose the system.",
    badges: ["Badge 4: Level Devil"],
    link: process.env.LEVEL_4_GIST
  }
]
