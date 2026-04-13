/* eslint-disable */
import { useState, useEffect } from "react";

// ── DESIGN SYSTEM ─────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── LIGHT MODE (default) ── */
  :root {
    --cream: #F5F0E8;
    --ink:   #0E0E0E;
    --warm:  #1A1410;
    --gold:  #C8963E;
    --rust:  #C44B2B;
    --sage:  #4A6741;
    --slate: #3D4B5C;
    --muted: #8A8070;
    --line:  #D8D0C0;
    --surface: #FFFFFF;
    --surface2: #F5F0E8;
  }

  /* ── DARK MODE ── */
  :root.dark {
    --cream: #141210;
    --ink:   #F0EBE0;
    --warm:  #1E1A16;
    --gold:  #D4A055;
    --rust:  #D4614A;
    --sage:  #6A9B60;
    --slate: #6B8FAD;
    --muted: #7A7060;
    --line:  #2E2A24;
    --surface: #1C1814;
    --surface2: #141210;
  }

  body { background: var(--cream); color: var(--ink); font-family: 'DM Sans', sans-serif; transition: background .25s ease, color .25s ease; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: var(--line); }
  ::selection { background: var(--gold); color: #fff; }
  input, textarea, select { font-family: 'DM Sans', sans-serif; }

  @keyframes fadeIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pop     { 0%{transform:scale(.95)}60%{transform:scale(1.02)}100%{transform:scale(1)} }

  .fade-in  { animation: fadeIn  .4s ease both; }
  .slide-up { animation: slideUp .5s cubic-bezier(.2,.8,.3,1) both; }

  .event-card { transition: box-shadow .2s ease, transform .2s ease; }
  .event-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(14,14,14,.1); }

  .tag {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: .08em; text-transform: uppercase;
    padding: 3px 8px; border-radius: 2px;
  }

  /* Mobile touch targets */
  button, a[role="button"] { -webkit-tap-highlight-color: transparent; }
  button { touch-action: manipulation; }

  /* Modals scroll nicely on iPhone */
  .modal-scroll { -webkit-overflow-scrolling: touch; }
`;

// ── SVG ICONS ────────────────────────────────────────────────────────
const Icon = ({ name, size=16, color="currentColor", style={} }) => {
  const s = { width:size, height:size, display:"inline-block", flexShrink:0, ...style };
  const paths = {
    bell:       <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    bellOff:    <><path d="M8.56 2.9A6 6 0 0 1 18 8c0 7 2 9 2 9H4.81"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><line x1="2" y1="2" x2="22" y2="22"/></>,
    map:        <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    calendar:   <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    share:      <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>,
    plus:       <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    check:      <><polyline points="20 6 9 17 4 12"/></>,
    circle:     <><circle cx="12" cy="12" r="10"/></>,
    x:          <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    ticket:     <><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></>,
    send:       <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    chevronDown:<><polyline points="6 9 12 15 18 9"/></>,
    chevronUp:  <><polyline points="18 15 12 9 6 15"/></>,
    externalLink:<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
    message:    <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    sun:        <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    moon:       <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" style={s}>
      {paths[name]}
    </svg>
  );
};

// ── IMAGE FETCH ─────────────────────────────────────────────────────────
async function fetchEventImage(title, venue) {
  // Try Wikipedia first using event title
  try {
    const query = encodeURIComponent(title + " performance");
    const search = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&srlimit=2&format=json&origin=*`
    );
    if (search.ok) {
      const sd = await search.json();
      const hit = sd.query?.search?.[0];
      if (hit) {
        const sum = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(hit.title)}`
        );
        if (sum.ok) {
          const sj = await sum.json();
          const img = sj.thumbnail?.source;
          if (img) return img;
        }
      }
    }
  } catch {}
  // Fallback: try the venue name
  try {
    const vquery = encodeURIComponent(venue + " New York");
    const vsearch = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${vquery}&srlimit=1&format=json&origin=*`
    );
    if (vsearch.ok) {
      const vsd = await vsearch.json();
      const vhit = vsd.query?.search?.[0];
      if (vhit) {
        const vsum = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(vhit.title)}`
        );
        if (vsum.ok) {
          const vsj = await vsum.json();
          const img = vsj.thumbnail?.source;
          if (img) return img;
        }
      }
    }
  } catch {}
  return null;
}

// ── FETCH UPCOMING EVENTS FOR A VENUE ───────────────────────────────────
async function fetchVenueEvents(venue) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1200,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content:
          `Search the web for upcoming performances and events at "${venue.name}" in New York City in 2025 and 2026. ` +
          `Find real, confirmed upcoming events with actual dates. Today is ${today}. ` +
          `Return JSON only — no markdown, no explanation. ` +
          `Return an array of up to 6 upcoming events: ` +
          `[{"title":"event title","date":"YYYY-MM-DD","time":"e.g. 7:30 PM","price":"e.g. $20–$60","category":"Dance|Theater|Opera|Music|Performance Art|Film|Exhibition","blurb":"2 sentence description","url":"direct ticket or event link"}] ` +
          `Only include events with real confirmed dates after ${today}. If none found, return [].`
        }]
      })
    });
    if (!res.ok) return [];
    const data = await res.json();
    const text = (data.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text).join("").trim();
    const clean = text.replace(/```json|```/g, "").trim();
    const match = clean.match(/\[[\s\S]*\]/);
    if (!match) return [];
    const parsed = JSON.parse(match[0]);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

// ── FETCH BLURB FROM URL ────────────────────────────────────────────────
async function fetchBlurbFromUrl(url) {
  if (!url || !url.startsWith("http")) return null;
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content:
          `Visit this URL and return a 2-3 sentence description of the event: ${url}
Return ONLY the description text, no markdown, no preamble.
If you cannot access it, return null.` }]
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = (data.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text).join("").trim();
    if (!text || text.toLowerCase().includes("null")) return null;
    // Clean up — remove any leading/trailing quotes
    return text.replace(/^["']|["']$/g, "").trim();
  } catch { return null; }
}

// ── CATEGORIES ────────────────────────────────────────────────────────
const CATS = ["All","Dance","Theater","Opera","Music","Performance Art","Film","Exhibition"];
const CAT_COLOR = {
  Dance:           { bg:"#EAF0E8", text:"#4A6741" },
  Theater:         { bg:"#F0EAE8", text:"#8B3A2A" },
  Opera:           { bg:"#EAE8F0", text:"#3D3A8B" },
  Music:           { bg:"#F0EDE8", text:"#7A5C2A" },
  "Performance Art":{ bg:"#EAF0EE", text:"#2A6B5A" },
  Film:            { bg:"#F0EAF0", text:"#6B2A6B" },
  Exhibition:      { bg:"#EEF0EA", text:"#4A5C2A" },
};

// ── VENUES ────────────────────────────────────────────────────────────
const VENUES = [
  "BAM (Brooklyn Academy of Music)",
  "Lincoln Center",
  "The Joyce Theater",
  "St. Ann's Warehouse",
  "New York City Center",
  "Metropolitan Opera",
  "New York Live Arts",
  "Baryshnikov Arts Center",
  "NYU Skirball Center",
  "The Public Theater",
  "Pioneer Works",
  "National Sawdust",
  "Carnegie Hall",
  "L'Alliance New York",
  "Amant",
  "Other",
];

// ── SEED EVENTS ───────────────────────────────────────────────────────
const SEED_EVENTS = [
  // ── JOYCE THEATER ──────────────────────────────────────────────────
  {
    id:"j1", title:"Gibney Company", venue:"The Joyce Theater", category:"Dance",
    date:"2026-04-12", time:"7:30 PM", price:"$10–$55",
    blurb:"A dynamic program featuring a world premiere by Jawole Willa Jo Zollar, Lucinda Childs' luminous Canto Ostinato, and Medhi Walerski's evocative Silent Tides. One of NYC's most rigorous companies.",
    url:"https://www.joyce.org/performances", addedBy:"system", going:[], interested:[],
  },
  {
    id:"j2", title:"Flamenco Vivo: QUINTO ELEMENTO", venue:"The Joyce Theater", category:"Dance",
    date:"2026-04-21", time:"7:30 PM", price:"$10–$55",
    blurb:"Patricia Guerrero's electrifying journey through flamenco's essence and its mysterious fifth element. Fearless, physical, and unlike anything else at the Joyce this season.",
    url:"https://www.joyce.org/performances", addedBy:"system", going:[], interested:[],
  },
  {
    id:"j3", title:"Parsons Dance", venue:"The Joyce Theater", category:"Dance",
    date:"2026-04-29", time:"7:30 PM", price:"$10–$55",
    blurb:"Two world premieres, a new commission, and the return of beloved favorites Caught and Nascimento Novo. Parsons at their most joyful and athletic.",
    url:"https://shop.joyce.org/8425/8432", addedBy:"system", going:[], interested:[],
  },
  {
    id:"j4", title:"ABT Studio Company", venue:"The Joyce Theater", category:"Dance",
    date:"2026-05-13", time:"7:30 PM", price:"$10–$55",
    blurb:"Ballet's rising stars in a dazzling program of New York premieres, contemporary favorites, and virtuosic classical selections. American Ballet Theatre's next generation on the intimate Joyce stage.",
    url:"https://www.joyce.org/performances", addedBy:"system", going:[], interested:[],
  },
  {
    id:"j5", title:"Tap City Festival", venue:"The Joyce Theater", category:"Dance",
    date:"2026-06-15", time:"7:30 PM", price:"$10–$55",
    blurb:"Master hoofers and rising talent for an exhilarating celebration of tap's legacy — classic revivals, world premieres, live music, and rare archival footage.",
    url:"https://www.joyce.org/performances", addedBy:"system", going:[], interested:[],
  },
  {
    id:"j6", title:"Step Afrika!: The Migration", venue:"The Joyce Theater", category:"Dance",
    date:"2026-06-10", time:"7:30 PM", price:"$10–$55",
    blurb:"Step Afrika! transforms Jacob Lawrence's The Migration Series into a powerful fusion of percussive dance, history and visual storytelling honoring a defining American journey.",
    url:"https://www.joyce.org/performances", addedBy:"system", going:[], interested:[],
  },
  {
    id:"j7", title:"Ballet Festival curated by Misty Copeland", venue:"The Joyce Theater", category:"Dance",
    date:"2026-08-04", time:"7:30 PM", price:"$15–$65",
    blurb:"Curated by Misty Copeland herself, this festival gathers world-class dancers and visionary creators shaping ballet's future. An unmissable summer event.",
    url:"https://www.joyce.org/performances", addedBy:"system", going:[], interested:[],
  },
  {
    id:"j8", title:"Mark Morris: Dances to American Music", venue:"The Joyce Theater", category:"Dance",
    date:"2026-07-14", time:"7:30 PM", price:"$10–$65",
    blurb:"Mark Morris Dance Group illuminates America's musical landscape with three programs set to jazz innovators, West Coast mavericks, and country legends.",
    url:"https://www.joyce.org/performances", addedBy:"system", going:[], interested:[],
  },

  // ── BAM ──────────────────────────────────────────────────────────────
  {
    id:"b1", title:"Natalia Lafourcade: Cancionera Tour", venue:"BAM (Brooklyn Academy of Music)", category:"Music",
    date:"2026-04-10", time:"8:00 PM", price:"$45–$95",
    blurb:"Mexican singer-songwriter Natalia Lafourcade gets back to basics — stripping down her beloved traditional Latin idioms for an intimate, acoustic evening at the Howard Gilman Opera House.",
    url:"https://www.bam.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"b2", title:"Hamlet — National Theatre London", venue:"BAM (Brooklyn Academy of Music)", category:"Theater",
    date:"2026-04-19", time:"7:30 PM", price:"$30–$120",
    blurb:"Director Robert Hastie's witty, fearlessly contemporary Hamlet stars Hiran Abeysekera. Kicking off an ongoing partnership between BAM and London's National Theatre. Four weeks only.",
    url:"https://www.bam.org/hamlet", addedBy:"system", going:[], interested:[],
  },
  {
    id:"b3", title:"Moby Dick — Robert Wilson & Anna Calvi", venue:"BAM (Brooklyn Academy of Music)", category:"Performance Art",
    date:"2026-04-29", time:"7:30 PM", price:"$35–$130",
    blurb:"Melville's epic tale reimagined by the late, great Robert Wilson — tart dialogue meets indie-rock songs by Anna Calvi. Düsseldorfer Schauspielhaus on the BAM stage. A once-in-a-decade event.",
    url:"https://www.bam.org/moby-dick", addedBy:"system", going:[], interested:[],
  },
  {
    id:"b4", title:"Long Play Festival 2026", venue:"BAM (Brooklyn Academy of Music)", category:"Music",
    date:"2026-04-30", time:"7:00 PM", price:"$20–$60",
    blurb:"Bang on a Can's boundary-breaking festival returns to BAM, featuring a Steve Reich marathon celebrating his 90th birthday. Over 50 concerts across three days of new music in downtown Brooklyn.",
    url:"https://www.bam.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"b5", title:"DanceAfrica 2026 — Uganda", venue:"BAM (Brooklyn Academy of Music)", category:"Dance",
    date:"2026-05-22", time:"7:00 PM", price:"$25–$75",
    blurb:"The nation's largest African dance festival returns for its 49th year. Uganda's Ndere Troupe headlines for the first time since 2007, alongside Asase Yaa African American Dance Theater. Outdoor bazaar May 23–25.",
    url:"https://www.bam.org/programs", addedBy:"system", going:[], interested:[],
  },
  {
    id:"b6", title:"Alvin Ailey American Dance Theater", venue:"BAM (Brooklyn Academy of Music)", category:"Dance",
    date:"2026-06-04", time:"7:30 PM", price:"$35–$110",
    blurb:"Ailey returns to BAM with a celebration of joy, beauty, and the transformative power of dance under new Artistic Director Alicia Graf Mack. Including Revelations, the company's eternal masterwork.",
    url:"https://www.bam.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"b7", title:"Everybooty: BAM Pride", venue:"BAM (Brooklyn Academy of Music)", category:"Performance Art",
    date:"2026-06-20", time:"8:00 PM", price:"$20–$50",
    blurb:"BAM's multi-genre, all-gender celebration of queer culture returns for Pride Month. Music, dance, performance and community on the BAM stage — one of Brooklyn's most exuberant evenings of the year.",
    url:"https://www.bam.org", addedBy:"system", going:[], interested:[],
  },

  // ── ST. ANN'S WAREHOUSE ───────────────────────────────────────────────
  {
    id:"s1", title:"Scorched Earth — Luke Murphy", venue:"St. Ann's Warehouse", category:"Theater",
    date:"2026-04-07", time:"7:30 PM", price:"$35–$90",
    blurb:"Set in a small Irish village, a detective reopens a cold case 12 years on — descending into memory, fantasy, and resentment. Luke Murphy's US premiere blurs dance and theater. Inspired by John B. Keane's The Field.",
    url:"https://stannswarehouse.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"s2", title:"The Maids — Jean Genet", venue:"St. Ann's Warehouse", category:"Theater",
    date:"2026-05-17", time:"7:30 PM", price:"$35–$90",
    blurb:"Genet's savage masterwork of role-play, class, and desire returns to St. Ann's. A visceral production from one of international theater's most daring companies.",
    url:"https://stannswarehouse.org", addedBy:"system", going:[], interested:[],
  },

  // ── LINCOLN CENTER / NYCB ─────────────────────────────────────────────
  {
    id:"lc1", title:"New York City Ballet Spring Season", venue:"Lincoln Center", category:"Dance",
    date:"2026-04-21", time:"7:30 PM", price:"$30–$175",
    blurb:"World premieres by Justin Peck and Alexei Ratmansky headline NYCB's spring season. Principal Dancer Megan Fairchild takes her final bow on May 24 in Coppélia — a historic farewell performance.",
    url:"https://www.nycballet.com/season-and-tickets/calendar", addedBy:"system", going:[], interested:[],
  },
  {
    id:"lc2", title:"American Songbook: Echoes of an Inheritance", venue:"Lincoln Center", category:"Music",
    date:"2026-04-15", time:"8:00 PM", price:"$25–$85",
    blurb:"Curated by Clint Ramos, this genre-crossing series brings musical theater performances and powerhouse concerts to Lincoln Center through May 23. Where Broadway meets the avant-garde.",
    url:"https://www.lincolncenter.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"lc3", title:"Diva Factory", venue:"Lincoln Center", category:"Opera",
    date:"2026-04-18", time:"8:00 PM", price:"$25–$85",
    blurb:"A daring collision of opera and American house music — Diva Factory dismantles the boundaries of genre and brings exalted voices directly onto the people's dance floor. Not your grandmother's opera night.",
    url:"https://www.lincolncenter.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"lc4", title:"Megan Fairchild Farewell: Coppélia", venue:"Lincoln Center", category:"Dance",
    date:"2026-05-24", time:"7:30 PM", price:"$30–$175",
    blurb:"Principal Dancer Megan Fairchild takes her final bow after 25 years with NYCB — in the role of Swanhilda in Coppélia. A once-in-a-generation farewell not to be missed.",
    url:"https://www.nycballet.com/season-and-tickets/calendar", addedBy:"system", going:[], interested:[],
  },

  // ── NEW YORK LIVE ARTS ────────────────────────────────────────────────
  {
    id:"nyla1", title:"CLYMOVE: 6th Anniversary Season", venue:"New York Live Arts", category:"Dance",
    date:"2026-04-09", time:"7:30 PM", price:"$15–$35",
    blurb:"CLYMOVE's three-day anniversary celebration at New York Live Arts — honoring six years of bold artistry, community building, and creative risk-taking. One of Chelsea's most exciting independent companies.",
    url:"https://newyorklivearts.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"nyla2", title:"Ariel Rivka Dance: Spring Season", venue:"New York Live Arts", category:"Dance",
    date:"2026-04-22", time:"7:30 PM", price:"$15–$35",
    blurb:"A cathartic journey through identity, authenticity, and the courage it takes to be seen. Three works performed to original live music, each score performed by its composer. Intimate and powerful.",
    url:"https://newyorklivearts.org", addedBy:"system", going:[], interested:[],
  },
  // ── METROPOLITAN OPERA ───────────────────────────────────────────────
  {
    id:"mo1", title:"La Bohème", venue:"Metropolitan Opera", category:"Opera",
    date:"2026-04-13", time:"7:30 PM", price:"$25–$385",
    blurb:"Puccini's most beloved opera returns in Franco Zeffirelli's picture-perfect production. Two star-studded casts conducted by Roberto Kalb and Karel Mark Chichon — the world's most popular opera at the world's greatest opera house.",
    url:"https://www.metopera.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"mo2", title:"Innocence — Saariaho (Met Premiere)", venue:"Metropolitan Opera", category:"Opera",
    date:"2026-04-14", time:"7:30 PM", price:"$25–$385",
    blurb:"The final opera by the late Finnish composer Kaija Saariaho makes its Met premiere. A devastating meditation on grief and memory, set in a wedding where strangers share a hidden past. A landmark modern work.",
    url:"https://www.metopera.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"mo3", title:"El Último Sueño de Frida y Diego — World Premiere", venue:"Metropolitan Opera", category:"Opera",
    date:"2026-05-02", time:"7:30 PM", price:"$25–$385",
    blurb:"Gabriela Lena Frank's world premiere opera — a magical-realist portrait of Frida Kahlo and Diego Rivera. Isabel Leonard and Carlos Álvarez star, with Music Director Yannick Nézet-Séguin conducting. A historic Met debut.",
    url:"https://www.metopera.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"mo4", title:"The Last Ship — Sting", venue:"Metropolitan Opera", category:"Music",
    date:"2026-05-15", time:"7:30 PM", price:"$25–$385",
    blurb:"Written, composed, and starring Sting himself. This musical inspired by his childhood in a shipbuilding community features new and revised songs and a new book by Barney Norris. A rare Met crossover event.",
    url:"https://www.metopera.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"mo5", title:"Eugene Onegin — Tchaikovsky", venue:"Metropolitan Opera", category:"Opera",
    date:"2026-05-20", time:"7:30 PM", price:"$25–$385",
    blurb:"Asmik Grigorian returns to the Met as Tatiana, the lovestruck young heroine in Tchaikovsky's ardent adaptation of Pushkin. Iurii Samoilov as the urbane Onegin. Timur Zangiev conducts.",
    url:"https://www.metopera.org", addedBy:"system", going:[], interested:[],
  },

  // ── NEW YORK CITY CENTER ──────────────────────────────────────────────
  {
    id:"nycc1", title:"Martha Graham Centennial — Night Journey & Appalachian Spring", venue:"New York City Center", category:"Dance",
    date:"2026-04-09", time:"7:30 PM", price:"$30–$125",
    blurb:"The oldest working dance company in the US celebrates 100 years with five unmissable performances. Three Graham masterworks with iconic Isamu Noguchi stage designs, plus new works by Jamar Roberts and Baye & Asa. Live music by the Mannes Orchestra.",
    url:"https://www.nycitycenter.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"nycc2", title:"Dance Theatre of Harlem — Firebird", venue:"New York City Center", category:"Dance",
    date:"2026-04-16", time:"7:30 PM", price:"$30–$125",
    blurb:"DTH's iconic Caribbean Firebird — Geoffrey Holder's stunning sets and costumes with the Gateways Festival Orchestra conducted live. Celebrating 57 years of trailblazing artistry alongside new works by Robert Garland and William Forsythe.",
    url:"https://www.nycitycenter.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"nycc3", title:"Ballet Hispánico", venue:"New York City Center", category:"Dance",
    date:"2026-04-23", time:"7:30 PM", price:"$30–$125",
    blurb:"Four works exploring what shapes the way we move through the world — a contemporary Antigone, rhythm-driven Brazilian movement, reimagined flamenco, and a work built on memory and change. Works devoted to women choreographers.",
    url:"https://www.nycitycenter.org", addedBy:"system", going:[], interested:[],
  },

  // ── BARYSHNIKOV ARTS ─────────────────────────────────────────────────
  {
    id:"bac1", title:"Fiesta Flamenca", venue:"Baryshnikov Arts Center", category:"Dance",
    date:"2026-05-08", time:"7:30 PM", price:"$25–$65",
    blurb:"Inspired by the origins of flamenco in café cantantes — musicians and dancers placed among the audience for an immersive evening. One of the most intimate flamenco experiences in New York City.",
    url:"https://baryshnikovarts.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"bac2", title:"Tapestries — Dance Theatre", venue:"Baryshnikov Arts Center", category:"Performance Art",
    date:"2026-05-15", time:"7:30 PM", price:"$25–$65",
    blurb:"An evening-length dance theatre piece told through the curious narrative of the Unicorn Tapestries (1495–1505) and a queer reimagining of Ukrainian folklore. Boundary-pushing work at BAC's Jerome Robbins Theater.",
    url:"https://baryshnikovarts.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"bac3", title:"Clara Yang & Xuan: Humanity & Technology", venue:"Baryshnikov Arts Center", category:"Performance Art",
    date:"2026-06-05", time:"7:30 PM", price:"$20–$55",
    blurb:"Pianist Clara Yang and visual artist Xuan combine artistic forces in a multimedia performance exploring the evolving relationship between humanity and technology. A BAC residency premiere.",
    url:"https://baryshnikovarts.org", addedBy:"system", going:[], interested:[],
  },

  // ── CARNEGIE HALL ─────────────────────────────────────────────────────
  {
    id:"ch1", title:"Met Orchestra Chamber Ensemble", venue:"Carnegie Hall", category:"Music",
    date:"2026-05-12", time:"7:30 PM", price:"$30–$120",
    blurb:"The Metropolitan Opera Orchestra's chamber ensemble performs works by Brahms, Debussy, Messiaen, Mozart, and Caroline Shaw. Yannick Nézet-Séguin conducts and performs at the piano for select concerts.",
    url:"https://www.carnegiehall.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"ch2", title:"New York Philharmonic", venue:"Carnegie Hall", category:"Music",
    date:"2026-04-22", time:"7:30 PM", price:"$30–$150",
    blurb:"The New York Philharmonic — America's oldest symphony orchestra — at Carnegie Hall. A landmark venue for one of the world's great orchestras, presenting a full season of orchestral programming through spring 2026.",
    url:"https://www.carnegiehall.org", addedBy:"system", going:[], interested:[],
  },

  // ── PUBLIC THEATER ────────────────────────────────────────────────────
  {
    id:"pub1", title:"Public Works — Free Shakespeare in the Park Preview", venue:"The Public Theater", category:"Theater",
    date:"2026-05-19", time:"7:00 PM", price:"Free",
    blurb:"The Public Theater's beloved free community theater series. Preview performances of the summer Shakespeare in the Park production before it moves to the Delacorte in Central Park. Arrive early — lines form hours ahead.",
    url:"https://publictheater.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"pub2", title:"Under the Radar Festival", venue:"The Public Theater", category:"Performance Art",
    date:"2026-06-10", time:"7:30 PM", price:"$20–$60",
    blurb:"The Public's acclaimed festival of boundary-pushing international theater and performance. New works from leading and emerging artists across downtown NYC venues, with the Public as its hub.",
    url:"https://publictheater.org", addedBy:"system", going:[], interested:[],
  },

  // ── NATIONAL SAWDUST ──────────────────────────────────────────────────
  {
    id:"ns1", title:"National Sawdust Spring Season", venue:"National Sawdust", category:"Music",
    date:"2026-04-18", time:"8:00 PM", price:"$20–$45",
    blurb:"Brooklyn's most adventurous music venue presents an evening of new and experimental music. National Sawdust champions emerging and established artists who push the boundaries of classical, jazz, and avant-garde music.",
    url:"https://nationalsawdust.org", addedBy:"system", going:[], interested:[],
  },

  // ── PIONEER WORKS ─────────────────────────────────────────────────────
  {
    id:"pw1", title:"Pioneer Works: Spectrum Series", venue:"Pioneer Works", category:"Music",
    date:"2026-04-25", time:"8:00 PM", price:"$20–$40",
    blurb:"Pioneer Works' legendary Spectrum series presents experimental and avant-garde music in their vast Red Hook warehouse space. One of Brooklyn's most beloved and eclectic music events — always sells out.",
    url:"https://pioneerworks.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"pw2", title:"Pioneer Works: Open House", venue:"Pioneer Works", category:"Exhibition",
    date:"2026-05-03", time:"12:00 PM", price:"Free",
    blurb:"Pioneer Works opens its Red Hook campus for a free public open house — exhibitions, artist studios, live music, and community programming across their sprawling waterfront space. A Brooklyn institution.",
    url:"https://pioneerworks.org", addedBy:"system", going:[], interested:[],
  },

  // ── NYU SKIRBALL ──────────────────────────────────────────────────────
  {
    id:"sk1", title:"A.I.M by Kyle Abraham: Cassette Vol. 1",
    venue:"NYU Skirball Center", category:"Dance",
    date:"2026-04-17", time:"7:30 PM", price:"$30–$75",
    blurb:"Weaving together the pop, R&B, and New Wave sounds of his youth, Kyle Abraham crafts a work moving between camp and critique — honoring influences from Prince to Trisha Brown. Ballet technique meets release-based articulation in a hybrid movement language speaking to the non-monolithic Black experience.",
    url:"https://nyuskirball.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"sk2", title:"Jan Martens: THE DOG DAYS ARE OVER 2.0",
    venue:"NYU Skirball Center", category:"Dance",
    date:"2026-04-23", time:"7:30 PM", price:"$30–$75",
    blurb:"Belgian choreographer Jan Martens brings his explosive work to Skirball. Eight dancers push limits of endurance through a hypnotic cycle of jumps with little music and no escape. Strips dance down to its purest, most brutal form — precision and exhaustion collide.",
    url:"https://nyuskirball.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"sk3", title:"Anne Teresa De Keersmaeker: EXIT ABOVE",
    venue:"NYU Skirball Center", category:"Dance",
    date:"2026-05-01", time:"7:30 PM", price:"$30–$85",
    blurb:"Legendary Belgian choreographer De Keersmaeker returns with EXIT ABOVE: after the tempest. Set to a score rooted in the blues, this hypnotic work transforms walking into a mesmerizing act of dance. Signature precision meets raw, unfiltered energy.",
    url:"https://nyuskirball.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"sk4", title:"Mario Banushi: Mami",
    venue:"NYU Skirball Center", category:"Performance Art",
    date:"2026-05-07", time:"7:30 PM", price:"$25–$65",
    blurb:"Following a sensational run at the 2025 Avignon Festival, Banushi brings Mami to Skirball. Blending dance, surreal imagery, and raw emotion — a hypnotic exploration of motherhood, memory, and myth. Presented with Under the Radar Festival.",
    url:"https://nyuskirball.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"sk5", title:"Narcissister: Voyage Into Infinity",
    venue:"NYU Skirball Center", category:"Performance Art",
    date:"2026-05-14", time:"7:30 PM", price:"$25–$65",
    blurb:"Originally conceived as a kinetic installation for Pioneer Works, Narcissister transforms Skirball into a site of surreal feats, lo-fi magic, and theatrical pyrotechnics. A feminist response to Fischli and Weiss. Female-presenting bodies as both agents and objects of fascination.",
    url:"https://nyuskirball.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"sk6", title:"Milo Rau & Edouard Louis: The Interrogation",
    venue:"NYU Skirball Center", category:"Theater",
    date:"2026-05-21", time:"7:30 PM", price:"$30–$75",
    blurb:"A raw, intimate collaboration between director Milo Rau and writer Edouard Louis — blending personal testimony with urgent political critique. A stark monologue revisiting moments of violence, class shame, and queer identity in contemporary France.",
    url:"https://nyuskirball.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"sk7", title:"Ivy Baldwin & Jeanine Durning: World Premiere Double Bill",
    venue:"NYU Skirball Center", category:"Dance",
    date:"2026-06-04", time:"7:30 PM", price:"$25–$65",
    blurb:"Two of contemporary dance most fearless voices share the stage in a world premiere double bill. Ivy Baldwin with rigorously inventive physical landscapes; Jeanine Durning with radical experiments in movement and language. An unforgettable night of contrasts.",
    url:"https://nyuskirball.org", addedBy:"system", going:[], interested:[],
  },
  {
    id:"sk8", title:"Robyn Orlin: We Wear Our Wheels With Pride",
    venue:"NYU Skirball Center", category:"Dance",
    date:"2026-06-11", time:"7:30 PM", price:"$25–$65",
    blurb:"A vibrant tribute to the rickshaw drivers of South Africa past — celebrating resilience, artistry, and strength. Inspired by Orlin childhood memories of Zulu men pulling elaborately decorated rickshaws under apartheid. Performed by Johannesburg renowned Moving into Dance Mophatong.",
    url:"https://nyuskirball.org", addedBy:"system", going:[], interested:[],
  },

  // ── L'ALLIANCE NEW YORK ───────────────────────────────────────────────
  {
    id:"la1", title:"Comic Arts Fest 2026", venue:"L'Alliance New York", category:"Visual Art",
    date:"2026-04-24", time:"Various", price:"Check site",
    blurb:"A weekend celebration of the art of comics — renowned artists, talks, panels, and workshops. One of the most distinctive cultural events of the spring season in Manhattan.",
    url:"https://lallianceny.org/event/comic-arts-fest-2026/", addedBy:"system", going:[], interested:[],
  },
  {
    id:"la2", title:"The Films of Sophie Letourneur", venue:"L'Alliance New York", category:"Film",
    date:"2026-04-21", time:"4:00 & 7:00 PM", price:"Check site",
    blurb:"Retrospective of French filmmaker Sophie Letourneur's humanistic, intimate cinema. Running through May 26 — including the US Premiere of her new Italian family film L'Aventura.",
    url:"https://lallianceny.org/event/the-films-of-sophie-letourneur/", addedBy:"system", going:[], interested:[],
  },
  {
    id:"la3", title:"L'Aventura — US Premiere", venue:"L'Alliance New York", category:"Film",
    date:"2026-04-21", time:"4:00 & 7:00 PM", price:"Check site",
    blurb:"Sophie Letourneur's new Italian family film gets its US Premiere at L'Alliance. A warm, witty portrait of a family vacation unraveling in unexpected ways. Not to miss.",
    url:"https://lallianceny.org/event/laventura/", addedBy:"system", going:[], interested:[],
  },
  {
    id:"la4", title:"L'Art du Vin: Wine Masterclass with iDealwine", venue:"L'Alliance New York", category:"Other",
    date:"2026-04-16", time:"6:30 PM", price:"Check site",
    blurb:"An evening exploring French wine regions through guided tasting with iDealwine. Next session June 10. A convivial, expert-led deep dive into the wines of France in Midtown Manhattan.",
    url:"https://lallianceny.org/event/wine-masterclass-series/", addedBy:"system", going:[], interested:[],
  },
  {
    id:"la5", title:"In Celebration of Ken and Flo Jacobs", venue:"L'Alliance New York", category:"Film",
    date:"2026-04-16", time:"7:00 PM", price:"Check site",
    blurb:"A tribute evening honoring beloved avant-garde filmmakers Ken and Flo Jacobs. A rare and moving celebration of two artists who shaped experimental cinema in New York.",
    url:"https://lallianceny.org/event/in-celebration-of-ken-and-flo-jacobs/", addedBy:"system", going:[], interested:[],
  },

  // ── AMANT ─────────────────────────────────────────────────────────────
  {
    id:"am1", title:"Letters to Omer — Selma Selman & Maša", venue:"Amant", category:"Performance Art",
    date:"2026-04-15", time:"7:00 PM", price:"Check site",
    blurb:"Part of Amant's For Your Reference series. An intimate performance by Selma Selman and Maša — two artists whose work engages memory, identity, and resistance. At one of Bushwick's most vital arts spaces.",
    url:"https://www.amant.org/programs/2208-letters-to-omer-with-selma-selman-and-masa", addedBy:"system", going:[], interested:[],
  },
  {
    id:"am2", title:"MUSKISM: A Guide for the Perplexed — Book Launch", venue:"Amant", category:"Other",
    date:"2026-04-24", time:"7:00 PM", price:"Free",
    blurb:"Book launch event at Amant for MUSKISM: A Guide for the Perplexed. An evening of conversation around a new publication interrogating power, tech, and culture.",
    url:"https://www.amant.org/programs/2142-muskism-a-guide-for-the-perplexed", addedBy:"system", going:[], interested:[],
  },
  {
    id:"am3", title:"Folded Group — curated by Bill Nace & Kim Gordon", venue:"Amant", category:"Visual Art",
    date:"2026-03-19", time:"Open during gallery hours", price:"Free",
    blurb:"A group exhibition curated by Bill Nace and Kim Gordon, on view through May 17. Kim Gordon's curatorial eye meets Amant's experimental ethos — essential viewing this spring.",
    url:"https://www.amant.org/exhibitions/297-folded-group-curated-by-bill-nace-and-kim-gordon", addedBy:"system", going:[], interested:[],
  },
  {
    id:"am4", title:"Kim Gordon: Count Your Chickens", venue:"Amant", category:"Visual Art",
    date:"2026-03-19", time:"Open during gallery hours", price:"Free",
    blurb:"A solo exhibition by Kim Gordon — musician, artist, cultural icon — on view through August 16. Raw, confrontational, and essential. Don't sleep on this one.",
    url:"https://www.amant.org/exhibitions/295-kim-gordon-count-your-chickens", addedBy:"system", going:[], interested:[],
  },
];

// ── STORAGE ───────────────────────────────────────────────────────────
async function sGet(key) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
async function sSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ── HELPERS ───────────────────────────────────────────────────────────
const fmt = (d) => {
  if (!d) return "";
  const dt = new Date(d + "T12:00:00");
  return dt.toLocaleDateString("en-US",{weekday:"short",month:"long",day:"numeric",year:"numeric"});
};
const isPast = (d) => new Date(d+"T23:59:59") < new Date();

// ── SHARE EVENT ───────────────────────────────────────────────────────
async function shareEvent(event) {
  const parts = [
    event.title,
    `${event.venue} · ${fmt(event.date)}${event.time ? ' at ' + event.time : ''}`,
    event.price ? `Tickets: ${event.price}` : null,
    event.blurb || null,
    event.url || window.location.href,
  ].filter(Boolean);
  const text = parts.join('\n');
  if (navigator.share) {
    try {
      await navigator.share({ title: event.title, text, url: event.url || window.location.href });
      return true;
    } catch (e) {
      if (e.name === 'AbortError') return false;
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch { return false; }
}

// ── ONBOARDING ────────────────────────────────────────────────────────
function Onboarding({ onJoin }) {
  const [name, setName] = useState("");
  const valid = name.trim().length >= 2;
  return (
    <div style={{minHeight:"100vh",background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{CSS}</style>
      <div className="slide-up" style={{width:"100%",maxWidth:420,textAlign:"center"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,letterSpacing:"0.2em",color:"var(--gold)",textTransform:"uppercase",marginBottom:16}}>
          New York
        </div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:56,fontWeight:900,color:"var(--cream)",lineHeight:1,marginBottom:8}}>
          The List
        </h1>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:15,color:"#888",lineHeight:1.7,marginBottom:48}}>
          Your private circle for dance, theater & performance in New York.
        </p>

        <div style={{textAlign:"left",marginBottom:12}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.12em",color:"#666",textTransform:"uppercase",marginBottom:8}}>
            Your name
          </div>
          <input
            value={name}
            onChange={e=>setName(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&valid&&onJoin(name.trim())}
            placeholder="e.g. Maya"
            autoFocus
            style={{
              width:"100%",padding:"14px 16px",
              background:"transparent",
              border:"1px solid #333",
              borderBottom:`2px solid ${valid?"var(--gold)":"#333"}`,
              color:"var(--cream)",fontSize:18,outline:"none",
              fontFamily:"'Playfair Display',serif",
              transition:"border-color .2s",
            }}
          />
        </div>

        <button onClick={()=>valid&&onJoin(name.trim())} disabled={!valid} style={{
          width:"100%",minHeight:52,padding:"0",marginTop:8,
          background:valid?"var(--gold)":"#222",
          border:"none",color:valid?"#fff":"#555",
          fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:"0.15em",
          textTransform:"uppercase",cursor:valid?"pointer":"default",
          transition:"all .2s",
        }}>
          Enter The List
        </button>

        <p style={{marginTop:24,fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#555",lineHeight:1.8}}>
          Share this page with your crew — anyone with the link can join.
        </p>
      </div>
    </div>
  );
}

// ── EVENT CARD ────────────────────────────────────────────────────────
function EventCard({ event, username, onOpen }) {
  const cat   = CAT_COLOR[event.category] || {bg:"#EEE",text:"#333"};
  const going = event.going||[];
  const inter = event.interested||[];
  const iGo   = going.includes(username);
  const iInt  = inter.includes(username);
  const past  = isPast(event.date);
  const [imgErr, setImgErr] = useState(false);
  const hasImg = event.image && !imgErr;
  const [didShare, setDidShare] = useState(false);
  const handleShare = async (e) => {
    e.stopPropagation();
    const ok = await shareEvent(event);
    if (ok) { setDidShare(true); setTimeout(() => setDidShare(false), 2000); }
  };

  return (
    <div className="event-card" onClick={()=>onOpen(event)} style={{
      background:"var(--surface)", border:"1px solid var(--line)",
      cursor:"pointer", opacity: past ? .6 : 1,
      display:"flex", overflow:"hidden",
    }}>
      {/* Thumbnail */}
      <div style={{
        width: hasImg ? 88 : 4, flexShrink:0,
        background: hasImg ? "#000" : cat.text,
        position:"relative", overflow:"hidden",
        transition:"width .3s ease",
      }}>
        {hasImg && (
          <img
            src={event.image}
            onError={()=>setImgErr(true)}
            alt={event.title}
            style={{width:"100%",height:"100%",objectFit:"cover",display:"block",opacity:.92}}
          />
        )}
        {/* Category color stripe always visible */}
        {!hasImg && (
          <div style={{width:"100%",height:"100%",background:cat.text}}/>
        )}
      </div>

      {/* Content */}
      <div style={{flex:1, padding:"16px 16px 12px", minWidth:0}}>
        {/* Top row: tags + date */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:8}}>
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            <span className="tag" style={{background:cat.bg,color:cat.text}}>{event.category}</span>
            {past && <span className="tag" style={{background:"#f0ece8",color:"#999"}}>Past</span>}
            {event.addedBy !== "system" && (
              <span style={{
                fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.08em",
                background:"var(--gold)",color:"#fff",
                padding:"2px 7px",borderRadius:2,
              }}>
                {event.addedBy}
              </span>
            )}
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:11,color:"var(--muted)",whiteSpace:"nowrap"}}>
              {fmt(event.date)}
            </div>
            {event.price && (
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--gold)",marginTop:2}}>
                {event.price}
              </div>
            )}
          </div>
        </div>

        {/* Title + venue */}
        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,lineHeight:1.2,marginBottom:3,
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {event.title}
        </h3>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"var(--muted)",marginBottom:8,
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {event.venue}
        </div>

        {/* Blurb — 2 lines max */}
        {event.blurb && (
          <p style={{
            fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"var(--muted)",lineHeight:1.5,
            marginBottom:10,
            display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",
          }}>
            {event.blurb}
          </p>
        )}

        {/* Attendees */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          borderTop:"1px solid var(--line)",paddingTop:8}}>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {going.length > 0 && (
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"var(--sage)"}}>
                <span style={{display:"flex",alignItems:"center",gap:4}}><Icon name="check" size={11} color="var(--sage)"/><b>{going.join(", ")}</b></span>
              </span>
            )}
            {inter.length > 0 && (
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"var(--slate)"}}>
                <span style={{display:"flex",alignItems:"center",gap:4}}><Icon name="circle" size={11} color="var(--slate)"/><b>{inter.join(", ")}</b></span>
              </span>
            )}
            {going.length===0&&inter.length===0&&(
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#ccc"}}>
                Be the first
              </span>
            )}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            {iGo && <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--sage)",letterSpacing:"0.08em"}}>GOING</span>}
            {iInt&&!iGo && <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--slate)",letterSpacing:"0.08em"}}>INTERESTED</span>}
            <button onClick={handleShare} title={didShare ? "Copied!" : "Share"} style={{
              background:"none",border:"none",cursor:"pointer",padding:2,
              color:didShare ? "var(--sage)" : "var(--muted)",
              display:"flex",alignItems:"center",transition:"color .2s",
            }}>
              <Icon name={didShare ? "check" : "share"} size={13}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EVENT MODAL ───────────────────────────────────────────────────────
function EventModal({ event, username, onClose, onRsvp }) {
  const cat   = CAT_COLOR[event.category]||{bg:"#EEE",text:"#333"};
  const going = event.going||[];
  const inter = event.interested||[];
  const iGo   = going.includes(username);
  const iInt  = inter.includes(username);
  const [didShare, setDidShare] = useState(false);
  const handleShare = async () => {
    const ok = await shareEvent(event);
    if (ok) { setDidShare(true); setTimeout(() => setDidShare(false), 2000); }
  };

  return (
    <div onClick={onClose} style={{
      position:"fixed",inset:0,zIndex:1000,
      background:"rgba(14,14,14,.7)",backdropFilter:"blur(4px)",
      display:"flex",alignItems:"center",justifyContent:"center",
      padding:20,overflowY:"auto",
    }}>
      <div onClick={e=>e.stopPropagation()} className="slide-up" style={{
        width:"100%",maxWidth:580,background:"var(--surface2)",
        border:"1px solid var(--line)",
        boxShadow:"0 32px 80px rgba(14,14,14,.25)",
        overflow:"hidden",
      }}>
        {/* Header bar */}
        {event.image ? (
          <div style={{position:"relative",height:200,overflow:"hidden",flexShrink:0}}>
            <img src={event.image} alt={event.title}
              style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
            <div style={{position:"absolute",inset:0,
              background:"linear-gradient(to top, rgba(245,240,232,.95) 0%, rgba(245,240,232,.1) 60%, transparent 100%)"}}/>
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:4,background:cat.text}}/>
          </div>
        ) : (
          <div style={{height:4,background:cat.text}}/>
        )}

        <div style={{padding:"20px 20px 24px"}}>
          {/* Category + close */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <span className="tag" style={{background:cat.bg,color:cat.text}}>{event.category}</span>
            <button onClick={onClose} style={{
              background:"none",border:"none",cursor:"pointer",
              fontFamily:"'DM Mono',monospace",fontSize:18,color:"var(--muted)",lineHeight:1,
            }}><Icon name="x" size={16}/></button>
          </div>

          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:900,lineHeight:1.1,marginBottom:8}}>
            {event.title}
          </h2>

          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,flexWrap:"wrap"}}>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"var(--muted)",fontWeight:500}}>
              {event.venue}
            </div>
            {event.addedBy !== "system" && (
              <span style={{
                fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.08em",
                background:"var(--gold)",color:"#fff",
                padding:"3px 9px",borderRadius:2,
              }}>
                Added by {event.addedBy}
              </span>
            )}
          </div>

          {/* Date / time / price row */}
          <div style={{display:"flex",gap:24,padding:"16px 0",borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)",marginBottom:24,flexWrap:"wrap"}}>
            {[
              {label:"Date",  val:fmt(event.date)},
              {label:"Time",  val:event.time},
              {label:"Price", val:event.price||"—"},
            ].map(({label,val})=>(
              <div key={label}>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.14em",color:"var(--muted)",textTransform:"uppercase",marginBottom:4}}>{label}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontStyle:label==="Date"?"italic":"normal",fontSize:14,color:"var(--ink)"}}>{val}</div>
              </div>
            ))}
          </div>

          {/* Blurb */}
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,lineHeight:1.8,color:"var(--ink)",marginBottom:28}}>
            {event.blurb}
          </p>

          {/* Who's going */}
          <div style={{marginBottom:28,padding:"16px 20px",background:"var(--surface)",border:"1px solid var(--line)"}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.12em",color:"var(--muted)",textTransform:"uppercase",marginBottom:12}}>
              Your crew
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {going.length>0&&(
                <div style={{display:"flex",gap:8,alignItems:"baseline"}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--sage)",minWidth:70}}>GOING</span>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"var(--ink)"}}>{going.join(", ")}</span>
                </div>
              )}
              {inter.length>0&&(
                <div style={{display:"flex",gap:8,alignItems:"baseline"}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--slate)",minWidth:70}}>MAYBE</span>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"var(--ink)"}}>{inter.join(", ")}</span>
                </div>
              )}
              {going.length===0&&inter.length===0&&(
                <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#bbb"}}>No one yet</span>
              )}
            </div>
          </div>

          {/* RSVP buttons */}
          {!isPast(event.date) && (
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>onRsvp(event.id,"going")} style={{
                  flex:1,minHeight:48,padding:"0 12px",
                  background:iGo?"var(--sage)":"transparent",
                  border:`1.5px solid ${iGo?"var(--sage)":"var(--line)"}`,
                  color:iGo?"#fff":"var(--ink)",
                  fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:"0.1em",
                  textTransform:"uppercase",cursor:"pointer",transition:"all .2s",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                }}><Icon name="check" size={13} color={iGo?"#fff":"var(--line)"}/> I'm Going</button>
                <button onClick={()=>onRsvp(event.id,"interested")} style={{
                  flex:1,minHeight:48,padding:"0 12px",
                  background:iInt&&!iGo?"var(--slate)":"transparent",
                  border:`1.5px solid ${iInt&&!iGo?"var(--slate)":"var(--line)"}`,
                  color:iInt&&!iGo?"#fff":"var(--ink)",
                  fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:"0.1em",
                  textTransform:"uppercase",cursor:"pointer",transition:"all .2s",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                }}><Icon name="circle" size={13} color={iInt&&!iGo?"#fff":"var(--line)"}/> Interested</button>
                {(iGo||iInt)&&(
                  <button onClick={()=>onRsvp(event.id,"none")} style={{
                    minHeight:48,width:48,background:"transparent",
                    border:"1.5px solid var(--line)",color:"var(--muted)",
                    cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                  }}><Icon name="x" size={16}/></button>
                )}
              </div>
            </div>
          )}

          {/* ── ADD TO CALENDAR ── */}
          {event.date && (
            <div style={{marginBottom:12}}>
              {(() => {
                const dt = event.date.replace(/-/g,'');
                const tm = (event.time||'19:30').replace(/[^0-9]/g,'').padEnd(4,'00').slice(0,4);
                const title = encodeURIComponent(event.title);
                const loc   = encodeURIComponent(event.venue + ', New York, NY');
                const desc  = encodeURIComponent(event.blurb||'');
                const start = dt + 'T' + tm + '00';
                const end   = dt + 'T' + String(parseInt(tm.slice(0,2))+2).padStart(2,'0') + tm.slice(2) + '00';
                const gcal  = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${desc}&location=${loc}`;
                const ical  = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:${start}%0ADTEND:${end}%0ASUMMARY:${title}%0ALOCATION:${loc}%0AEND:VEVENT%0AEND:VCALENDAR`;
                return (
                  <div style={{display:'flex',gap:8}}>
                    <a href={gcal} target="_blank" rel="noreferrer" style={{
                      flex:1,display:'flex',alignItems:'center',justifyContent:'center',minHeight:44,padding:'0 8px',
                      background:'transparent',border:'1px solid var(--line)',color:'var(--ink)',
                      textDecoration:'none',fontFamily:"'DM Mono',monospace",
                      fontSize:10,letterSpacing:'0.12em',textTransform:'uppercase',
                    }}><span style={{display:"flex",alignItems:"center",gap:5,justifyContent:"center"}}><Icon name="calendar" size={12}/>Google Calendar</span></a>
                    <a href={ical} download={event.title+'.ics'} style={{
                      flex:1,display:'flex',alignItems:'center',justifyContent:'center',minHeight:44,padding:'0 8px',
                      background:'transparent',border:'1px solid var(--line)',color:'var(--ink)',
                      textDecoration:'none',fontFamily:"'DM Mono',monospace",
                      fontSize:10,letterSpacing:'0.12em',textTransform:'uppercase',
                    }}><span style={{display:"flex",alignItems:"center",gap:5,justifyContent:"center"}}><Icon name="calendar" size={12}/>Apple / iCal</span></a>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── SHARE ── */}
          <button onClick={handleShare} style={{
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            width:"100%",minHeight:44,marginBottom:8,
            background:"transparent",border:"1.5px solid var(--line)",
            color: didShare ? "var(--sage)" : "var(--ink)",
            fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:"0.12em",
            textTransform:"uppercase",cursor:"pointer",transition:"all .2s",
          }}>
            <Icon name={didShare ? "check" : "share"} size={13} color={didShare ? "var(--sage)" : "currentColor"}/>
            {didShare ? (navigator.share ? "Shared!" : "Link Copied!") : "Share This Event"}
          </button>

          {/* ── BOOK TICKETS ── */}
          {event.url && (
            <a href={event.url} target="_blank" rel="noreferrer" style={{
              display:"flex",alignItems:"center",justifyContent:"center",minHeight:48,marginBottom:16,
              background:"var(--ink)",color:"var(--cream)",textDecoration:"none",
              fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",
            }}>
              <span style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}>Book Tickets <Icon name="externalLink" size={12} color="var(--cream)"/></span>
            </a>
          )}

          {/* ── COMMENTS ── */}
          <CommentsSection event={event} username={username}/>
        </div>
      </div>
    </div>
  );
}

// ── COMMENTS SECTION ──────────────────────────────────────────────────
function CommentsSection({ event, username }) {
  const [comments, setComments] = useState(event.comments || []);
  const [text, setText] = useState('');

  const post = async () => {
    if (!text.trim()) return;
    const c = { id: Date.now(), author: username, text: text.trim(), at: new Date().toISOString() };
    const next = [...comments, c];
    setComments(next);
    setText('');
    // Persist to shared storage
    const all = await sGet('tl-events-v7') || [];
    const updated = all.map(e => e.id === event.id ? {...e, comments: next} : e);
    sSet('tl-events-v7', updated);
  };

  const timeAgo = (iso) => {
    const diff = (Date.now() - new Date(iso)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff/60) + 'm ago';
    if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
    return Math.floor(diff/86400) + 'd ago';
  };

  return (
    <div>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:'0.12em',
        color:'var(--muted)',textTransform:'uppercase',marginBottom:12}}>
        Comments {comments.length > 0 && `(${comments.length})`}
      </div>

      {comments.length > 0 && (
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:12}}>
          {comments.map(c => (
            <div key={c.id} style={{background:'var(--surface)',border:'1px solid var(--line)',padding:'10px 14px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--gold)',fontWeight:600}}>{c.author}</span>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--muted)'}}>{timeAgo(c.at)}</span>
              </div>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--ink)',lineHeight:1.5}}>{c.text}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{display:'flex',gap:8}}>
        <input
          value={text}
          onChange={e=>setText(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&post()}
          placeholder='e.g. Meet at the bar at 7...'
          style={{
            flex:1,minHeight:44,padding:'0 12px',background:'var(--surface)',
            border:'1px solid var(--line)',fontSize:13,
            color:'var(--ink)',outline:'none',
            fontFamily:"'DM Sans',sans-serif",
          }}
        />
        <button onClick={post} disabled={!text.trim()} style={{
          minHeight:44,padding:'0 14px',
          background:text.trim()?'var(--ink)':'#ddd',
          border:'none',color:text.trim()?'var(--cream)':'#aaa',
          fontFamily:"'DM Mono',monospace",fontSize:10,
          letterSpacing:'0.1em',textTransform:'uppercase',cursor:text.trim()?'pointer':'default',
        }}>Post</button>
      </div>
    </div>
  );
}

// ── MAP MODAL ─────────────────────────────────────────────────────────
function MapModal({ venues, events, onClose }) {
  const [active, setActive] = useState(null);

  // Build venue list with event counts
  const venueData = venues.map(v => {
    const vEvents = events.filter(e => e.venue === v.name && !isPast(e.date));
    return { ...v, upcomingCount: vEvents.length, upcoming: vEvents.slice(0,3) };
  }).filter(v => v.name !== 'Other');

  return (
    <div onClick={onClose} style={{
      position:'fixed',inset:0,zIndex:1000,
      background:'rgba(14,14,14,.7)',backdropFilter:'blur(4px)',
      display:'flex',alignItems:'center',justifyContent:'center',padding:16,
    }}>
      <div onClick={e=>e.stopPropagation()} className="slide-up" style={{
        width:'100%',maxWidth:600,maxHeight:'85vh',
        background:'var(--surface2)',border:'1px solid var(--line)',
        boxShadow:'0 32px 80px rgba(14,14,14,.25)',
        display:'flex',flexDirection:'column',overflow:'hidden',
      }}>
        <div style={{height:4,background:'var(--slate)'}}/>
        <div style={{padding:'20px 24px 12px',borderBottom:'1px solid var(--line)',
          display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700}}>Venues</h2>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--muted)',
              letterSpacing:'0.12em',textTransform:'uppercase',marginTop:2}}>
              {venueData.length} venues · click to explore
            </div>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',
            cursor:'pointer',fontSize:20,color:'var(--muted)'}}><Icon name="x" size={16}/></button>
        </div>

        <div style={{overflowY:'auto',flex:1}}>
          {/* Embedded Google Map */}
          <div style={{position:'relative',height:260,background:'#e8e0d4',overflow:'hidden'}}>
            <iframe
              title="NYC Arts Venues"
              src={`https://www.google.com/maps/embed/v1/search?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&q=performing+arts+venues+New+York+City&zoom=12`}
              style={{width:'100%',height:'100%',border:'none',filter:'sepia(20%) contrast(95%)'}}
              allowFullScreen
              loading="lazy"
            />
            <div style={{
              position:'absolute',inset:0,pointerEvents:'none',
              background:'linear-gradient(to bottom, transparent 70%, var(--cream) 100%)'
            }}/>
          </div>

          {/* Venue list */}
          <div style={{padding:'0 0 16px'}}>
            {venueData.map((v,i) => (
              <div
                key={v.id||v.name}
                onClick={()=>setActive(active===v.name?null:v.name)}
                style={{
                  padding:'14px 24px',cursor:'pointer',
                  borderBottom:'1px solid var(--line)',
                  background:active===v.name?'var(--surface)':'transparent',
                  transition:'background .15s',
                }}
              >
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,marginBottom:2}}>
                      {v.name}
                    </div>
                    {v.neighborhood && (
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--muted)',letterSpacing:'0.1em'}}>
                        {v.neighborhood}
                      </div>
                    )}
                  </div>
                  <div style={{display:'flex',gap:10,alignItems:'center'}}>
                    {v.upcomingCount > 0 && (
                      <span style={{
                        fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'0.08em',
                        background:'var(--gold)',color:'#fff',
                        padding:'2px 7px',borderRadius:2,
                      }}>{v.upcomingCount} upcoming</span>
                    )}
                    {v.url && (
                      <a href={v.url} target="_blank" rel="noreferrer"
                        onClick={e=>e.stopPropagation()}
                        style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--muted)',
                          textDecoration:'none',letterSpacing:'0.08em'}}>
                        site ↗
                      </a>
                    )}
                    <span style={{color:'var(--muted)',fontSize:12}}><Icon name={active===v.name?"chevronUp":"chevronDown"} size={12}/></span>
                  </div>
                </div>

                {active === v.name && v.upcoming.length > 0 && (
                  <div style={{marginTop:10,display:'flex',flexDirection:'column',gap:6}}>
                    {v.upcoming.map(ev => (
                      <div key={ev.id} style={{
                        background:'var(--surface2)',border:'1px solid var(--line)',
                        padding:'8px 12px',display:'flex',justifyContent:'space-between',
                        alignItems:'center',gap:8,
                      }}>
                        <div>
                          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:500}}>{ev.title}</div>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--muted)',marginTop:2}}>
                            {fmt(ev.date)} · {ev.time}
                          </div>
                        </div>
                        {ev.price && (
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--gold)',flexShrink:0}}>
                            {ev.price}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {active === v.name && v.upcoming.length === 0 && (
                  <div style={{marginTop:8,fontFamily:"'DM Sans',sans-serif",fontSize:12,color:'var(--muted)',fontStyle:'italic'}}>
                    No upcoming events listed
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ADD EVENT MODAL ───────────────────────────────────────────────────
// ── SHARE MODAL ───────────────────────────────────────────────────────
// ── SMALL HELPERS ─────────────────────────────────────────────────────
const Field = ({label,children,style={}}) => (
  <div style={style}>
    <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.14em",color:"var(--muted)",textTransform:"uppercase",marginBottom:6}}>
      {label}
    </div>
    {children}
  </div>
);
const FInput = (p) => (
  <input {...p} style={{
    width:"100%",minHeight:44,padding:"0 12px",background:"var(--surface)",
    border:"1px solid var(--line)",fontSize:15,color:"var(--ink)",outline:"none",
    ...p.style,
  }}/>
);
const FSelect = ({children,...p}) => (
  <select {...p} style={{
    width:"100%",minHeight:44,padding:"0 12px",background:"var(--surface)",
    border:"1px solid var(--line)",fontSize:15,color:"var(--ink)",outline:"none",appearance:"none",
  }}>{children}</select>
);

function ShareModal({ username, onClose }) {
  const url    = window.location.href.split("?")[0];
  const smsUrl = "sms:?body=" + encodeURIComponent("Join The List — our NYC arts & performance tracker \u1F3AD\n\n" + url);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(url)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2200); })
      .catch(() => {});
  };
  return (
    <div onClick={onClose} style={{
      position:"fixed",inset:0,zIndex:1000,
      background:"rgba(14,14,14,.7)",backdropFilter:"blur(4px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:20,
    }}>
      <div onClick={e=>e.stopPropagation()} className="slide-up" style={{
        width:"100%",maxWidth:440,background:"var(--surface2)",
        border:"1px solid var(--line)",
        boxShadow:"0 32px 80px rgba(14,14,14,.2)",overflow:"hidden",
      }}>
        <div style={{height:4,background:"var(--gold)"}}/>
        <div style={{padding:"20px 20px 24px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700}}>
              Invite Your Crew
            </h2>
            <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",
              fontFamily:"'DM Mono',monospace",fontSize:20,color:"var(--muted)"}}><Icon name="x" size={16}/></button>
          </div>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"var(--muted)",lineHeight:1.7,marginBottom:24}}>
            Anyone with this link can join The List, see upcoming events, and mark who's going.
          </p>
          <div style={{background:"var(--surface)",border:"1px solid var(--line)",padding:"12px 14px",marginBottom:12,
            fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--muted)",wordBreak:"break-all",lineHeight:1.6}}>
            {url}
          </div>
          <button onClick={copy} style={{
            width:"100%",padding:"13px",marginBottom:10,background:"transparent",
            border:copied?"1.5px solid var(--sage)":"1.5px solid var(--line)",
            color:copied?"var(--sage)":"var(--ink)",
            fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:"0.12em",
            textTransform:"uppercase",cursor:"pointer",transition:"all .2s",
          }}>{copied ? "Copied!" : "Copy Link"}</button>
          <a href={smsUrl} style={{display:"block",textDecoration:"none"}}>
            <div style={{width:"100%",padding:"13px",textAlign:"center",
              background:"var(--ink)",color:"var(--cream)",
              fontFamily:"'DM Mono',monospace",fontSize:11,
              letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",
            }}><span style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}><Icon name="send" size={12} color="var(--cream)"/>Send via Text Message</span></div>
          </a>
          <p style={{marginTop:16,fontFamily:"'DM Sans',sans-serif",fontSize:11,
            color:"var(--muted)",textAlign:"center",lineHeight:1.6}}>
            Shared by {username} · The List · New York
          </p>
        </div>
      </div>
    </div>
  );
}

function AddModal({ onAdd, onClose, username, venueList }) {
  const [form, setForm] = useState({
    title:"",venue:VENUES[0],category:"Dance",
    date:"",time:"8:00 PM",price:"",blurb:"",url:"",
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const valid = form.title.trim()&&form.date;

  const [fetching, setFetching] = useState(false);

  const submit = async () => {
    if (!valid || fetching) return;
    let blurb = form.blurb;
    // Auto-fetch blurb from URL if empty and URL provided
    if (!blurb && form.url) {
      setFetching(true);
      blurb = await fetchBlurbFromUrl(form.url) || "";
      setFetching(false);
    }
    onAdd({
      id:`e-${Date.now()}`,
      ...form,
      blurb,
      addedBy:username,
      going:[],
      interested:[],
    });
    onClose();
  };

  return (
    <div onClick={onClose} style={{
      position:"fixed",inset:0,zIndex:1000,
      background:"rgba(14,14,14,.7)",backdropFilter:"blur(4px)",
      display:"flex",alignItems:"center",justifyContent:"center",
      padding:20,overflowY:"auto",
    }}>
      <div onClick={e=>e.stopPropagation()} className="slide-up" style={{
        width:"100%",maxWidth:520,background:"var(--surface2)",
        border:"1px solid var(--line)",
        boxShadow:"0 32px 80px rgba(14,14,14,.25)",
        overflow:"hidden",
      }}>
        <div style={{height:4,background:"var(--gold)"}}/>
        <div style={{padding:"20px 20px 24px"}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,marginBottom:4}}>
            Add an Event
          </h2>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"var(--muted)",marginBottom:28}}>
            Share something with the crew
          </p>

          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <Field label="Title">
              <FInput value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Revelations"/>
            </Field>

            <div style={{display:"flex",gap:12}}>
              <Field label="Venue" style={{flex:2}}>
                <FSelect value={form.venue} onChange={e=>set("venue",e.target.value)}>
                  {(venueList||[]).filter(v=>v!=="All").map(v=><option key={v}>{v}</option>)}
                </FSelect>
              </Field>
              <Field label="Category" style={{flex:1}}>
                <FSelect value={form.category} onChange={e=>set("category",e.target.value)}>
                  {CATS.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}
                </FSelect>
              </Field>
            </div>

            <div style={{display:"flex",gap:12}}>
              <Field label="Date" style={{flex:1}}>
                <FInput type="date" value={form.date} onChange={e=>set("date",e.target.value)}/>
              </Field>
              <Field label="Time" style={{flex:1}}>
                <FInput value={form.time} onChange={e=>set("time",e.target.value)} placeholder="8:00 PM"/>
              </Field>
              <Field label="Price" style={{flex:1}}>
                <FInput value={form.price} onChange={e=>set("price",e.target.value)} placeholder="$30–$90"/>
              </Field>
            </div>

            <Field label="Description">
              <textarea value={form.blurb} onChange={e=>set("blurb",e.target.value)}
                placeholder="Tell the crew what makes this worth going to..."
                style={{
                  width:"100%",minHeight:80,padding:"10px 12px",
                  background:"var(--surface)",border:"1px solid var(--line)",
                  fontSize:14,color:"var(--ink)",resize:"vertical",outline:"none",lineHeight:1.6,
                }}/>
            </Field>

            <Field label="Ticket URL (optional)">
              <FInput value={form.url} onChange={e=>set("url",e.target.value)} placeholder="https://..."/>
            </Field>
          </div>

          <div style={{display:"flex",gap:10,marginTop:28}}>
            <button onClick={submit} disabled={!valid} style={{
              flex:1,minHeight:52,padding:"0 14px",
              background:(valid&&!fetching)?"var(--ink)":"#ddd",
              border:"none",color:(valid&&!fetching)?"var(--cream)":"#aaa",
              fontFamily:"'DM Mono',monospace",fontSize:13,letterSpacing:"0.12em",
              textTransform:"uppercase",cursor:(valid&&!fetching)?"pointer":"default",
            }}>{fetching ? "Fetching description…" : "Add to The List"}</button>
            <button onClick={onClose} style={{
              minHeight:52,padding:"0 20px",background:"transparent",
              border:"1px solid var(--line)",color:"var(--muted)",
              fontFamily:"'DM Mono',monospace",fontSize:13,cursor:"pointer",
            }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}



// ── ADD VENUE MODAL ───────────────────────────────────────────────────
function AddVenueModal({ onAdd, onClose, existingVenues }) {
  const [query,    setQuery]    = useState("");
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [manual,   setManual]   = useState(false);
  const [form,     setForm]     = useState({ name:"", neighborhood:"", address:"", url:"", category:"Theater" });
  const [searched, setSearched] = useState(false);

  const VENUE_CATS = ["Theater","Dance","Opera","Music","Performance Art","Multi-Arts","Film","Gallery"];

  const searchPlaces = async () => {
    if (!query.trim()) return;
    setLoading(true); setSearched(true); setResults([]);
    try {
      // Use Claude API to get structured venue data — no Google key needed
      const res = await fetch("/api/claude", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:800,
          messages:[{ role:"user", content:`Return JSON only — no markdown, no explanation.
Find this NYC arts/performance venue: "${query}"
Return an array of up to 4 matching venues as JSON:
[{"name":"full official name","neighborhood":"NYC neighborhood","address":"street address, NY","url":"official website url","category":"Theater|Dance|Opera|Music|Performance Art|Multi-Arts|Film|Gallery","description":"one sentence about the venue"}]
Only return real, verifiable NYC venues. If not found, return [].` }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text?.trim() || "[]";
      const clean = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setResults(Array.isArray(parsed) ? parsed : []);
    } catch { setResults([]); }
    setLoading(false);
  };

  const addVenue = (v) => {
    if (existingVenues.find(e => e.name.toLowerCase() === v.name.toLowerCase())) {
      onClose(); return;
    }
    onAdd({ ...v, id: "v-" + Date.now(), addedAt: new Date().toISOString() });
    onClose();
  };

  const submitManual = () => {
    if (!form.name.trim()) return;
    addVenue(form);
  };

  return (
    <div onClick={onClose} style={{
      position:"fixed",inset:0,zIndex:1000,
      background:"rgba(14,14,14,.75)",backdropFilter:"blur(4px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:16,overflowY:"auto",
    }}>
      <div onClick={e=>e.stopPropagation()} className="slide-up" style={{
        width:"100%",maxWidth:500,background:"var(--surface2)",
        border:"1px solid var(--line)",
        boxShadow:"0 32px 80px rgba(14,14,14,.2)",overflow:"hidden",
      }}>
        <div style={{height:4,background:"var(--slate)"}}/>
        <div style={{padding:"28px 28px 24px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700}}>Add a Venue</h2>
            <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",
              fontFamily:"'DM Mono',monospace",fontSize:18,color:"var(--muted)"}}><Icon name="x" size={16}/></button>
          </div>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"var(--muted)",marginBottom:20,lineHeight:1.6}}>
            Search for a NYC arts venue and it will be added to everyone's list.
          </p>

          {/* Search bar */}
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            <input
              value={query}
              onChange={e=>setQuery(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&searchPlaces()}
              placeholder="e.g. Danspace Project, Pioneer Works…"
              autoFocus
              style={{
                flex:1,padding:"10px 12px",background:"var(--surface)",
                border:"1px solid var(--line)",fontSize:13,color:"var(--ink)",outline:"none",
                fontFamily:"'DM Sans',sans-serif",
              }}
            />
            <button onClick={searchPlaces} disabled={loading||!query.trim()} style={{
              minHeight:44,padding:"0 16px",background:query.trim()?"var(--ink)":"#ddd",
              border:"none",color:query.trim()?"var(--cream)":"#aaa",
              fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:"0.1em",
              textTransform:"uppercase",cursor:query.trim()?"pointer":"default",
            }}>{loading?"…":"Search"}</button>
          </div>

          {/* Results */}
          {loading && (
            <div style={{textAlign:"center",padding:"24px 0",fontFamily:"'Playfair Display',serif",
              fontSize:14,fontStyle:"italic",color:"var(--muted)"}}>
              Looking up venues…
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div style={{textAlign:"center",padding:"16px 0",fontFamily:"'DM Sans',sans-serif",
              fontSize:13,color:"var(--muted)",marginBottom:8}}>
              No results found. Try a different name or add manually below.
            </div>
          )}

          {results.length > 0 && (
            <div style={{display:"flex",flexDirection:"column",gap:1,marginBottom:16}}>
              {results.map((v,i)=>(
                <div key={i} style={{
                  background:"var(--surface)",border:"1px solid var(--line)",
                  padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,
                }}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                      <span className="tag" style={{background:"#eee",color:"#555"}}>{v.category}</span>
                      {v.neighborhood && (
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)"}}>{v.neighborhood}</span>
                      )}
                    </div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,marginBottom:2}}>{v.name}</div>
                    {v.address && <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--muted)",marginBottom:4}}>{v.address}</div>}
                    {v.description && <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#777",lineHeight:1.5}}>{v.description}</div>}
                  </div>
                  <button onClick={()=>addVenue(v)} style={{
                    minHeight:44,padding:"0 14px",flexShrink:0,
                    background:"var(--ink)",border:"none",color:"var(--cream)",
                    fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:"0.1em",
                    textTransform:"uppercase",cursor:"pointer",
                  }}>Add</button>
                </div>
              ))}
            </div>
          )}

          {/* Manual toggle */}
          <button onClick={()=>setManual(m=>!m)} style={{
            width:"100%",padding:"9px",background:"transparent",
            border:"1px solid var(--line)",color:"var(--muted)",
            fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",
            textTransform:"uppercase",cursor:"pointer",marginBottom: manual?12:0,
          }}>
            {manual ? "▲ Hide Manual Entry" : "▼ Add Manually"}
          </button>

          {/* Manual form */}
          {manual && (
            <div style={{display:"flex",flexDirection:"column",gap:12,padding:"16px",background:"var(--surface)",border:"1px solid var(--line)"}}>
              <div>
                <Field label="Venue Name"><FInput value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. The Bushwick Starr"/></Field>
              </div>
              <div style={{display:"flex",gap:10}}>
                <div style={{flex:1}}>
                  <Field label="Neighborhood"><FInput value={form.neighborhood} onChange={e=>setForm(f=>({...f,neighborhood:e.target.value}))} placeholder="Chelsea"/></Field>
                </div>
                <div style={{flex:1}}>
                  <Field label="Type">
                    <FSelect value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                      {VENUE_CATS.map(c=><option key={c}>{c}</option>)}
                    </FSelect>
                  </Field>
                </div>
              </div>
              <Field label="Address"><FInput value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} placeholder="123 Main St, Brooklyn, NY"/></Field>
              <Field label="Website"><FInput value={form.url} onChange={e=>setForm(f=>({...f,url:e.target.value}))} placeholder="https://…"/></Field>
              <button onClick={submitManual} disabled={!form.name.trim()} style={{
                padding:"11px",background:form.name.trim()?"var(--ink)":"#ddd",
                border:"none",color:form.name.trim()?"var(--cream)":"#aaa",
                fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:"0.12em",
                textTransform:"uppercase",cursor:form.name.trim()?"pointer":"default",
              }}>Add Venue</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────
export default function TheList() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("tl-dark") === "1"; } catch { return false; }
  });
  const [username,  setUsername]  = useState(null);
  const [events,    setEvents]    = useState([]);
  const [customVenues, setCustomVenues] = useState([]);
  const [showAddVenue, setShowAddVenue] = useState(false);
  const [venueStatus,  setVenueStatus]  = useState(null); // {name, loading}
  const [cat,       setCat]       = useState("All");
  const [venueFilter, setVenueFilter] = useState("All");
  const [view,      setView]      = useState("upcoming"); // upcoming | past | going
  const [selected,  setSelected]  = useState(null);
  const [showAdd,   setShowAdd]   = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showMap,   setShowMap]   = useState(false);
  const [notifPerm, setNotifPerm] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'denied');
  const [loaded,    setLoaded]    = useState(false);

  // Apply dark mode class to :root
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("tl-dark", dark ? "1" : "0"); } catch {}
  }, [dark]);

  // Load username
  useEffect(() => {
    (async () => {
      const saved = await sGet("tl-username");
      if (saved) setUsername(saved);
    })();
  }, []);

  // Load events
  useEffect(() => {
    if (!username) return;
    (async () => {
      const saved = await sGet("tl-events-v7");
      let base;
      if (saved && saved.length) {
        // Merge: keep saved events, add any new seed events not yet in storage
        const savedIds = new Set(saved.map(e => e.id));
        const newSeeds = SEED_EVENTS.filter(e => !savedIds.has(e.id));
        base = newSeeds.length ? [...saved, ...newSeeds] : saved;
      } else {
        base = SEED_EVENTS;
      }
      setEvents(base);
      const savedVenues = await sGet("tl-venues-v1");
      if (savedVenues && savedVenues.length) setCustomVenues(savedVenues);
      setLoaded(true);
      // Fetch missing images in background — don't block UI
      const needsImg = base.filter(e => !e.image);
      if (needsImg.length) {
        const updated = [...base];
        await Promise.all(needsImg.map(async m => {
          const img = await fetchEventImage(m.title, m.venue);
          if (img) {
            const idx = updated.findIndex(x => x.id === m.id);
            if (idx >= 0) updated[idx] = { ...updated[idx], image: img };
          }
        }));
        setEvents([...updated]);
        sSet("tl-events-v7", updated);
      }
    })();
  }, [username]);

  // Persist events
  useEffect(() => {
    if (loaded) sSet("tl-events-v7", events);
  }, [events, loaded]);
  useEffect(() => { if (loaded) sSet("tl-venues-v1", customVenues); }, [customVenues, loaded]);

  const handleJoin = async (name) => {
    setUsername(name);
    await sSet("tl-username", name);
  };

  const addEvent = async (ev) => {
    setEvents(prev => [ev, ...prev]);
    // Fetch image in background for new events
    if (!ev.image) {
      const img = await fetchEventImage(ev.title, ev.venue);
      if (img) {
        setEvents(prev => prev.map(e => e.id === ev.id ? {...e, image: img} : e));
      }
    }
  };

  const addVenue = async (v) => {
    setCustomVenues(prev => [...prev, v]);
    setVenueStatus({ name: v.name, loading: true });
    // Fetch upcoming events for this venue in background
    const rawEvents = await fetchVenueEvents(v);
    if (rawEvents.length) {
      const newEvents = rawEvents.map((e, i) => ({
        id: `v-ev-${Date.now()}-${i}`,
        title:    e.title    || "Untitled",
        venue:    v.name,
        category: e.category || "Performance Art",
        date:     e.date     || "",
        time:     e.time     || "7:30 PM",
        price:    e.price    || "",
        blurb:    e.blurb    || "",
        url:      e.url      || v.url || "",
        addedBy:  "system",
        going:    [],
        interested: [],
        image:    null,
      }));
      let freshCount = 0;
      setEvents(prev => {
        const existing = new Set(prev.map(e => e.title.toLowerCase() + e.venue.toLowerCase()));
        const fresh = newEvents.filter(e =>
          !existing.has(e.title.toLowerCase() + e.venue.toLowerCase())
        );
        freshCount = fresh.length;
        return [...prev, ...fresh];
      });
      setVenueStatus({ name: v.name, loading: false, count: freshCount });
      setTimeout(() => setVenueStatus(null), 4000);
      // Fetch images for new events
      newEvents.forEach(async (ev) => {
        const img = await fetchEventImage(ev.title, ev.venue);
        if (img) {
          setEvents(prev => prev.map(e =>
            e.id === ev.id ? {...e, image: img} : e
          ));
        }
      });
    } else {
      setVenueStatus({ name: v.name, loading: false, count: 0 });
      setTimeout(() => setVenueStatus(null), 3000);
    }
  };

  const requestNotifications = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

    // iOS Safari only supports notifications when installed as a PWA
    if (isIOS && !isStandalone) {
      alert('To enable notifications on iPhone:\n\n1. Tap the Share button (box with arrow) in Safari\n2. Tap "Add to Home Screen"\n3. Open The List from your home screen\n4. Tap the bell again to enable notifications');
      return;
    }

    if (typeof Notification === 'undefined') {
      alert('Notifications aren\'t supported in this browser. Try opening The List in Safari or Chrome.');
      return;
    }
    if (Notification.permission === 'granted') {
      new Notification('The List', { body: 'Notifications are already on!' });
      return;
    }
    if (Notification.permission === 'denied') {
      alert('Notifications are blocked. Go to your browser Settings → Site Settings → Notifications and allow The List, then try again.');
      return;
    }
    const perm = await Notification.requestPermission();
    setNotifPerm(perm);
    if (perm === 'granted') {
      new Notification('The List', { body: 'You\'ll be notified when friends RSVP! 🎭' });
    }
  };

  const sendNotification = (title, body) => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    try { new Notification(title, { body }); } catch {}
  };

  const rsvp = (id, status) => {
    // Notify crew when someone marks going
    if (status === 'going') {
      const ev = events.find(e => e.id === id);
      if (ev) sendNotification(username + ' is going!', ev.title + ' · ' + ev.venue);
    }
    setEvents(prev => prev.map(ev => {
      if (ev.id !== id) return ev;
      let going      = [...(ev.going||[])];
      let interested = [...(ev.interested||[])];
      // remove from both first
      going      = going.filter(n=>n!==username);
      interested = interested.filter(n=>n!==username);
      if (status==="going")      going.push(username);
      if (status==="interested") interested.push(username);
      return {...ev,going,interested};
    }));
    // Update selected if open
    setSelected(prev => {
      if (!prev||prev.id!==id) return prev;
      let going      = [...(prev.going||[])];
      let interested = [...(prev.interested||[])];
      going      = going.filter(n=>n!==username);
      interested = interested.filter(n=>n!==username);
      if (status==="going")      going.push(username);
      if (status==="interested") interested.push(username);
      return {...prev,going,interested};
    });
  };

  const visible = events
    .filter(e => {
      if (view==="upcoming" && isPast(e.date)) return false;
      if (view==="past"        && !isPast(e.date)) return false;
      if (view==="going"       && !(e.going||[]).includes(username)) return false;
      if (view==="interested"  && !(e.interested||[]).includes(username)) return false;
      if (cat!=="All"          && e.category!==cat) return false;
      if (venueFilter!=="All"  && e.venue!==venueFilter) return false;
      return true;
    })
    .sort((a,b)=>new Date(a.date)-new Date(b.date));

  if (!username) return <Onboarding onJoin={handleJoin}/>;

  // Derive sorted unique venue list from all events
  // Merge static list + custom venues + any venues from events
  const allVenueNames = [
    ...VENUES.filter(v=>v!=="Other"),
    ...customVenues.map(v=>v.name),
    ...events.map(e=>e.venue),
  ];
  const venueList = ["All", ...Array.from(new Set(allVenueNames)).sort()];
  // Full venue objects for display
  const allVenueObjects = [
    ...VENUES.filter(v=>v!=="Other").map(n=>({name:n,id:n})),
    ...customVenues,
  ];

  const myCount         = events.filter(e=>(e.going||[]).includes(username)).length;
  const interestedCount = events.filter(e=>(e.interested||[]).includes(username)).length;

  return (
    <div style={{minHeight:"100vh",background:"var(--cream)"}}>
      <style>{CSS}</style>

      {/* ── HEADER ── */}
      <header style={{
        position:"sticky",top:0,zIndex:500,
        background:"var(--surface2)",borderBottom:"1px solid var(--line)",
      }}>
        {/* Top bar */}
        <div style={{
          maxWidth:900,margin:"0 auto",
          display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"10px 14px",
        }}>
          <div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:"0.2em",color:"var(--gold)",textTransform:"uppercase",marginBottom:1}}>
              New York
            </div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,lineHeight:1}}>
              The List
            </h1>
          </div>

          <div style={{display:"flex",gap:8,alignItems:"center"}}>
<div style={{
              fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",
              padding:"7px 10px",border:"1px solid var(--line)",background:"var(--surface)",
              letterSpacing:"0.06em",whiteSpace:"nowrap",maxWidth:90,overflow:"hidden",textOverflow:"ellipsis",
            }}>
              {username}
            </div>

            {/* Dark mode toggle */}
            <button onClick={()=>setDark(d=>!d)} style={{
              padding:0,width:40,height:40,background:"transparent",
              border:"1px solid var(--line)",color:"var(--muted)",
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
              transition:"color .2s",
            }} title={dark ? "Light mode" : "Dark mode"}>
              <Icon name={dark ? "sun" : "moon"} size={15}/>
            </button>

            {/* Map button */}
            <button onClick={()=>setShowMap(true)} style={{
              padding:0,width:40,height:40,background:"transparent",border:"1px solid var(--line)",
              color:"var(--muted)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
            }}><Icon name="map" size={15}/></button>

            {/* Notifications bell */}
            <button onClick={requestNotifications} style={{
              padding:0,width:40,height:40,background:"transparent",
              border:"1px solid var(--line)",
              color: notifPerm === 'granted' ? 'var(--gold)' : 'var(--muted)',
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
            }} title={notifPerm === 'granted' ? 'Notifications on' : 'Enable notifications'}>
              <Icon name={notifPerm === "granted" ? "bell" : "bellOff"} size={15} color={notifPerm === "granted" ? "var(--gold)" : "var(--muted)"}/>
            </button>

            <button onClick={()=>setShowShare(true)} style={{
              padding:0,width:40,height:40,background:"transparent",border:"1px solid var(--line)",
              color:"var(--muted)",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",
            }}><Icon name="share" size={14}/></button>

            <button onClick={()=>setShowAdd(true)} style={{
              padding:"7px 12px",background:"var(--ink)",border:"none",color:"var(--cream)",
              fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",
              textTransform:"uppercase",cursor:"pointer",whiteSpace:"nowrap",
            }}><span style={{display:"flex",alignItems:"center",gap:4}}><Icon name="plus" size={13} color="var(--cream)"/>Add</span></button>
          </div>
        </div>

        {/* View tabs row */}
        <div style={{
          maxWidth:900,margin:"0 auto",
          display:"flex",gap:0,padding:"0 16px",
          borderTop:"1px solid var(--line)",overflowX:"auto",
          WebkitOverflowScrolling:"touch",
        }}>
          {[
            {key:"upcoming",   label:"Upcoming"},
            {key:"going",      label:`Going (${myCount})`},
            {key:"interested", label:`Interested (${interestedCount})`},
            {key:"past",       label:"Past"},
          ].map(({key,label})=>(
            <button key={key} onClick={()=>setView(key)} style={{
              padding:"12px 14px",minHeight:44,
              fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.08em",
              textTransform:"uppercase",cursor:"pointer",background:"transparent",border:"none",
              color:view===key?"var(--ink)":"var(--muted)",
              borderBottom:view===key?"2px solid var(--ink)":"2px solid transparent",
              transition:"all .2s",whiteSpace:"nowrap",flexShrink:0,
            }}>{label}</button>
          ))}
        </div>

        {/* Venue + Category filter row */}
        <div style={{
          maxWidth:900,margin:"0 auto",
          display:"flex",alignItems:"center",gap:8,
          padding:"8px 16px",
          borderTop:"1px solid var(--line)",
          overflowX:"auto",WebkitOverflowScrolling:"touch",
        }}>
          {/* Venue dropdown */}
          <div style={{position:"relative",flexShrink:0}}>
            <select
              value={venueFilter}
              onChange={e=>{
                if(e.target.value==="__add__"){setShowAddVenue(true);}
                else{setVenueFilter(e.target.value);}
              }}
              style={{
                appearance:"none",WebkitAppearance:"none",
                padding:"6px 24px 6px 10px",
                background: venueFilter==="All" ? "var(--surface)" : "var(--ink)",
                border:"1px solid var(--line)",
                fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.04em",
                color: venueFilter==="All" ? "var(--muted)" : "var(--cream)",
                cursor:"pointer",outline:"none",
                maxWidth:170,
              }}
            >
              <option value="All">All Venues</option>
              {venueList.filter(v=>v!=="All").map(v=>(
                <option key={v} value={v}>{v}</option>
              ))}
              <option value="__add__">+ Add venue…</option>
            </select>
            <span style={{
              position:"absolute",right:7,top:"50%",transform:"translateY(-50%)",
              pointerEvents:"none",fontSize:8,
              color: venueFilter==="All" ? "var(--muted)" : "var(--cream)",
            }}><Icon name="chevronDown" size={10} color={venueFilter==="All"?"var(--muted)":"var(--cream)"}/></span>
          </div>

          {/* Divider */}
          <div style={{width:1,height:18,background:"var(--line)",flexShrink:0}}/>

          {/* Category pills */}
          {CATS.map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{
              padding:"5px 10px",flexShrink:0,
              fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.08em",
              textTransform:"uppercase",cursor:"pointer",
              background: cat===c ? "var(--gold)" : "transparent",
              border: cat===c ? "1px solid var(--gold)" : "1px solid transparent",
              color: cat===c ? "#fff" : "var(--muted)",
              borderRadius:2,transition:"all .15s",whiteSpace:"nowrap",
            }}>{c}</button>
          ))}
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{maxWidth:900,margin:"0 auto",padding:"32px 24px 80px"}}>

        {/* Section header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:24}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,fontStyle:"italic"}}>
            {venueFilter !== "All"
              ? venueFilter
              : view==="upcoming"   ? "What's On"
              : view==="going"      ? "You're Going"
              : view==="interested" ? "You're Interested"
              : "Archive"}
          </h2>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--muted)"}}>
            {visible.length} {visible.length===1?"event":"events"}
          </span>
        </div>

        {visible.length===0 ? (
          <div style={{
            textAlign:"center",padding:"80px 0",
            fontFamily:"'Playfair Display',serif",fontSize:18,
            fontStyle:"italic",color:"var(--muted)",
          }}>
            {view==="going"
              ? "You haven't marked anything going yet."
              : view==="interested"
              ? "Nothing marked as interested yet."
              : "Nothing here yet."}
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:1}}>
            {visible.map((e,i)=>(
              <div key={e.id} className="fade-in" style={{animationDelay:`${i*0.04}s`}}>
                <EventCard event={e} username={username} onOpen={setSelected}/>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop:"1px solid var(--line)",padding:"20px 24px",
        display:"flex",justifyContent:"center",
      }}>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--muted)",letterSpacing:"0.12em"}}>
          THE LIST · NEW YORK · {new Date().getFullYear()}
        </span>
      </footer>

      {/* Venue status toast */}
      {venueStatus && (
        <div style={{
          position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",
          zIndex:2000,
          background:"var(--ink)",color:"var(--cream)",
          padding:"12px 20px",
          fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:"0.1em",
          boxShadow:"0 8px 32px rgba(14,14,14,.3)",
          whiteSpace:"nowrap",
          animation:"fadeIn .3s ease",
        }}>
          {venueStatus.loading
            ? `SEARCHING EVENTS AT ${venueStatus.name.toUpperCase()}…`
            : venueStatus.count > 0
              ? `${venueStatus.count} EVENT${venueStatus.count>1?"S":""} ADDED FROM ${venueStatus.name.toUpperCase()}`
              : `NO UPCOMING EVENTS FOUND AT ${venueStatus.name.toUpperCase()}`
          }
        </div>
      )}

      {/* ── MODALS ── */}
      {selected && (
        <EventModal
          event={selected}
          username={username}
          onClose={()=>setSelected(null)}
          onRsvp={(id,status)=>{rsvp(id,status);}}
        />
      )}
      {showAdd && (
        <AddModal
          onAdd={addEvent}
          onClose={()=>setShowAdd(false)}
          username={username}
          venueList={venueList}
        />
      )}
      {showShare && (
        <ShareModal
          username={username}
          onClose={()=>setShowShare(false)}
        />
      )}
      {showAddVenue && (
        <AddVenueModal
          onAdd={addVenue}
          onClose={()=>setShowAddVenue(false)}
          existingVenues={allVenueObjects}
        />
      )}
      {showMap && (
        <MapModal
          venues={allVenueObjects}
          events={events}
          onClose={()=>setShowMap(false)}
        />
      )}
    </div>
  );
}
