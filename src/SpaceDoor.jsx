import { useState, useMemo } from "react";

// ─── SVG PROFILE SHAPE RENDERERS ─────────────────────────────────────────────
const Shapes = {
  T_SECTION: ({a}) => <g>
    <rect x="5" y="8" width="70" height="12" rx="1.5" fill={a} opacity="0.9"/>
    <rect x="32" y="20" width="16" height="32" rx="1.5" fill={a} opacity="0.75"/>
  </g>,
  T_SLIM: ({a}) => <g>
    <rect x="10" y="10" width="60" height="9" rx="1.5" fill={a} opacity="0.9"/>
    <rect x="33" y="19" width="14" height="30" rx="1.5" fill={a} opacity="0.75"/>
  </g>,
  T_WIDE: ({a}) => <g>
    <rect x="2" y="8" width="76" height="11" rx="1.5" fill={a} opacity="0.9"/>
    <rect x="34" y="19" width="12" height="32" rx="1.5" fill={a} opacity="0.75"/>
  </g>,
  FLAT: ({a}) => <g>
    <rect x="5" y="26" width="70" height="10" rx="2" fill={a} opacity="0.9"/>
  </g>,
  FLAT_SLIM: ({a}) => <g>
    <rect x="5" y="28" width="70" height="6" rx="1.5" fill={a} opacity="0.85"/>
  </g>,
  U_CHANNEL: ({a}) => <g>
    <rect x="8" y="14" width="8" height="34" rx="1.5" fill={a} opacity="0.9"/>
    <rect x="8" y="44" width="56" height="8" rx="1.5" fill={a} opacity="0.9"/>
    <rect x="64" y="14" width="8" height="34" rx="1.5" fill={a} opacity="0.9"/>
  </g>,
  I_SECTION: ({a}) => <g>
    <rect x="20" y="8" width="40" height="9" rx="1.5" fill={a} opacity="0.9"/>
    <rect x="34" y="17" width="12" height="28" rx="1.5" fill={a} opacity="0.75"/>
    <rect x="20" y="45" width="40" height="9" rx="1.5" fill={a} opacity="0.9"/>
  </g>,
  I_SLIM: ({a}) => <g>
    <rect x="24" y="10" width="32" height="7" rx="1.5" fill={a} opacity="0.9"/>
    <rect x="35" y="17" width="10" height="28" rx="1.5" fill={a} opacity="0.75"/>
    <rect x="24" y="45" width="32" height="7" rx="1.5" fill={a} opacity="0.9"/>
  </g>,
  ISH: ({a}) => <g>
    <rect x="15" y="22" width="50" height="7" rx="1.5" fill={a} opacity="0.9"/>
    <rect x="34" y="13" width="12" height="9" rx="1" fill={a} opacity="0.7"/>
    <rect x="34" y="29" width="12" height="9" rx="1" fill={a} opacity="0.7"/>
  </g>,
  L_SECTION: ({a}) => <g>
    <rect x="10" y="8" width="10" height="46" rx="1.5" fill={a} opacity="0.9"/>
    <rect x="10" y="44" width="56" height="10" rx="1.5" fill={a} opacity="0.9"/>
  </g>,
  C_CHANNEL: ({a}) => <g>
    <rect x="15" y="10" width="8" height="42" rx="1.5" fill={a} opacity="0.9"/>
    <rect x="15" y="10" width="50" height="8" rx="1.5" fill={a} opacity="0.9"/>
    <rect x="15" y="44" width="50" height="8" rx="1.5" fill={a} opacity="0.9"/>
  </g>,
  SIDE_FRAME: ({a}) => <g>
    <rect x="20" y="5" width="14" height="52" rx="2" fill={a} opacity="0.85"/>
    <rect x="34" y="10" width="26" height="7" rx="1.5" fill={a} opacity="0.55"/>
    <rect x="34" y="45" width="26" height="7" rx="1.5" fill={a} opacity="0.55"/>
  </g>,
  BOX: ({a}) => <g>
    <rect x="14" y="10" width="52" height="42" rx="2" fill="none" stroke={a} strokeWidth="7" opacity="0.85"/>
  </g>,
  BIFOLD: ({a}) => <g>
    <rect x="6" y="8" width="12" height="46" rx="2" fill={a} opacity="0.85"/>
    <rect x="62" y="8" width="12" height="46" rx="2" fill={a} opacity="0.85"/>
    <path d="M18 20 Q40 30 62 20" fill="none" stroke={a} strokeWidth="3" opacity="0.55"/>
    <path d="M18 42 Q40 32 62 42" fill="none" stroke={a} strokeWidth="3" opacity="0.55"/>
    <circle cx="40" cy="31" r="4" fill={a} opacity="0.5"/>
  </g>,
  Z_SECTION: ({a}) => <g>
    <rect x="8" y="8" width="36" height="9" rx="1.5" fill={a} opacity="0.9"/>
    <rect x="26" y="17" width="10" height="26" rx="1.5" fill={a} opacity="0.75"/>
    <rect x="36" y="43" width="36" height="9" rx="1.5" fill={a} opacity="0.9"/>
  </g>,
  MULLION: ({a}) => <g>
    <rect x="5" y="8" width="70" height="9" rx="1.5" fill={a} opacity="0.9"/>
    <rect x="33" y="17" width="14" height="14" rx="1" fill={a} opacity="0.7"/>
    <rect x="5" y="31" width="70" height="9" rx="1.5" fill={a} opacity="0.9"/>
    <rect x="33" y="40" width="14" height="12" rx="1" fill={a} opacity="0.7"/>
  </g>,
  SILL: ({a}) => <g>
    <rect x="5" y="33" width="70" height="13" rx="2" fill={a} opacity="0.85"/>
    <rect x="14" y="26" width="52" height="7" rx="1.5" fill={a} opacity="0.6"/>
  </g>,
  TRACK: ({a}) => <g>
    <rect x="5" y="18" width="70" height="26" rx="2" fill={a} opacity="0.12"/>
    <rect x="5" y="18" width="70" height="26" rx="2" fill="none" stroke={a} strokeWidth="2.5" opacity="0.7"/>
    <rect x="16" y="24" width="8" height="14" rx="1" fill={a} opacity="0.75"/>
    <rect x="36" y="24" width="8" height="14" rx="1" fill={a} opacity="0.75"/>
    <rect x="56" y="24" width="8" height="14" rx="1" fill={a} opacity="0.75"/>
  </g>,
  PERFECT: ({a}) => <g>
    <rect x="5" y="14" width="70" height="34" rx="3" fill={a} opacity="0.1"/>
    <rect x="5" y="14" width="70" height="34" rx="3" fill="none" stroke={a} strokeWidth="2.5" opacity="0.75"/>
    <rect x="5" y="23" width="70" height="4" rx="1" fill={a} opacity="0.45"/>
    <rect x="5" y="35" width="70" height="4" rx="1" fill={a} opacity="0.45"/>
    <circle cx="22" cy="31" r="4.5" fill={a} opacity="0.65"/>
    <circle cx="40" cy="31" r="4.5" fill={a} opacity="0.65"/>
    <circle cx="58" cy="31" r="4.5" fill={a} opacity="0.65"/>
  </g>,
  PANEL: ({a}) => <g>
    <rect x="5" y="14" width="70" height="34" rx="3" fill={a} opacity="0.18"/>
    <rect x="5" y="14" width="70" height="34" rx="3" fill="none" stroke={a} strokeWidth="2.5" opacity="0.65"/>
  </g>,
};

function getShapeKey(name) {
  const n = name.toUpperCase();
  if (n.includes("SFPS")) {
    if (n.includes("TTC") || n.includes("TTS")) return "TRACK";
    if (n.includes("1T_DP")) return "MULLION";
    if (n.includes("_T") || n.includes("2T") || n.includes("3T")) return "T_SECTION";
    if (n.includes("IN")) return "I_SECTION";
    return "PERFECT";
  }
  if (n.includes("SF68") || n.includes("SF45") || n.includes("-BF")) return "BIFOLD";
  if (n.endsWith("-3T") || n.endsWith("-4T") || n.endsWith("-3TN")) return "T_WIDE";
  if (/-[12]TN?$/.test(n) || n.endsWith("-TS") || n.endsWith("-TW") || n.endsWith("-TD")) return "T_SLIM";
  if (/-[1-4]T$/.test(n) || n.endsWith("-T")) return "T_SECTION";
  if (n.endsWith("-3B") || n.endsWith("-4B")) return "U_CHANNEL";
  if (n.endsWith("-2B") || n.endsWith("-B") || n.endsWith("-BH") || n.endsWith("-BL")) return "SILL";
  if (n.endsWith("-3S") || n.endsWith("-4S")) return "SIDE_FRAME";
  if (n.endsWith("-IS") || n.endsWith("-2S")) return "C_CHANNEL";
  if (n.endsWith("-1S")) return "L_SECTION";
  if (n.endsWith("-ISH") || n.endsWith("-IH")) return "ISH";
  if (n.endsWith("-IL")) return "I_SLIM";
  if (n.endsWith("-ITB") || n.endsWith("-I") || n.endsWith("-IN")) return "I_SECTION";
  if (n.endsWith("-P") || n.endsWith("-P2") || n.endsWith("-C")) return "FLAT_SLIM";
  if (n.endsWith("-JB")) return "Z_SECTION";
  if (n.endsWith("-U") || n.endsWith("-O")) return "BOX";
  if (n.endsWith("-M")) return "FLAT";
  if (n.endsWith("-S") && !n.endsWith("-IS")) return "C_CHANNEL";
  return "PANEL";
}

function ProfileSVG({ name, accent, bg }) {
  const key = getShapeKey(name);
  const Shape = Shapes[key] || Shapes.PANEL;
  return (
    <svg viewBox="0 0 80 62" width="80" height="62" style={{ display:"block" }}>
      <rect x="0" y="0" width="80" height="62" rx="6" fill={bg}/>
      <line x1="0" y1="31" x2="80" y2="31" stroke={accent} strokeWidth="0.4" opacity="0.12"/>
      <line x1="40" y1="0" x2="40" y2="62" stroke={accent} strokeWidth="0.4" opacity="0.12"/>
      <Shape a={accent}/>
    </svg>
  );
}

// ─── PROFILE PREVIEW (Image → SVG fallback) ───────────────────────────────────
// If design.image URL is set → shows real photo
// If null or broken → falls back to SVG shape illustration
// To add images later: set image:"https://..." in the designs array.
function ProfilePreview({ design, accent, bg }) {
  const [imgErr, setImgErr] = useState(false);
  const showImage = design.image && !imgErr;

  if (showImage) {
    return (
      <div style={{
        width:80, height:62, borderRadius:6, overflow:"hidden",
        display:"flex", alignItems:"center", justifyContent:"center",
        background:bg, position:"relative",
      }}>
        <img
          src={design.image}
          alt={design.name}
          onError={()=>setImgErr(true)}
          style={{width:"100%",height:"100%",objectFit:"contain",display:"block",padding:"4px"}}
        />
        <span style={{
          position:"absolute",bottom:2,left:3,
          fontSize:"7px",fontWeight:800,letterSpacing:"0.06em",
          color:accent,opacity:0.55,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",
        }}>IMG</span>
      </div>
    );
  }

  return <ProfileSVG name={design.name} accent={accent} bg={bg}/>;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
// NOTE: Add image URLs in the `image` field for each profile.
// Example: image: "https://your-cdn.com/profiles/SF16-1T.png"
// When image is set → shows real photo. When null → shows SVG shape fallback.
const designs = [
  {id:1,  name:"SF16-1T",   series:"SPACEDOR-16",    size:"53 × 80 mm",    image:null},
  {id:2,  name:"SF16-1S",   series:"SPACEDOR-16",    size:"55 × 33 mm",    image:null},
  {id:3,  name:"SF16-P",    series:"SPACEDOR-16",    size:"80 × 8 mm",     image:null},
  {id:4,  name:"SF16-2T",   series:"SPACEDOR-16",    size:"115 × 71 mm",   image:null},
  {id:5,  name:"SF16-2S",   series:"SPACEDOR-16",    size:"115 × 36 mm",   image:null},
  {id:6,  name:"SF16-2B",   series:"SPACEDOR-16",    size:"115 × 8 mm",    image:null},
  {id:7,  name:"SF16-ITB",  series:"SPACEDOR-16",    size:"45 × 30.2 mm",  image:null},
  {id:8,  name:"SF16-ISH",  series:"SPACEDOR-16",    size:"53.2 × 16 mm",  image:null},
  {id:9,  name:"SF16-IS",   series:"SPACEDOR-16",    size:"45 × 16 mm",    image:null},
  {id:10, name:"SF16-I",    series:"SPACEDOR-16",    size:"49.3 × 26 mm",  image:null},
  {id:11, name:"SF16-3T",   series:"SPACEDOR-16",    size:"172 × 80 mm",   image:null},
  {id:12, name:"SF16-3S",   series:"SPACEDOR-16",    size:"172 × 30 mm",   image:null},
  {id:13, name:"SF16-3B",   series:"SPACEDOR-16",    size:"172 × 8 mm",    image:null},
  {id:14, name:"SF16-C",    series:"SPACEDOR-16",    size:"50 × 16.2 mm",  image:null},
  {id:15, name:"SF16-3TN",  series:"SPACEDOR-16",    size:"55.4 × 36 mm",  image:null},
  {id:16, name:"SF16-2TN",  series:"SPACEDOR-16",    size:"169.4 × 36 mm", image:null},
  {id:17, name:"SF16-1TN",  series:"SPACEDOR-16",    size:"112.4 × 36 mm", image:null},
  {id:18, name:"SF16-IL",   series:"SPACEDOR-16",    size:"33.7 × 12.1 mm",image:null},
  {id:19, name:"SF16-P2",   series:"SPACEDOR-16",    size:"80 × 6.8 mm",   image:null},
  {id:20, name:"SF15-2T",   series:"SPACEDOR-15",    size:"68.6 × 36 mm",  image:null},
  {id:21, name:"SF15-2B",   series:"SPACEDOR-15",    size:"71 × 23.2 mm",  image:null},
  {id:22, name:"SF15-3T",   series:"SPACEDOR-15",    size:"102 × 35.5 mm", image:null},
  {id:23, name:"SF15-3B",   series:"SPACEDOR-15",    size:"104 × 10.1 mm", image:null},
  {id:24, name:"SF15-3S",   series:"SPACEDOR-15",    size:"104 × 9 mm",    image:null},
  {id:25, name:"SF15-IT",   series:"SPACEDOR-15",    size:"33 × 24.2 mm",  image:null},
  {id:26, name:"SF15-IS",   series:"SPACEDOR-15",    size:"24.3 × 27 mm",  image:null},
  {id:27, name:"SF15-I",    series:"SPACEDOR-15",    size:"25 × 30.5 mm",  image:null},
  {id:28, name:"SF15-IB",   series:"SPACEDOR-15",    size:"29.4 × 6.5 mm", image:null},
  {id:29, name:"SF15-ISH",  series:"SPACEDOR-15",    size:"24.9 × 12.4 mm",image:null},
  {id:30, name:"SF15-4T",   series:"SPACEDOR-15",    size:"136.4 × 35.5 mm",image:null},
  {id:31, name:"SF15-4S",   series:"SPACEDOR-15",    size:"140 × 25.4 mm", image:null},
  {id:32, name:"SF15-4B",   series:"SPACEDOR-15",    size:"139.5 × 8 mm",  image:null},
  {id:33, name:"SF18-T",    series:"SPACEDOR-18",    size:"80 × 56 mm",    image:null},
  {id:34, name:"SF18-S",    series:"SPACEDOR-18",    size:"74 × 12 mm",    image:null},
  {id:35, name:"SF18-B",    series:"SPACEDOR-18",    size:"45 × 18 mm",    image:null},
  {id:36, name:"SF18-I",    series:"SPACEDOR-18",    size:"38 × 21.7 mm",  image:null},
  {id:37, name:"SF18-IH",   series:"SPACEDOR-18",    size:"44.9 × 9.5 mm", image:null},
  {id:38, name:"SF25-TS",   series:"SPACEDOR-25",    size:"77 × 52.7 mm",  image:null},
  {id:39, name:"SF25-I",    series:"SPACEDOR-25",    size:"35.5 × 25.4 mm",image:null},
  {id:40, name:"SF25-C",    series:"SPACEDOR-25",    size:"36 × 29 mm",    image:null},
  {id:41, name:"SF25-U",    series:"SPACEDOR-25",    size:"40 × 25.8 mm",  image:null},
  {id:42, name:"SF25-IH",   series:"SPACEDOR-25",    size:"42.7 × 7.5 mm", image:null},
  {id:43, name:"SF80-O",    series:"SPACEDOR-80",    size:"37 × 80 mm",    image:null},
  {id:44, name:"SF80-M",    series:"SPACEDOR-80",    size:"80 × 18.5 mm",  image:null},
  {id:45, name:"SF80-B",    series:"SPACEDOR-80",    size:"35.5 × 11 mm",  image:null},
  {id:46, name:"SF80-I",    series:"SPACEDOR-80",    size:"40 × 18 mm",    image:null},
  {id:47, name:"SFSP-S",    series:"SPACEDOR-S&P",   size:"64 × 55.2 mm",  image:null},
  {id:48, name:"SFSP-I",    series:"SPACEDOR-S&P",   size:"34 × 59.6 mm",  image:null},
  {id:49, name:"SFSP-T",    series:"SPACEDOR-S&P",   size:"50.4 × 58.5 mm",image:null},
  {id:50, name:"SFSP-BH",   series:"SPACEDOR-S&P",   size:"50.4 × 50.4 mm",image:null},
  {id:51, name:"SFSP-BL",   series:"SPACEDOR-S&P",   size:"50 × 12 mm",    image:null},
  {id:52, name:"SF58-T",    series:"SPACEDOR-58",    size:"69.4 × 50.1 mm",image:null},
  {id:53, name:"SF58-S",    series:"SPACEDOR-58",    size:"58.4 × 49.6 mm",image:null},
  {id:54, name:"SF58-B",    series:"SPACEDOR-58",    size:"58 × 55.4 mm",  image:null},
  {id:55, name:"SF58-I",    series:"SPACEDOR-58",    size:"63 × 30.2 mm",  image:null},
  {id:56, name:"SF68-BF1",  series:"SF68-Bi FOLD",   size:"77.3 × 53 mm",  image:null},
  {id:57, name:"SF68-BF2",  series:"SF68-Bi FOLD",   size:"68 × 42.9 mm",  image:null},
  {id:58, name:"SF68-BF3",  series:"SF68-Bi FOLD",   size:"68 × 56.5 mm",  image:null},
  {id:59, name:"SF68-BF4",  series:"SF68-Bi FOLD",   size:"65.2 × 38.3 mm",image:null},
  {id:60, name:"SF45-TW",   series:"SF45-Bi FOLD",   size:"70.6 × 65 mm",  image:null},
  {id:61, name:"SF45-TD",   series:"SF45-Bi FOLD",   size:"42 × 44.2 mm",  image:null},
  {id:62, name:"SF45-JB",   series:"SF45-Bi FOLD",   size:"32 × 23.6 mm",  image:null},
  {id:63, name:"SF45-IN",   series:"SF45-Bi FOLD",   size:"65 × 35.5 mm",  image:null},
  {id:64, name:"SFPS-1T",   series:"PERFECT SYSTEM", size:"90.8 mm",       image:null},
  {id:65, name:"SFPS-1T_DP",series:"PERFECT SYSTEM", size:"90.8 mm",       image:null},
  {id:66, name:"SFPS-2T",   series:"PERFECT SYSTEM", size:"90.8 mm",       image:null},
  {id:67, name:"SFPS-3T",   series:"PERFECT SYSTEM", size:"90.8 mm",       image:null},
  {id:68, name:"SFPS-IN_S", series:"PERFECT SYSTEM", size:"90.8 mm",       image:null},
  {id:69, name:"SFPS-TTC1", series:"PERFECT SYSTEM", size:"90.8 mm",       image:null},
  {id:70, name:"SFPS-TTS1", series:"PERFECT SYSTEM", size:"90.8 mm",       image:null},
];

const PAL = {
  "SPACEDOR-16":    {accent:"#4F46E5",light:"#EEF2FF",badge:"#C7D2FE",text:"#3730A3"},
  "SPACEDOR-15":    {accent:"#059669",light:"#ECFDF5",badge:"#A7F3D0",text:"#065F46"},
  "SPACEDOR-18":    {accent:"#EA580C",light:"#FFF7ED",badge:"#FED7AA",text:"#9A3412"},
  "SPACEDOR-25":    {accent:"#DB2777",light:"#FDF2F8",badge:"#FBCFE8",text:"#9D174D"},
  "SPACEDOR-80":    {accent:"#0284C7",light:"#F0F9FF",badge:"#BAE6FD",text:"#0369A1"},
  "SPACEDOR-S&P":   {accent:"#7C3AED",light:"#F5F3FF",badge:"#DDD6FE",text:"#5B21B6"},
  "SPACEDOR-58":    {accent:"#B45309",light:"#FFFBEB",badge:"#FDE68A",text:"#92400E"},
  "SF68-Bi FOLD":   {accent:"#0F766E",light:"#F0FDFA",badge:"#99F6E4",text:"#134E4A"},
  "SF45-Bi FOLD":   {accent:"#A21CAF",light:"#FDF4FF",badge:"#F5D0FE",text:"#701A75"},
  "PERFECT SYSTEM": {accent:"#1E293B",light:"#F8FAFC",badge:"#CBD5E1",text:"#0F172A"},
};

// ─── ICONS ────────────────────────────────────────────────────────────────────
const I = {
  Plus:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"><line x1="12" y1="4" x2="12" y2="20"/><line x1="4" y1="12" x2="20" y2="12"/></svg>,
  Trash:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  Download:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Search:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Cart:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  Check:()=><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Grid:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  List:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1.5" fill="currentColor"/><circle cx="3" cy="12" r="1.5" fill="currentColor"/><circle cx="3" cy="18" r="1.5" fill="currentColor"/></svg>,
};

// ─── DESIGN CARD ──────────────────────────────────────────────────────────────
function DesignCard({ design, onAdd, isSelected, viewMode }) {
  const [qty, setQty] = useState(1);
  const p = PAL[design.series] || PAL["PERFECT SYSTEM"];

  const doAdd = () => {
    if (!qty || qty < 1) return;
    onAdd({ ...design, quantity: qty });
    setQty(1);
  };

  // ── List view ──
  if (viewMode === "list") return (
    <div style={{
      background:"#fff",
      border: isSelected ? `2px solid ${p.accent}` : "2px solid #F1F5F9",
      borderRadius:"12px", padding:"10px 14px",
      display:"flex", alignItems:"center", gap:"12px",
      transition:"all 0.18s", boxShadow: isSelected ? `0 2px 16px ${p.accent}22` : "0 1px 3px rgba(0,0,0,0.05)",
    }}>
      <div style={{flexShrink:0,borderRadius:"10px",background:p.light,padding:"3px",border:`1.5px solid ${p.badge}`}}>
        <ProfilePreview design={design} accent={p.accent} bg={p.light}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:"13px",color:"#0F172A",display:"flex",alignItems:"center",gap:"6px"}}>
          {design.name}
          {isSelected && <span style={{background:p.accent,color:"#fff",borderRadius:"99px",fontSize:"9px",padding:"1px 7px",fontWeight:700}}>IN CART</span>}
        </div>
        <div style={{fontSize:"10px",color:p.text,fontWeight:700,marginTop:"2px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{design.series}</div>
        <div style={{fontSize:"11px",color:"#94A3B8",marginTop:"1px"}}>{design.size}</div>
      </div>
      <div style={{display:"flex",gap:"6px",alignItems:"center",flexShrink:0}}>
        <input type="number" min="1" value={qty} onChange={e=>setQty(parseInt(e.target.value)||"")}
          style={{width:"52px",padding:"6px",border:"1.5px solid #E2E8F0",borderRadius:"8px",fontSize:"13px",fontWeight:700,textAlign:"center",outline:"none",fontFamily:"'DM Mono',monospace",color:"#0F172A"}}/>
        <button onClick={doAdd} disabled={!qty||qty<1}
          style={{padding:"7px 14px",background:p.accent,color:"#fff",border:"none",borderRadius:"8px",fontSize:"12px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"4px",opacity:(!qty||qty<1)?0.35:1,transition:"opacity 0.15s"}}>
          <I.Plus/> Add
        </button>
      </div>
    </div>
  );

  // ── Grid view ──
  return (
    <div style={{
      background:"#fff",
      border: isSelected ? `2px solid ${p.accent}` : "2px solid #F1F5F9",
      borderRadius:"14px", padding:"13px",
      display:"flex", flexDirection:"column", gap:"10px",
      transition:"all 0.18s",
      boxShadow: isSelected ? `0 4px 24px ${p.accent}28` : "0 1px 4px rgba(0,0,0,0.06)",
      position:"relative",
    }}>
      {isSelected && (
        <div style={{position:"absolute",top:9,right:9,background:p.accent,borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 8px ${p.accent}55`}}>
          <I.Check/>
        </div>
      )}

      {/* Series badge */}
      <div style={{display:"inline-flex",alignSelf:"flex-start",background:p.badge,color:p.text,fontSize:"9px",fontWeight:800,letterSpacing:"0.07em",padding:"2px 8px",borderRadius:"99px",fontFamily:"'DM Mono',monospace",textTransform:"uppercase"}}>
        {design.series}
      </div>

      {/* SVG Profile preview */}
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",background:p.light,borderRadius:"10px",padding:"6px 8px",border:`1.5px solid ${p.badge}`,position:"relative",minHeight:"74px"}}>
        <ProfilePreview design={design} accent={p.accent} bg={p.light}/>
        <div style={{position:"absolute",bottom:3,right:6,fontSize:"8px",color:p.accent,fontFamily:"'DM Mono',monospace",fontWeight:600,opacity:0.65}}>
          {design.size}
        </div>
      </div>

      {/* Name */}
      <div style={{fontSize:"14px",fontWeight:800,color:"#0F172A",fontFamily:"'DM Mono',monospace",letterSpacing:"-0.02em"}}>
        {design.name}
      </div>

      {/* Qty + Add */}
      <div style={{display:"flex",gap:"6px",alignItems:"center",marginTop:"auto"}}>
        <input type="number" min="1" value={qty} onChange={e=>setQty(parseInt(e.target.value)||"")}
          style={{width:"52px",padding:"7px 6px",border:"1.5px solid #E2E8F0",borderRadius:"8px",fontSize:"13px",fontWeight:700,color:"#0F172A",textAlign:"center",outline:"none",fontFamily:"'DM Mono',monospace"}}/>
        <button onClick={doAdd} disabled={!qty||qty<1}
          style={{flex:1,padding:"8px 10px",background:p.accent,color:"#fff",border:"none",borderRadius:"8px",fontSize:"12px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"4px",opacity:(!qty||qty<1)?0.35:1,transition:"opacity 0.15s"}}>
          <I.Plus/> Add
        </button>
      </div>
    </div>
  );
}

// ─── CART ROW ─────────────────────────────────────────────────────────────────
function CartRow({ item, onRemove, onQtyChange }) {
  const p = PAL[item.series] || PAL["PERFECT SYSTEM"];
  return (
    <tr style={{borderBottom:"1px solid #F1F5F9"}}>
      <td style={{padding:"10px 14px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <div style={{borderRadius:"8px",background:p.light,border:`1.5px solid ${p.badge}`,padding:"3px",flexShrink:0}}>
            <ProfilePreview design={item} accent={p.accent} bg={p.light}/>
          </div>
          <div>
            <div style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:"13px",color:"#0F172A"}}>{item.name}</div>
            <div style={{fontSize:"10px",color:p.text,fontWeight:700,marginTop:"2px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{item.series}</div>
          </div>
        </div>
      </td>
      <td style={{padding:"10px 14px",fontSize:"12px",color:"#64748B",whiteSpace:"nowrap"}}>{item.size}</td>
      <td style={{padding:"10px 14px"}}>
        <input type="number" min="1" value={item.quantity} onChange={e=>onQtyChange(item.id,parseInt(e.target.value)||1)}
          style={{width:"56px",padding:"6px",border:"1.5px solid #E2E8F0",borderRadius:"7px",fontSize:"13px",fontWeight:700,textAlign:"center",color:"#0F172A",fontFamily:"'DM Mono',monospace"}}/>
      </td>
      <td style={{padding:"10px 14px",textAlign:"right"}}>
        <button onClick={()=>onRemove(item.id)}
          style={{background:"#FFF1F2",color:"#E11D48",border:"none",borderRadius:"7px",padding:"6px 8px",cursor:"pointer",display:"inline-flex",alignItems:"center",transition:"background 0.15s"}}
          onMouseOver={e=>e.currentTarget.style.background="#FFE4E6"}
          onMouseOut={e=>e.currentTarget.style.background="#FFF1F2"}>
          <I.Trash/>
        </button>
      </td>
    </tr>
  );
}

// ─── PDF ──────────────────────────────────────────────────────────────────────
async function makePDF(items) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W=210,pH=297,mX=15;
  doc.setFillColor(15,23,42); doc.rect(0,0,W,36,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(16); doc.setTextColor(248,250,252);
  doc.text("SpaceDor Marketing Pte. Ltd.",mX,15);
  doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(148,163,184);
  doc.text("1 Tampines North Drive 1, #07-05/06, T-Space Singapore 528559",mX,22);
  doc.text("T: 6547 8332  |  F: 6547 8384  |  E: spacedorpteltd@gmail.com",mX,28);
  const d=new Date().toLocaleDateString("en-SG",{day:"2-digit",month:"short",year:"numeric"});
  doc.setTextColor(203,213,225); doc.text(d,W-mX,15,{align:"right"});
  let y=50;
  doc.setFont("helvetica","bold"); doc.setFontSize(13); doc.setTextColor(15,23,42);
  doc.text("Extrusion Profile Selection",mX,y);
  doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(100,116,139);
  doc.text(`${items.length} profile(s)  ·  Total qty: ${items.reduce((s,i)=>s+i.quantity,0)}`,mX,y+7);
  y+=18;
  doc.setFillColor(241,245,249); doc.rect(mX,y-5,W-mX*2,10,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(71,85,105);
  const c={n:mX+10,s:mX+52,sz:mX+100,q:mX+152};
  doc.text("#",mX+2,y); doc.text("Profile",c.n,y); doc.text("Series",c.s,y); doc.text("Size",c.sz,y); doc.text("Qty",c.q,y);
  y+=9;
  items.forEach((item,idx)=>{
    if(y>pH-25){doc.addPage();y=20;}
    const bg=idx%2===0?[255,255,255]:[248,250,252];
    doc.setFillColor(...bg); doc.rect(mX,y-5,W-mX*2,9,"F");
    doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(100,116,139); doc.text(String(idx+1),mX+2,y);
    doc.setFont("helvetica","bold"); doc.setTextColor(15,23,42); doc.text(item.name,c.n,y);
    doc.setFont("helvetica","normal"); doc.setTextColor(71,85,105); doc.text(item.series,c.s,y); doc.text(item.size,c.sz,y);
    doc.setFont("helvetica","bold"); doc.setTextColor(15,23,42); doc.text(String(item.quantity),c.q,y);
    y+=9;
  });
  doc.setDrawColor(226,232,240); doc.setLineWidth(0.4); doc.line(mX,pH-16,W-mX,pH-16);
  doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(148,163,184);
  doc.text("Generated by SpaceDor Profile Selector",mX,pH-11);
  doc.text("Page 1",W-mX,pH-11,{align:"right"});
  doc.save("SpaceDor_Profile_Selection.pdf");
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [selected, setSelected]     = useState([]);
  const [search, setSearch]         = useState("");
  const [activeSeries, setSeries]   = useState("All");
  const [tab, setTab]               = useState("catalog");
  const [viewMode, setViewMode]     = useState("grid");
  const [toast, setToast]           = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const allSeries = ["All", ...Object.keys(PAL)];

  const filtered = useMemo(()=>designs.filter(d=>{
    const q=search.toLowerCase();
    return (d.name.toLowerCase().includes(q)||d.series.toLowerCase().includes(q))
      && (activeSeries==="All"||d.series===activeSeries);
  }),[search,activeSeries]);

  const showToast = (msg,type="success")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),2200); };

  const handleAdd = item => setSelected(prev=>{
    const ex=prev.find(i=>i.id===item.id);
    if(ex){ showToast(`Updated ${item.name} → qty ${ex.quantity+item.quantity}`); return prev.map(i=>i.id===item.id?{...i,quantity:i.quantity+item.quantity}:i); }
    showToast(`${item.name} added`); return [...prev, item];
  });
  const handleRemove = id => setSelected(prev=>prev.filter(i=>i.id!==id));
  const handleQty = (id,q) => setSelected(prev=>prev.map(i=>i.id===id?{...i,quantity:q}:i));
  const handlePDF = async()=>{
    if(!selected.length){showToast("Add profiles first","error");return;}
    setPdfLoading(true);
    try{await makePDF(selected);showToast("PDF downloaded!");}
    catch(e){showToast("PDF error","error");}
    setPdfLoading(false);
  };

  const totalQty = selected.reduce((s,i)=>s+i.quantity,0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',sans-serif;background:#F1F5F9;min-height:100vh;}
        input[type=number]::-webkit-inner-spin-button{opacity:1;}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:#F1F5F9;}::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:99px;}
        .gcard{transition:all 0.18s ease;}.gcard:hover{box-shadow:0 8px 32px rgba(0,0,0,0.11)!important;transform:translateY(-2px);}
        @keyframes fsl{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"/>

      {toast&&<div style={{position:"fixed",top:20,right:20,zIndex:9999,background:toast.type==="error"?"#FEF2F2":"#F0FDF4",border:`1.5px solid ${toast.type==="error"?"#FECACA":"#BBF7D0"}`,color:toast.type==="error"?"#DC2626":"#15803D",padding:"10px 18px",borderRadius:"11px",fontSize:"13px",fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,0.12)",animation:"fsl 0.2s ease"}}>{toast.msg}</div>}

      {/* NAV */}
      <header style={{background:"#0F172A",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 16px rgba(0,0,0,0.25)"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <div style={{background:"linear-gradient(135deg,#4F46E5,#7C3AED)",borderRadius:"10px",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 10px #4F46E555"}}>
            <span style={{color:"#fff",fontSize:"13px",fontWeight:900,fontFamily:"'DM Mono',monospace"}}>SD</span>
          </div>
          <div>
            <div style={{color:"#F8FAFC",fontWeight:800,fontSize:"15px",fontFamily:"'DM Mono',monospace",letterSpacing:"-0.03em"}}>SpaceDor</div>
            <div style={{color:"#475569",fontSize:"9px",letterSpacing:"0.1em",fontWeight:700,textTransform:"uppercase"}}>Profile Selector</div>
          </div>
        </div>
        <div style={{display:"flex",gap:"4px",background:"#1E293B",borderRadius:"10px",padding:"4px"}}>
          {[{k:"catalog",l:"Catalog",ic:<I.Grid/>},{k:"cart",l:`Selection${selected.length?` (${selected.length})`:""}`,ic:<I.Cart/>}].map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)} style={{padding:"7px 16px",borderRadius:"7px",border:"none",cursor:"pointer",background:tab===t.k?"#334155":"transparent",color:tab===t.k?"#F8FAFC":"#64748B",fontSize:"12px",fontWeight:700,transition:"all 0.15s",display:"flex",alignItems:"center",gap:"6px"}}>
              {t.ic}{t.l}
            </button>
          ))}
        </div>
      </header>

      <div style={{maxWidth:1440,margin:"0 auto",padding:"24px 20px"}}>

        {/* ── CATALOG ── */}
        {tab==="catalog"&&<>
          {/* Controls row */}
          <div style={{display:"flex",flexWrap:"wrap",gap:"10px",alignItems:"center",marginBottom:"16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",background:"#fff",border:"1.5px solid #E2E8F0",borderRadius:"10px",padding:"0 12px",flex:"1 1 220px",maxWidth:"340px",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
              <I.Search/>
              <input type="text" placeholder="Search profiles…" value={search} onChange={e=>setSearch(e.target.value)}
                style={{border:"none",outline:"none",flex:1,fontSize:"13px",padding:"10px 0",background:"transparent",fontFamily:"'DM Sans',sans-serif",color:"#0F172A"}}/>
            </div>
            <div style={{display:"flex",background:"#fff",border:"1.5px solid #E2E8F0",borderRadius:"9px",overflow:"hidden"}}>
              {[{k:"grid",ic:<I.Grid/>},{k:"list",ic:<I.List/>}].map(({k,ic})=>(
                <button key={k} onClick={()=>setViewMode(k)} style={{padding:"8px 12px",border:"none",cursor:"pointer",background:viewMode===k?"#0F172A":"transparent",color:viewMode===k?"#fff":"#94A3B8",transition:"all 0.15s"}}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Series pills */}
          <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"18px"}}>
            {allSeries.map(s=>{
              const p=PAL[s]||{accent:"#334155",badge:"#E2E8F0",text:"#334155"};
              const act=activeSeries===s;
              return <button key={s} onClick={()=>setSeries(s)} style={{padding:"5px 13px",borderRadius:"99px",cursor:"pointer",border:`2px solid ${act?p.accent:"#E2E8F0"}`,background:act?p.accent:"#fff",color:act?"#fff":"#475569",fontSize:"11px",fontWeight:700,transition:"all 0.15s"}}>
                {s==="All"?`All · ${designs.length}`:s}
              </button>;
            })}
          </div>

          <div style={{marginBottom:"12px",color:"#94A3B8",fontSize:"11px",fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase"}}>
            {filtered.length} profiles
          </div>

          <div style={viewMode==="grid"?{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:"12px"}:{display:"flex",flexDirection:"column",gap:"8px"}}>
            {filtered.map(d=>(
              <div key={d.id} className={viewMode==="grid"?"gcard":""}>
                <DesignCard design={d} onAdd={handleAdd} isSelected={selected.some(i=>i.id===d.id)} viewMode={viewMode}/>
              </div>
            ))}
          </div>

          {filtered.length===0&&<div style={{textAlign:"center",padding:"80px 0",color:"#94A3B8"}}>
            <div style={{fontSize:"40px",marginBottom:"8px"}}>🔍</div>
            <div style={{fontWeight:700,color:"#64748B"}}>No profiles found</div>
          </div>}
        </>}

        {/* ── CART ── */}
        {tab==="cart"&&<div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
            <div>
              <h2 style={{fontSize:"18px",fontWeight:800,color:"#0F172A",fontFamily:"'DM Mono',monospace"}}>Selected Profiles</h2>
              <p style={{fontSize:"13px",color:"#64748B",marginTop:"3px"}}>{selected.length} profile(s) · {totalQty} total units</p>
            </div>
            <div style={{display:"flex",gap:"8px"}}>
              {selected.length>0&&<button onClick={()=>setSelected([])} style={{padding:"9px 16px",borderRadius:"9px",border:"1.5px solid #FECACA",background:"#FFF1F2",color:"#E11D48",fontSize:"13px",fontWeight:700,cursor:"pointer"}}>Clear All</button>}
              <button onClick={handlePDF} disabled={pdfLoading||!selected.length} style={{padding:"9px 20px",borderRadius:"9px",background:!selected.length?"#E2E8F0":"linear-gradient(135deg,#4F46E5,#7C3AED)",color:!selected.length?"#94A3B8":"#fff",border:"none",fontSize:"13px",fontWeight:700,cursor:!selected.length?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:"6px",boxShadow:selected.length?"0 4px 16px #4F46E540":"none"}}>
                <I.Download/>{pdfLoading?"Generating…":"Download PDF"}
              </button>
            </div>
          </div>

          {selected.length===0
            ? <div style={{textAlign:"center",padding:"90px 0",background:"#fff",borderRadius:"16px",border:"2px dashed #E2E8F0",color:"#94A3B8"}}>
                <div style={{fontSize:"44px",marginBottom:"12px"}}>📋</div>
                <div style={{fontWeight:700,fontSize:"15px",color:"#475569"}}>Nothing selected yet</div>
                <div style={{fontSize:"13px",marginTop:"4px"}}>Go to catalog and add profiles</div>
                <button onClick={()=>setTab("catalog")} style={{marginTop:"16px",padding:"10px 22px",borderRadius:"10px",background:"#0F172A",color:"#fff",border:"none",fontSize:"13px",fontWeight:700,cursor:"pointer"}}>Browse Catalog</button>
              </div>
            : <div style={{background:"#fff",borderRadius:"16px",border:"1.5px solid #E2E8F0",overflow:"hidden",boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
                <div style={{background:"#0F172A",padding:"14px 20px",display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
                  {[{l:"Profiles",v:selected.length},{l:"Total Units",v:totalQty},{l:"Series",v:[...new Set(selected.map(i=>i.series))].length}].map(st=>(
                    <div key={st.l} style={{textAlign:"center"}}>
                      <div style={{color:"#F8FAFC",fontSize:"22px",fontWeight:900,fontFamily:"'DM Mono',monospace"}}>{st.v}</div>
                      <div style={{color:"#475569",fontSize:"9px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase"}}>{st.l}</div>
                    </div>
                  ))}
                </div>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{background:"#F8FAFC",borderBottom:"1px solid #E2E8F0"}}>
                    {["Profile","Size","Qty",""].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:"10px",fontWeight:800,color:"#94A3B8",letterSpacing:"0.08em",textTransform:"uppercase"}}>{h}</th>)}
                  </tr></thead>
                  <tbody>{selected.map(item=><CartRow key={item.id} item={item} onRemove={handleRemove} onQtyChange={handleQty}/>)}</tbody>
                </table>
                <div style={{padding:"14px 18px",borderTop:"1px solid #F1F5F9",display:"flex",justifyContent:"flex-end"}}>
                  <button onClick={handlePDF} disabled={pdfLoading} style={{padding:"10px 26px",borderRadius:"10px",background:"linear-gradient(135deg,#4F46E5,#7C3AED)",color:"#fff",border:"none",fontSize:"13px",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:"7px",boxShadow:"0 4px 20px #4F46E545"}}
                    onMouseOver={e=>e.currentTarget.style.opacity="0.88"} onMouseOut={e=>e.currentTarget.style.opacity="1"}>
                    <I.Download/>{pdfLoading?"Generating…":"Download A4 PDF"}
                  </button>
                </div>
              </div>}
        </div>}
      </div>
    </>
  );
}