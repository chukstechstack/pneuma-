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
    title: "Rapid Air-Support & Field Triage",
    location: "Sector 01 // Air-Bridge Corridor",
    category: "Outposts",
    url: "https://pneuma-public-assets.s3.eu-north-1.amazonaws.com/OutPost/ChatGPT+Image+Aug+22%2C+2026%2C+01_46_51+PM.jpg",
    caption: "Emergency medical transport units deploying tents and stabilization gear directly into isolated collapse zones where ground routes are impassable."
  },
  {
    id: 5,
    title: "Secure Comms & Live Dispatch",
    location: "Sector 02 // Command Outpost",
    category: "Outposts",
    url: "https://pneuma-public-assets.s3.eu-north-1.amazonaws.com/OutPost/ChatGPT+Image+Aug+22%2C+2026%2C+01_47_01+PM.jpg",
    caption: "Field operators monitoring live telemetry, verifying coordinates, and routing real-time supply requests to active ground teams."
  },
  {
    id: 6,
    title: "Operational Briefing & Protocol",
    location: "Sector 03 // Headquarters Node",
    category: "Outposts",
    url: "https://pneuma-public-assets.s3.eu-north-1.amazonaws.com/OutPost/ChatGPT+Image+Aug+22%2C+2026%2C+01_48_19+PM+(1).jpg",
    caption: "Direct briefing on Pneuma’s operational standards, focusing on transparency, frontline accountability, and decentralized coordination."
  },
  {
    id: 7,
    title: "Direct-Action Palliative Distribution",
    location: "Sector 04 // Community Grid",
    category: "Outposts",
    url: "https://pneuma-public-assets.s3.eu-north-1.amazonaws.com/OutPost/ChatGPT+Image+Aug+22%2C+2026%2C+01_58_58+PM.jpg",
    caption: "Unfiltered delivery of emergency medical palliatives and essential provisions directly to community members, bypassing institutional red tape."
  },

  // --- Who Are We / Mission (Indices 7 - 11) ---
{
    id: 8,
    title: "The Restoration of Agency",
    location: "Sector 08 // Grassroots Support",
    category: "Grassroots Support",
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop",
    caption: "Rebuilding fractured local bonds and empowering grassroots populations to stand resilient against systemic neglect."
  },
  {
    id: 9,
    title: "The Reclaiming of Humanity",
    location: "Sector 09 // Core Mission",
    category: "Core Mission",
    url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1600&auto=format&fit=crop",
    caption: "Rejecting digital isolation and commercial apathy to restore genuine human empathy, dignity, and shared presence."
  },
  {
    id: 10,
    title: "The Eradication of Silence",
    location: "Sector 10 // Medical Relief",
    category: "Medical Relief",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
    caption: "Bypassing institutional red tape to deliver life-saving financial relief and medical palliatives to those suffering in the dark."
  },
  {
    id: 11,
    title: "The Illumination of the Lost",
    location: "Sector 11 // Behavioral Recovery",
    category: "Behavioral Recovery",
    url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1600&auto=format&fit=crop",
    caption: "Guiding individuals out of digital despair and destructive behavioral loops through high-friction discipline and real human rescue."
  },

// --- Problem Section  / The Human Crisis (Indices 11 - 14 / IDs 12 - 15) ---
  {
    id: 12,
    title: "Abandoned in Hospital Wards",
    location: "Sector 12 // Medical Isolation",
    category: "Crisis",
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop",
    caption: "Thousands suffer without financial means for critical care, left trapped behind bureaucratic health barriers."
  },
  {
    id: 13,
    title: "The Digital Doom-Loop",
    location: "Sector 13 // Behavioral Trap",
    category: "Crisis",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    caption: "Addiction and isolation tearing communities apart from the inside out with no immediate rescue in sight."
  },
  {
    id: 14,
    title: "Fractured Societies",
    location: "Sector 14 // Community Collapse",
    category: "Crisis",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
    caption: "Nations and neighborhoods left stranded without boots-on-the-ground support or emergency infrastructure."
  },
  {
    id: 15,
    title: "The Silent Suffering",
    location: "Sector 15 // Systemic Neglect",
    category: "Crisis",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop",
    caption: "Vulnerable individuals slipping through the cracks of institutional apathy while waiting for help that never comes."
  },// --- Solution Section / Direct Intervention (Indices 15 - 20 / IDs 16 - 20) ---
  {
    id: 16,
    title: "Direct Medical Funding",
    location: "Sector 16 // Emergency Relief",
    category: "Medical Action",
    url: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1600&auto=format&fit=crop",
    caption: "Bypassing hospital red tape to clear financial bottlenecks and fund urgent patient care immediately."
  },
  {
    id: 17,
    title: "Boots on the Ground",
    location: "Sector 17 // Field Operations",
    category: "Community Aid",
    url: "https://pnuema-optimizzed-images.s3.eu-north-1.amazonaws.com/ChatGPT+Image+Aug+22%2C+2026%2C+11_44_01+AM.jpg",
    caption: "Delivering physical supplies, palliatives, and direct support straight to vulnerable neighborhoods."
  },
  {
    id: 18,
    title: "Breaking Behavioral Loops",
    location: "Sector 18 // Recovery Node",
    category: "Human Rescue",
    url: "https://pnuema-optimizzed-images.s3.eu-north-1.amazonaws.com/ChatGPT+Image+Aug+22%2C+2026%2C+11_45_39+AM.jpg",
    caption: "Guiding individuals out of isolation and digital addiction through rigorous personal presence and discipline."
  },
  {
    id: 19,
    title: "Restoring Local Sovereignty",
    location: "Sector 19 // Grassroots Core",
    category: "Empowerment",
    url: "https://pnuema-optimizzed-images.s3.eu-north-1.amazonaws.com/ChatGPT+Image+Aug+22%2C+2026%2C+11_42_55+AM.jpg",
    caption: "Rebuilding broken societal bonds and empowering communities to stand resilient against institutional neglect."
  },
  {
    id: 20,
    title: "The Covenant of Empathy",
    location: "Sector 20 // Omega Node",
    category: "Mission Absolute",
    url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop",
    caption: "An uncompromising commitment to changing humanity and standing by those suffering in silence."
  },
];