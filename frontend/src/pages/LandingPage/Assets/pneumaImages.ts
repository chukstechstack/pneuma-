export interface PneumaImage {
  id: number;
  title: string;
  location: string;
  category: string;
  url: string;
  caption: string;
}



export const PNEUMA_IMAGES: PneumaImage[] = [

  {
    id: 1,
    title: "Global Medical Vanguard",
    location: "Sector 01 // Field Response HQ",
    category: "Vanguard",
    url: "https://pneuma-public-assets.s3.eu-north-1.amazonaws.com/ChatGPT+Image+Aug+22%2C+2026%2C+11_42_55+AM.jpg",
    caption: "We didn’t build this to escape the world. We built it to remember what it feels like to live in it unmasked, unfiltered, and wide awake."
  },
  {
    id: 2,
    title: "Humanitarian Relief Network",
    location: "Sector 02 // Global Aid Grid",
    category: "Vanguard",
    url: "https://pneuma-public-assets.s3.eu-north-1.amazonaws.com/ChatGPT+Image+Aug+22%2C+2026%2C+11_44_01+AM.jpg",
    caption: "The old systems were designed to contain us. The next iteration is built to expand us—turning raw noise into crystal-clear intent."
  },
  {
    id: 3,
    title: "Frontline Triage Operations",
    location: "Sector 03 // Active Stabilization",
    category: "Vanguard",
    url: "https://pneuma-public-assets.s3.eu-north-1.amazonaws.com/ChatGPT+Image+Aug+22%2C+2026%2C+11_45_39+AM.jpg",
    caption: "Evolution isn't a destination; it's a constant recalibration. Stand at the edge, look forward, and build the reality you refuse to wait for."
  },

  // --- Rural Collapse / Outposts (3 - 6) ---

  {
    id: 4,
    title: "BREATHING LIFE INTO HELL",
    location: "Sector 01 // Frontline Shockwaves",
    category: "The Rescue",
    url: "https://pneuma-public-assets.s3.eu-north-1.amazonaws.com/OutPost/ChatGPT+Image+Aug+22%2C+2026%2C+01_46_51+PM.jpg",
    caption: "Where roads are blown apart and empires withdraw, we drop from the sky. We pitch shelters in the dirt, switch on the lights, and establish a sanctuary of absolute survival in the dark."
  },
  {
    id: 5,
    title: "THE LIFELINE IN THE DARK",
    location: "Sector 02 // Voice of the Network",
    category: "The Rescue",
    url: "https://pneuma-public-assets.s3.eu-north-1.amazonaws.com/OutPost/ChatGPT+Image+Aug+22%2C+2026%2C+01_47_01+PM.jpg",
    caption: "Isolation is a death sentence. Our operators sit on the edge of crisis zones, answering the midnight cries of the forgotten, routing blood, food, and hope to families trapped behind enemy lines."
  },
  {
    id: 6,
    title: "SPEAKING HOPE TO THE TRENCHES",
    location: "Sector 03 // Grassroots Truth",
    category: "The Rescue",
    url: "https://pneuma-public-assets.s3.eu-north-1.amazonaws.com/OutPost/ChatGPT+Image+Aug+22%2C+2026%2C+01_48_19+PM+(1).jpg",
    caption: "We do not lead from corporate boardrooms. We stand under thatched roofs with rural elders, uniting communities to reclaim their dignity and rise against the corruption that left them to die."
  },
  {
    id: 7,
    title: "LOVE HAS A PHYSICAL ADRESS",
    location: "Sector 04 // Hand-To-Hand Covenant",
    category: "The Rescue",
    url: "https://pneuma-public-assets.s3.eu-north-1.amazonaws.com/OutPost/ChatGPT+Image+Aug+22%2C+2026%2C+01_58_58+PM.jpg",
    caption: "Faith without works is dead. We look our brothers and sisters in the eye, smile, and place raw medical and food aid directly into their hands. No paperwork. No red tape. Just pure compassion."
  },


  // --- Who Are We / Mission (Indices 7 - 11) ---
  {
    id: 8,
    title: "THE WAR ZONES",
    location: "Sector 08 // Emergency Relief",
    category: "Medical Sanctuary",
    url: "https://unsplash.com",
    caption: "Where bombs shatter families, we do not look away. We deliver immediate medical sanctuary directly to bloodied soil. Because a child in a conflict zone deserves a tomorrow."
  },
  {
    id: 9,
    title: "THE ADDICTIONS",
    location: "Sector 09 // Human Dignity",
    category: "Behavioral Rescue",
    url: "https://unsplash.com",
    caption: "Dependency is not a crime; it is a soul crying out in the dark. We stand in the trenches of isolation, offering radical, unjudgmental love to pull our people back to the light."
  },
  {
    id: 10,
    title: "THE FORGOTTEN",
    location: "Sector 10 // Grassroots Support",
    category: "Community Power",
    url: "https://unsplash.com",
    caption: "Poverty should never be a death sentence. We tear down artificial borders to bring world-class care to communities left behind by institutional neglect."
  },
  {
    id: 11,
    title: "THE RADICAL INFRASTRUCTURE",
    location: "Sector 11 // Our Covenant",
    category: "Global Sanctuary",
    url: "https://unsplash.com",
    caption: "This is more than an app. This is a decentralized hospital without walls, driven by the fierce urgency of now. Love is our only infrastructure."
  },

  // --- Problem Section  / The Human Crisis (Indices 11 - 14 / IDs 12 - 15) ---

  {
    id: 12,
    title: "THE COLD MACHINE",
    location: "Sector 12 // The Bureaucratic Silent Desert",
    category: "Crisis",
    url: "https://unsplash.com",
    caption: "We sit in comfortable, air-conditioned rooms, staring at data streams while flesh-and-blood human beings scream for a doctor in the dirt. We have commodified the crisis, turning agony into analytical reports."
  },
  {
    id: 13,
    title: "THE PRICE OF SURVIVAL",
    location: "Sector 13 // The Ledger of Indifference",
    category: "Crisis",
    url: "https://unsplash.com",
    caption: "A child’s heartbeat should never depend on a financial budget. While modern medicine counts the cost of a single syringe, a brother falls deeper into the trenches of addiction, forgotten by an advanced world."
  },
  {
    id: 14,
    title: "THE SHADOWED NATIONS",
    location: "Sector 14 // Broken Boundaries",
    category: "Crisis",
    url: "https://unsplash.com",
    caption: "From space, our world looks glowing and hyper-connected. On the ground, entire neighborhoods are plunged into total medical darkness—walled off by checkpoints, trapped under bombs, left to heal their own wounds."
  },
  {
    id: 15,
    title: "THE GHOST CHANNELS",
    location: "Sector 15 // The Code of Neglect",
    category: "Crisis",
    url: "https://unsplash.com",
    caption: "We have reduced breathing souls into cold digital entries on a screen. A spreadsheet cannot stem the bleeding. While red tape holds back supplies, vulnerable people slip away in silence, waiting for aid that never leaves the laboratory."
  },

  // --- Solution Section / Direct Intervention (Indices 15 - 20 / IDs 16 - 20) ---

  {
    id: 16,
    title: "IMMEDIATE SURGERY FUNDING",
    location: "Sector 16 // Emergency Relief",
    category: "Medical Action",
    url: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1600&auto=format&fit=crop",
    caption: "We destroy hospital red tape. When a life hangs in the balance, we clear the debt and fund the surgery instantly. Money will never be the reason someone dies on our watch."
  },
  {
    id: 17,
    title: "BOOTS ON THE GROUND",
    location: "Sector 17 // Field Operations",
    category: "Community Aid",
    url: "https://pnuema-optimizzed-images.s3.eu-north-1.amazonaws.com/ChatGPT+Image+Aug+22%2C+2026%2C+11_44_01+AM.jpg",
    caption: "We do not coordinate from a safe distance. Our teams physically enter vulnerable neighborhoods to deliver food, medicine, and critical supplies directly into the hands of those who need them."
  },
  {
    id: 18,
    title: "RECOVERY THROUGH PRESENCE",
    location: "Sector 18 // Recovery Node",
    category: "Human Rescue",
    url: "https://pnuema-optimizzed-images.s3.eu-north-1.amazonaws.com/ChatGPT+Image+Aug+22%2C+2026%2C+11_45_39+AM.jpg",
    caption: "Isolation breeds addiction. We break the cycle not with automated text alerts, but with rigorous, real-world human presence. We show up, stand by them, and rebuild their discipline."
  },
  {
    id: 19,
    title: "REBUILDING NEIGHBORHOODS",
    location: "Sector 19 // Grassroots Core",
    category: "Empowerment",
    url: "https://pnuema-optimizzed-images.s3.eu-north-1.amazonaws.com/ChatGPT+Image+Aug+22%2C+2026%2C+11_42_55+AM.jpg",
    caption: "Institutions have abandoned these communities. We give them the tools to feed, heal, and govern themselves so they never have to beg a corrupt system for survival again."
  },
  {
    id: 20,
    title: "OUR SACRED PROMISE",
    location: "Sector 20 // Omega Node",
    category: "Mission Absolute",
    url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop",
    caption: "This is our absolute covenant. We will not compromise. We will not back down. We stand permanently with those who are forced to suffer in silence, until the suffering ends."
  }
];

