import medical_vangaurd from "../../../assets/Hero/Global Medical Vangud Image Aug 28, 2026, 07_58_28 AM.jpg"
import Humanitarian_relief from "../../../assets/Hero/Humanitarian Relief Network  Aug 28, 2026, 07_56_13 AM.jpg"
import FrontLineTraig from "../../../assets/Hero/FrontLine Triage Operation  Image Aug 22, 2026, 11_44_01 AM.jpg"
import Breathing_Life_Into_Hell from "../../../assets/OutPost/Breathing Life Into Hell.jpg"
import Love_As_A_Phsical_Address from "../../../assets/OutPost/Love Has a Physical Address.jpg"
import Speaking_Hope_To_The_Trenches from "../../../assets/OutPost/Speaking Hope to the trenches.jpg"
import The_Life_Line_In_The_Dark from "../../../assets/OutPost/The LigeLine in the dark.jpg"

import Radical_Infrastructure from "../../../assets/Who are we/Radical Infracture  Image Aug 25, 2026, 08_22_58 AM.jpg"
import The_Addictions from "../../../assets/Who are we/The Addictions Image Aug 25, 2026, 08_22_42 AM.jpg"
import The_Forgotten from "../../../assets/Who are we/The Forgotten  Image Aug 25, 2026, 08_22_50 AM.jpg"
import The_War_Zones from "../../../assets/Who are we/War Zone  Image Aug 24, 2026, 05_32_09 PM.jpg"
import Shadowed_Nations from "../../../assets/The Problem/Shadowed NationImage Aug 24, 2026, 06_08_21 PM.jpg"
import Price_Of_Survival from "../../../assets/The Problem/Price of SurvivalChatGPT Image Aug 25, 2026, 08_01_52 AM.jpg"
import The_Cold_Machine from "../../../assets/The Problem/The Cold MachineChatGPT Image Aug 25, 2026, 08_04_45 AM.jpg"
import The_Ghost_Channels from "../../../assets/The Problem/Ghost Chanelling  Image Aug 25, 2026, 08_03_17 AM.jpg"
import Immediate_Surgery_Funding from "../../../assets/The Solution/Immediate Surgery Funding Image Aug 25, 2026, 08_16_31 AM (1).jpg"
import Boots_On_The_Ground from "../../../assets/The Solution/Boots on the Ground image_f4ffbd55.jpg"
import Recovery_Through_Presence from "../../../assets/The Solution/Recovery Through Presence _br1y4mbr1y4mbr1y (2).jpg"
import Rebuilding_Neighborhoods from "../../../assets/The Solution/Rebuilding Neighborhood Gemini_Generated_Image_br1y4mbr1y4mbr1y.jpg"
import Our_Sacred_Promise from "../../../assets/The Solution/Our Sacred Promise Image_br1y4mbr1y4mbr1y (1).jpg"

export interface PneumaImage {
  id: number;
  title: string;
  location: string;
  category: string;
  url: string;
  caption: string;
  isPriority?: boolean; // Flag to indicate above-the-fold assets
}

export const PNEUMA_IMAGES: PneumaImage[] = [
  // --- Hero Section (1 - 3) ---
  {
    id: 1,
    title: "Global Medical Vanguard",
    location: "Sector 01 // Field Response HQ",
    category: "Vanguard",
    url: FrontLineTraig,
    caption: "We didn’t build this to escape the world. We built it to remember what it feels like to live in it unmasked, unfiltered, and wide awake.",
    isPriority: true,
  },
  {
    id: 2,
    title: "Humanitarian Relief Network",
    location: "Sector 02 // Global Aid Grid",
    category: "Vanguard",
    url: medical_vangaurd,
    caption: "The old systems were designed to contain us. The next iteration is built to expand us—turning raw noise into crystal-clear intent.",
    isPriority: true,
  },
  {
    id: 3,
    title: "Frontline Triage Operations",
    location: "Sector 03 // Active Stabilization",
    category: "Vanguard",
    url: Humanitarian_relief,
    caption: "Evolution isn't a destination; it's a constant recalibration. Stand at the edge, look forward, and build the reality you refuse to wait for.",
    isPriority: true,
  },

  // --- Rural Collapse / Outposts (4 - 7) ---
  {
    id: 4,
    title: "BREATHING LIFE INTO HELL",
    location: "Sector 01 // Frontline Shockwaves",
    category: "The Rescue",
    url: Breathing_Life_Into_Hell,
    caption: "Where roads are blown apart and empires withdraw, we drop from the sky. We pitch shelters in the dirt, switch on the lights, and establish a sanctuary of absolute survival in the dark."
  },
  {
    id: 5,
    title: "THE LIFELINE IN THE DARK",
    location: "Sector 02 // Voice of the Network",
    category: "The Rescue",
    url: The_Life_Line_In_The_Dark,
    caption: "Isolation is a death sentence. Our operators sit on the edge of crisis zones, answering the midnight cries of the forgotten, routing blood, food, and hope to families trapped behind enemy lines."
  },
  {
    id: 6,
    title: "SPEAKING HOPE TO THE TRENCHES",
    location: "Sector 03 // Grassroots Truth",
    category: "The Rescue",
    url: Speaking_Hope_To_The_Trenches,
    caption: "We do not lead from corporate boardrooms. We stand under thatched roofs with rural elders, uniting communities to reclaim their dignity and rise against the corruption that left them to die."
  },
  {
    id: 7,
    title: "LOVE HAS A PHYSICAL ADDRESS",
    location: "Sector 04 // Hand-To-Hand Covenant",
    category: "The Rescue",
    url: Love_As_A_Phsical_Address,
    caption: "Faith without works is dead. We look our brothers and sisters in the eye, smile, and place raw medical and food aid directly into their hands. No paperwork. No red tape. Just pure compassion."
  },

  // --- Who Are We / Mission (IDs 8 - 11) ---
  {
    id: 8,
    title: "THE RADICAL INFRASTRUCTURE",
    location: "Sector 11 // Our Covenant",
    category: "Global Sanctuary",
    url: Radical_Infrastructure,
    caption: "This is more than an app. This is a decentralized hospital without walls, driven by the fierce urgency of now. Love is our only infrastructure."
  },
  {
    id: 9,
    title: "THE ADDICTIONS",
    location: "Sector 09 // Human Dignity",
    category: "Behavioral Rescue",
    url: The_Addictions,
    caption: "Dependency is not a crime; it is a soul crying out in the dark. We stand in the trenches of isolation, offering radical, unjudgmental love to pull our people back to the light."
  },
  {
    id: 10,
    title: "THE FORGOTTEN",
    location: "Sector 10 // Grassroots Support",
    category: "Community Power",
    url: The_Forgotten,
    caption: "Poverty should never be a death sentence. We tear down artificial borders to bring world-class care to communities left behind by institutional neglect."
  },
  {
    id: 11,
    title: "THE WAR ZONES",
    location: "Sector 08 // Emergency Relief",
    category: "Medical Sanctuary",
    url: The_War_Zones,
    caption: "Where bombs shatter families, we do not look away. We deliver immediate medical sanctuary directly to bloodied soil. Because a child in a conflict zone deserves a tomorrow."
  },

  // --- Problem Section / The Human Crisis (IDs 12 - 15) ---
  {
    id: 12,
    title: "THE SHADOWED NATIONS",
    location: "Sector 14 // Broken Boundaries",
    category: "Crisis",
    url: Shadowed_Nations,
    caption: "From space, our world looks glowing and hyper-connected. On the ground, entire neighborhoods are plunged into total medical darkness—walled off by checkpoints, trapped under bombs, left to heal their own wounds."
  },
  {
    id: 13,
    title: "THE PRICE OF SURVIVAL",
    location: "Sector 13 // The Ledger of Indifference",
    category: "Crisis",
    url: Price_Of_Survival,
    caption: "A child’s heartbeat should never depend on a financial budget. While modern medicine counts the cost of a single syringe, a brother falls deeper into the trenches of addiction, forgotten by an advanced world."
  },
  {
    id: 14,
    title: "THE COLD MACHINE",
    location: "Sector 12 // The Bureaucratic Silent Desert",
    category: "Crisis",
    url: The_Cold_Machine,
    caption: "We sit in comfortable, air-conditioned rooms, staring at data streams while flesh-and-blood human beings scream for a doctor in the dirt. We have commodified the crisis, turning agony into analytical reports."
  },
  {
    id: 15,
    title: "THE GHOST CHANNELS",
    location: "Sector 15 // The Code of Neglect",
    category: "Crisis",
    url: The_Ghost_Channels,
    caption: "We have reduced breathing souls into cold digital entries on a screen. A spreadsheet cannot stem the bleeding. While red tape holds back supplies, vulnerable people slip away in silence, waiting for aid that never leaves the laboratory."
  },

  // --- Solution Section / Direct Intervention (IDs 16 - 20) ---
  {
    id: 16,
    title: "IMMEDIATE SURGERY FUNDING",
    location: "Sector 16 // Emergency Relief",
    category: "Medical Action",
    url: Immediate_Surgery_Funding,
    caption: "We destroy hospital red tape. When a life hangs in the balance, we clear the debt and fund the surgery instantly. Money will never be the reason someone dies on our watch."
  },
  {
    id: 17,
    title: "BOOTS ON THE GROUND",
    location: "Sector 17 // Field Operations",
    category: "Community Aid",
    url: Boots_On_The_Ground,
    caption: "We do not coordinate from a safe distance. Our teams physically enter vulnerable neighborhoods to deliver food, medicine, and critical supplies directly into the hands of those who need them."
  },
  {
    id: 18,
    title: "RECOVERY THROUGH PRESENCE",
    location: "Sector 18 // Recovery Node",
    category: "Human Rescue",
    url: Recovery_Through_Presence,
    caption: "Isolation breeds addiction. We break the cycle not with automated text alerts, but with rigorous, real-world human presence. We show up, stand by them, and rebuild their discipline."
  },
  {
    id: 19,
    title: "REBUILDING NEIGHBORHOODS",
    location: "Sector 19 // Grassroots Core",
    category: "Empowerment",
    url: Rebuilding_Neighborhoods,
    caption: "Institutions have abandoned these communities. We give them the tools to feed, heal, and govern themselves so they never have to beg a corrupt system for survival again."
  },
  {
    id: 20,
    title: "OUR SACRED PROMISE",
    location: "Sector 20 // Omega Node",
    category: "Mission Absolute",
    url: Our_Sacred_Promise,
    caption: "This is our absolute covenant. We will not compromise. We will not back down. We stand permanently with those who are forced to suffer in silence, until the suffering ends."
  }
];

/**
 * Ensures priority assets are cached before mounting main view elements.
 * Works seamlessly alongside native HTML head preloads.
 */
export const preloadPriorityImages = (): Promise<void[]> => {
  const priorityImages = PNEUMA_IMAGES.filter((img) => img.isPriority);
  const promises = priorityImages.map((img) => {
    return new Promise<void>((resolve) => {
      const imageInstance = new Image();
      imageInstance.src = img.url;
      imageInstance.onload = () => resolve();
      imageInstance.onerror = () => resolve();
    });
  });
  return Promise.all(promises);
};