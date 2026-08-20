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
    url:"https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1600&auto=format&fit=crop",
    caption: "Emergency medical teams deploying rapid-response care into high-impact operational zones."
  },
  {
    id: 2,
    title: "Humanitarian Relief Network",
    location: "Sector 02 // Global Aid Grid",
    category: "Vanguard",
    url: "https://images.unsplash.com/photo-1594824813578-8314545582c5?q=80&w=1600&auto=format&fit=crop",
    caption: "Physicians and coordinators uniting across borders to deliver unvarnished logistical support."
  },
  {
    id: 3,
    title: "Frontline Triage Operations",
    location: "Sector 03 // Active Stabilization",
    category: "Vanguard",
    url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1600&auto=format&fit=crop",
    caption: "Real-time clinical coordination ensuring critical care reaches vulnerable populations instantly."
  },



  // --- Rural Collapse / Outposts (3 - 6) ---
  {
    id: 4,
    title: "Abandoned Outpost Alpha",
    location: "Sector 04 // Rust Belt Divide",
    category: "Outposts",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
    caption: "Documenting structural decay and infrastructural abandonment in forgotten provincial zones."
  },
  {
    id: 5,
    title: "Forgotten Grid Point",
    location: "Sector 05 // Highland Void",
    category: "Outposts",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
    caption: "Dormant relays waiting for decentralized peer-to-peer node activation."
  },
  {
    id: 6,
    title: "Silent Horizon",
    location: "Sector 06 // Eastern Steppes",
    category: "Outposts",
    url: "https://images.unsplash.com/photo-1444703686981-a3bb64d85a62?q=80&w=1600&auto=format&fit=crop",
    caption: "Miles of uninterrupted solitude highlighting the critical need for resilient regional links."
  },
  {
    id: 7,
    title: "The Hollow Station",
    location: "Sector 07 // Southern Badlands",
    category: "Outposts",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop",
    caption: "An empty weather tracking station repurposed into a local emergency waypoint."
  },

  // --- Breaking Chains / Chronicle (7 - 10) ---
  {
    id: 8,
    title: "Breaking Behavioral Chains",
    location: "Sector 08 // Cognitive Lab",
    category: "Chronicle",
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop",
    caption: "Breaking loops of digital dependency and restructuring daily routines for hyper-focus."
  },
  {
    id: 9,
    title: "Clarity Matrix",
    location: "Sector 09 // Focus Hub",
    category: "Chronicle",
    url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1600&auto=format&fit=crop",
    caption: "Mapping out user workflows on physical boundaries to build friction against bad habits."
  },
  {
    id: 10,
    title: "The Friction Point",
    location: "Sector 10 // Discipline Core",
    category: "Chronicle",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
    caption: "Collaborative sessions focused on deep work endurance and absolute distraction control."
  },
  {
    id: 11,
    title: "Neural Realignment",
    location: "Sector 11 // Apex Terminal",
    category: "Chronicle",
    url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1600&auto=format&fit=crop",
    caption: "Executing rigid block timers to completely eliminate procrastination cycles."
  },

  // --- Emergency Triage (11 - 14) ---
  {
    id: 12,
    title: "Emergency Telemetry Node",
    location: "Sector 12 // Central Command",
    category: "Triage",
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop",
    caption: "Instant alert dispatch protocols designed for high-stress operational breakdowns."
  },
  {
    id: 13,
    title: "Red Alert Protocol",
    location: "Sector 13 // Watchtower Beta",
    category: "Triage",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    caption: "Real-time anomaly detection flagging sudden spikes in local system latency."
  },
  {
    id: 14,
    title: "Crisis Response Unit",
    location: "Sector 14 // Rapid Field",
    category: "Triage",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
    caption: "Global data stream monitoring deployed to isolate critical network failures instantly."
  },
  {
    id: 15,
    title: "System Overdrive",
    location: "Sector 15 // Core Lab",
    category: "Triage",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop",
    caption: "Pushing architecture limits to test fail-safe redundancy under heavy loads."
  },

  // --- Archival Vault / Global (15 - 19) ---
  {
    id: 16,
    title: "Vault Record 01",
    location: "Global Archive // Vault A",
    category: "Archives",
    url: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1600&auto=format&fit=crop",
    caption: "Permanent cryptographic logging of historical system states and milestones."
  },
  {
    id: 17,
    title: "Vault Record 02",
    location: "Global Archive // Vault B",
    category: "Archives",
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop",
    caption: "Encrypted schematic backups stored across distributed node clusters."
  },
  {
    id: 18,
    title: "Vault Record 03",
    location: "Global Archive // Vault C",
    category: "Archives",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
    caption: "Visualized data flow representations from early network iterations."
  },
  {
    id: 19,
    title: "Vault Record 04",
    location: "Global Archive // Vault D",
    category: "Archives",
    url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1600&auto=format&fit=crop",
    caption: "Deep analytical snapshots capturing operator engagement and telemetry logs."
  },
  {
    id: 20,
    title: "The Final Ledger",
    location: "Global Archive // Omega Node",
    category: "Archives",
    url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop",
    caption: "The ultimate compendium record sealing the 2026 operational phase."
  }
];