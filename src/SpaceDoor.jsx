import { jsPDF } from 'jspdf';
import { useState, useMemo, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// 🔧 GOOGLE SHEETS CONFIG — paste your Sheet ID here
// HOW TO GET SHEET ID:
//   Your sheet URL looks like:
//   https://docs.google.com/spreadsheets/d/  <<SHEET_ID_HERE>>  /edit
//   Copy that long ID and paste below.
// ─────────────────────────────────────────────────────────────────────────────
const SHEET_ID = "1TsfOB9fYDP_CvRVQWiW9Le2Y3zOflckJrZnaV2x0zt4";
const SHEET_NAME = "Products"; // Must match your sheet tab name exactly

const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;

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

function ProfilePreview({ design, accent, bg, fullWidth }) {
  const [imgErr, setImgErr] = useState(false);
  const showImage = design.image && !imgErr;
  if (showImage) {
    return (
      <div style={{ width: fullWidth ? "100%" : 80, height: fullWidth ? 160 : 62, borderRadius:8, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", background:"#fff", position:"relative" }}>
  <img src={design.image} alt={design.name} onError={()=>setImgErr(true)}
    style={{width:"100%",height:"100%",objectFit:"contain",display:"block",padding:"0px"}}/>
      </div>
    );
  }
  return <ProfileSVG name={design.name} accent={accent} bg={bg}/>;
}

// ─── HARDCODED BASE DESIGNS ───────────────────────────────────────────────────
const BASE_DESIGNS = [
  {id:1,  name:"SF16-1T",   series:"SPACEDOR-16",        image: "/images/spacedor-16/SF16 - 1T.png"},
  {id:2,  name:"SF16-1S",   series:"SPACEDOR-16",        image:"/images/spacedor-16/SF16 - 1S.png"},
  {id:3,  name:"SF16-P",    series:"SPACEDOR-16",        image:"/images/spacedor-16/SF16 - P.png"},
  {id:4,  name:"SF16-2T",   series:"SPACEDOR-16",       image:"/images/spacedor-16/SF16 - 2T.png"},
  {id:5,  name:"SF16-2S",   series:"SPACEDOR-16",       image:"/images/spacedor-16/SF16 - 2S.png"},
  {id:6,  name:"SF16-2B",   series:"SPACEDOR-16",        image:"/images/spacedor-16/SF16 - 2B.png"},
  {id:7,  name:"SF16-ITB",  series:"SPACEDOR-16",      image:"/images/spacedor-16/SF16 - ITB.png"},
  {id:8,  name:"SF16-ISH",  series:"SPACEDOR-16",      image:"/images/spacedor-16/SF16 - ISH.png"},
  {id:9,  name:"SF16-IS",   series:"SPACEDOR-16",        image:"/images/spacedor-16/SF16 - IS.png"},
  {id:10, name:"SF16-I",    series:"SPACEDOR-16",      image:"/images/spacedor-16/SF16 - I.png"},
  {id:11, name:"SF16-3T",   series:"SPACEDOR-16",      image:"/images/spacedor-16/SF16 - 3T.png"},
  {id:12, name:"SF16-3S",   series:"SPACEDOR-16",       image:"/images/spacedor-16/SF16 - 3S.png"},
  {id:13, name:"SF16-3B",   series:"SPACEDOR-16",        image:"/images/spacedor-16/SF16 - 3B.png"},
  {id:14, name:"SF16-C",    series:"SPACEDOR-16",      image:"/images/spacedor-16/SF16 - C.png"},
  {id:15, name:"SF16-3TN",  series:"SPACEDOR-16",      image:"/images/spacedor-16/SF16 - 3TN.png"},
  {id:16, name:"SF16-2TN",  series:"SPACEDOR-16",     image:"/images/spacedor-16/SF16 - 2TN.png"},
  {id:17, name:"SF16-1TN",  series:"SPACEDOR-16",     image:"/images/spacedor-16/SF16 - 1TN.png"},
  {id:18, name:"SF16-IL",   series:"SPACEDOR-16",    image:"/images/spacedor-16/SF16 - IL.png"},
  {id:19, name:"SF16-P2",   series:"SPACEDOR-16",      image:"/images/spacedor-16/SF16 - P2.png"},
  {id:20, name:"SF15-2T",   series:"SPACEDOR-15",      image:"/images/SPACEDOR - 15/SF15 - 2T.png"},
  {id:21, name:"SF15-2B",   series:"SPACEDOR-15",      image:"/images/SPACEDOR - 15/SF15 - 2B.png"},
  {id:22, name:"SF15-3T",   series:"SPACEDOR-15",     image:"/images/SPACEDOR - 15/SF15 - 3T.png"},
  {id:23, name:"SF15-3B",   series:"SPACEDOR-15",     image:"/images/SPACEDOR - 15/SF15 - 3B.png"},
  {id:24, name:"SF15-3S",   series:"SPACEDOR-15",       image:"/images/SPACEDOR - 15/SF15 - 3S.png"},
  {id:25, name:"SF15-IT",   series:"SPACEDOR-15",      image:"/images/SPACEDOR - 15/SF15 - IT.png"},
  {id:26, name:"SF15-IS",   series:"SPACEDOR-15",     image:"/images/SPACEDOR - 15/SF15 - IS.png"},
  {id:27, name:"SF15-I",    series:"SPACEDOR-15",     image:"/images/SPACEDOR - 15/SF15 - I.png"},
  {id:28, name:"SF15-IB",   series:"SPACEDOR-15",     image:"/images/SPACEDOR - 15/SF15 - IB.png"},
  {id:29, name:"SF15-ISH",  series:"SPACEDOR-15",    image:"/images/SPACEDOR - 15/SF15 - ISH.png"},
  {id:30, name:"SF15-4T",   series:"SPACEDOR-15",    image:"/images/SPACEDOR - 15/SF15 - 4T.png"},
  {id:31, name:"SF15-4S",   series:"SPACEDOR-15",     image:"/images/SPACEDOR - 15/SF15 - 4S.png"},
  {id:32, name:"SF15-4B",   series:"SPACEDOR-15",     image:"/images/SPACEDOR - 15/SF15 - 4B.png"},
  {id:33, name:"SF18-T",    series:"SPACEDOR-18",        image:"/images/SPACEDOR - 18/SF18 - T.png"},
  {id:34, name:"SF18-S",    series:"SPACEDOR-18",       image:"/images/SPACEDOR - 18/SF18 - S.png"},
  {id:35, name:"SF18-B",    series:"SPACEDOR-18",       image:"/images/SPACEDOR - 18/SF18 - B.png"},
  {id:36, name:"SF18-I",    series:"SPACEDOR-18",    image:"/images/SPACEDOR - 18/SF18 - I.png"},
  {id:37, name:"SF18-IH",   series:"SPACEDOR-18",     image:"/images/SPACEDOR - 18/SF18 - IH.png"},
  {id:38, name:"SF25-TS",   series:"SPACEDOR-25",     image:"/images/SPACEDOR - 25/SF25 - TS.png"},
  {id:39, name:"SF25-I",    series:"SPACEDOR-25",    image:"/images/SPACEDOR - 25/SF25 - I.png"},
  {id:40, name:"SF25-C",    series:"SPACEDOR-25",     image:"/images/SPACEDOR - 25/SF25 - C.png"},
  {id:41, name:"SF25-U",    series:"SPACEDOR-25",      image:"/images/SPACEDOR - 25/SF25 - U.png"},
  {id:42, name:"SF25-IH",   series:"SPACEDOR-25",     image:"/images/SPACEDOR - 25/SF25 - IH.png"},
  {id:43, name:"SF80-O",    series:"SPACEDOR-80",       image:"/images/SPACEDOR - 80/SF80 - O.png"},
  {id:44, name:"SF80-M",    series:"SPACEDOR-80",      image:"/images/SPACEDOR - 80/SF80 - M.png"},
  {id:45, name:"SF80-B",    series:"SPACEDOR-80",      image:"/images/SPACEDOR - 80/SF80 - B.png"},
  {id:46, name:"SF80-I",    series:"SPACEDOR-80",        image:"/images/SPACEDOR - 80/SF80 - I.png"},
  {id:47, name:"SFSP-S",    series:"SPACEDOR-S&P",     image:"/images/SPACEDOR - S&P/SFSP - S.png"},
  {id:48, name:"SFSP-I",    series:"SPACEDOR-S&P",     image:"/images/SPACEDOR - S&P/SFSP - I.png"},
  {id:49, name:"SFSP-T",    series:"SPACEDOR-S&P",  image:"/images/SPACEDOR - S&P/SFSP - T.png"},
  {id:50, name:"SFSP-BH",   series:"SPACEDOR-S&P",   image:"/images/SPACEDOR - S&P/SFSP - BH.png"},
  {id:51, name:"SFSP-BL",   series:"SPACEDOR-S&P",     image:"/images/SPACEDOR - S&P/SFSP - BL.png"},
  {id:52, name:"SF58-T",    series:"SPACEDOR-58",    image:"/images/SPACEDOR -58/SF58 - T.png"},
  {id:53, name:"SF58-S",    series:"SPACEDOR-58",    image:"/images/SPACEDOR -58/SF58 - S.png"},
  {id:54, name:"SF58-B",    series:"SPACEDOR-58",     image:"/images/SPACEDOR -58/SF58 - B.png"},
  {id:55, name:"SF58-I",    series:"SPACEDOR-58",      image:"/images/SPACEDOR -58/SF58 - I.png"},
  {id:60, name:"SF45-TW",   series:"SF45-Bi FOLD",    image:"/images/SF45 - Bi FOLD/SF45 - TW.png"},
  {id:61, name:"SF45-TD",   series:"SF45-Bi FOLD",    image:"/images/SF45 - Bi FOLD/SF45 - TD.png"},
  {id:62, name:"SF45-JB",   series:"SF45-Bi FOLD",    image:"/images/SF45 - Bi FOLD/SF45 - JB.png"},
  {id:63, name:"SF45-IN",   series:"SF45-Bi FOLD",    image:"/images/SF45 - Bi FOLD/SF45 - IN.png"},
  {id:64, name:"SFPS-1T",   series:"PERFECT SYSTEM",        image:"/images/SFPS - PERFECT-SYSTEM/SFPS - 1T.png"},
  {id:65, name:"SFPS-1T_DP",series:"PERFECT SYSTEM",        image:"/images/SFPS - PERFECT-SYSTEM/SFPS - 1T_DP.png"},
  {id:66, name:"SFPS-2T",   series:"PERFECT SYSTEM",        image:"/images/SFPS - PERFECT-SYSTEM/SFPS - 2T.png"},
  {id:67, name:"SFPS-3T",   series:"PERFECT SYSTEM",       image:"/images/SFPS - PERFECT-SYSTEM/SFPS - 3T.png"},
  {id:68, name:"SFPS-IN_S", series:"PERFECT SYSTEM",        image:"/images/SFPS - PERFECT-SYSTEM/SFPS - IN_S.png"},
  {id:69, name:"SFPS-TTC1", series:"PERFECT SYSTEM",       image:"/images/SFPS - PERFECT-SYSTEM/SFPS - TTC1.png"},
  {id:70, name:"SFPS-TTS1", series:"PERFECT SYSTEM",        image:"/images/SFPS - PERFECT-SYSTEM/SFPS - TTS1.png"},
  {id:71, name:"SFPS-IN_C", series:"PERFECT SYSTEM",        image:"/images/SFPS - PERFECT-SYSTEM/SFPS - IN_C.png"},
  {id:72, name:"SFPS-IN_T&B", series:"PERFECT SYSTEM",        image:"/images/SFPS - PERFECT-SYSTEM/SFPS - IN_T&B.png"},
  {id:73, name:"SFPS-TTC2", series:"PERFECT SYSTEM",       image:"/images/SFPS - PERFECT-SYSTEM/SFPS - TTC2.png"},
  {id:74, name:"SFPS-TTS2", series:"PERFECT SYSTEM",        image:"/images/SFPS - PERFECT-SYSTEM/SFPS - TTS2.png"},
  {id:75, name:"SFPS-TTS3", series:"PERFECT SYSTEM",        image:"/images/SFPS - PERFECT-SYSTEM/SFPS - TTS3.png"},
  {id:76, name:"SF18-Inner Frame", series:"SF18-SLIDING",image:"/images/SF18 - SLIDING/SF18-Inner Frame.png"},
  {id:77, name:"SF18-Inner I Section", series:"SF18-SLIDING",        image:"/images/SF18 - SLIDING/SF18-Inner I Section.png"},
  {id:78, name:"SF18-Top Track", series:"SF18-SLIDING",       image:"/images/SF18 - SLIDING/SF18-Top Track.png"},
  {id:79, name:"SF18-Side Frame", series:"SF18-SLIDING",       image:"/images/SF18 - SLIDING/SF18-Side Frame.png"},
  {id:80, name:"SF18-Bottom Track", series:"SF18-SLIDING",       image:"/images/SF18 - SLIDING/SF18-Bottom Track.png"},
  {id:81, name:"SF18-Top Track- 3Track", series:"SF18-SLIDING",      image:"/images/SF18 - SLIDING/SF18-Top Track- 3Track.png"},
  {id:82, name:"SF18-Side Cover", series:"SF18-SLIDING",      image:"/images/SF18 - SLIDING/SF18-Side Cover.png"},
  {id:83, name:"SF18-Side Frame-3Track", series:"SF18-SLIDING",       image:"/images/SF18 - SLIDING/SF18-Side Frame-3Track.png"},
  {id:84, name:"SF18-Bottom Track-3Track", series:"SF18-SLIDING",       image:"/images/SF18 - SLIDING/SF18-Bottom Track-3Track.png"},
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
  "SF18-SLIDING":    {accent:"#059669",light:"#ECFDF5",badge:"#A7F3D0",text:"#065F46"},
};

const EXTRA_COLORS = [
  {accent:"#0EA5E9",light:"#F0F9FF",badge:"#BAE6FD",text:"#0369A1"},
  {accent:"#8B5CF6",light:"#F5F3FF",badge:"#DDD6FE",text:"#5B21B6"},
  {accent:"#F59E0B",light:"#FFFBEB",badge:"#FDE68A",text:"#92400E"},
  {accent:"#EF4444",light:"#FFF1F2",badge:"#FECACA",text:"#B91C1C"},
  {accent:"#14B8A6",light:"#F0FDFA",badge:"#99F6E4",text:"#0F766E"},
  {accent:"#F97316",light:"#FFF7ED",badge:"#FED7AA",text:"#C2410C"},
];

// ─── PARSE CSV FROM GOOGLE SHEETS ────────────────────────────────────────────
// Sheet columns (Row 1 = header, skip it):
//   A: id | B: name | C: series | D: size | E: length | F: image_url
function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];
  return lines.slice(1).map((line, idx) => {
    const cols = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQ = !inQ; }
      else if (ch === "," && !inQ) { cols.push(cur.trim()); cur = ""; }
      else { cur += ch; }
    }
    cols.push(cur.trim());
    const clean = s => (s || "").replace(/^"|"$/g, "").trim();
    const [rawId, name, series, size, length, image] = cols;
    if (!clean(name) || !clean(series)) return null;
    return {
      id: `sheet_${clean(rawId) || idx + 1}`,
      name: clean(name),
      series: clean(series),
      size: clean(size),
      length: clean(length),
      image: clean(image).startsWith("http") ? clean(image) : null,
      fromSheet: true,
    };
  }).filter(Boolean);
}

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
  Refresh:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Sheet:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/></svg>,
};

// ─── DESIGN CARD ──────────────────────────────────────────────────────────────
function DesignCard({ design, onAdd, isSelected, viewMode, pal }) {
  const [qty, setQty] = useState(1);
  const [length, setLength] = useState("");
  const p = pal;
  const doAdd = () => { if (!qty || qty < 1) return; onAdd({ ...design, quantity: qty, length: length || design.length || "" }); setQty(1); setLength(""); };

  if (viewMode === "list") return (
    <div style={{ background:"#fff", border: isSelected?`2px solid ${p.accent}`:"2px solid #F1F5F9", borderRadius:"12px", padding:"10px 14px", display:"flex", alignItems:"center", gap:"12px", transition:"all 0.18s", boxShadow: isSelected?`0 2px 16px ${p.accent}22`:"0 1px 3px rgba(0,0,0,0.05)" }}>
      <div style={{flexShrink:0,borderRadius:"10px",background:p.light,padding:"3px",border:`1.5px solid ${p.badge}`}}>
        <ProfilePreview design={design} accent={p.accent} bg={p.light}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:"13px",color:"#0F172A",display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap"}}>
          {design.name}
          {design.fromSheet && <span style={{background:"#D1FAE5",color:"#065F46",borderRadius:"99px",fontSize:"8px",padding:"1px 6px",fontWeight:700}}>SHEET</span>}
          {isSelected && <span style={{background:p.accent,color:"#fff",borderRadius:"99px",fontSize:"9px",padding:"1px 7px",fontWeight:700}}>IN CART</span>}
        </div>
        <div style={{fontSize:"10px",color:p.text,fontWeight:700,marginTop:"2px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{design.series}</div>
        <div style={{fontSize:"11px",color:"#94A3B8",marginTop:"1px"}}>{design.size}{design.length?` · L: ${design.length}`:""}</div>
      </div>
      <div style={{display:"flex",gap:"6px",alignItems:"center",flexShrink:0}}>
        <input type="text" placeholder="Length" value={length} onChange={e=>setLength(e.target.value)}
          style={{width:"72px",padding:"6px",border:"1.5px solid #E2E8F0",borderRadius:"8px",fontSize:"12px",fontWeight:600,textAlign:"center",outline:"none",fontFamily:"'DM Mono',monospace",color:"#0F172A",placeholder:"Length"}}/>
        <input type="number" min="1" value={qty} onChange={e=>setQty(parseInt(e.target.value)||"")}
          style={{width:"52px",padding:"6px",border:"1.5px solid #E2E8F0",borderRadius:"8px",fontSize:"13px",fontWeight:700,textAlign:"center",outline:"none",fontFamily:"'DM Mono',monospace",color:"#0F172A"}}/>
        <button onClick={doAdd} disabled={!qty||qty<1}
          style={{padding:"7px 14px",background:p.accent,color:"#fff",border:"none",borderRadius:"8px",fontSize:"12px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"4px",opacity:(!qty||qty<1)?0.35:1,transition:"opacity 0.15s"}}>
          <I.Plus/> Add
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background:"#fff", border: isSelected?`2px solid ${p.accent}`:"2px solid #F1F5F9", borderRadius:"14px", padding:"13px", display:"flex", flexDirection:"column", gap:"10px", transition:"all 0.18s", boxShadow: isSelected?`0 4px 24px ${p.accent}28`:"0 1px 4px rgba(0,0,0,0.06)", position:"relative" }}>
      {isSelected && <div style={{position:"absolute",top:9,right:9,background:p.accent,borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 8px ${p.accent}55`}}><I.Check/></div>}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"inline-flex",background:p.badge,color:p.text,fontSize:"9px",fontWeight:800,letterSpacing:"0.07em",padding:"2px 8px",borderRadius:"99px",fontFamily:"'DM Mono',monospace",textTransform:"uppercase"}}>
          {design.series}
        </div>
        {design.fromSheet && <span style={{background:"#D1FAE5",color:"#065F46",borderRadius:"99px",fontSize:"8px",padding:"1px 6px",fontWeight:700,fontFamily:"'DM Mono',monospace"}}>SHEET</span>}
      </div>
      <div style={{background:p.light,borderRadius:"10px",border:`1.5px solid ${p.badge}`,position:"relative",overflow:"hidden"}}>
        <ProfilePreview design={design} accent={p.accent} bg={p.light} fullWidth={!!design.image}/>
        <div style={{position:"absolute",bottom:3,right:6,fontSize:"8px",color:p.accent,fontFamily:"'DM Mono',monospace",fontWeight:600,opacity:0.65}}>{design.size}</div>
      </div>
      <div style={{fontSize:"14px",fontWeight:800,color:"#0F172A",fontFamily:"'DM Mono',monospace",letterSpacing:"-0.02em"}}>{design.name}</div>
      {design.length && <div style={{fontSize:"11px",color:"#64748B",marginTop:"-6px"}}>Length: {design.length}</div>}
      <div style={{display:"flex",flexDirection:"column",gap:"5px",marginTop:"auto"}}>
        <input type="text" placeholder="Length (e.g. 6000mm)" value={length} onChange={e=>setLength(e.target.value)}
          style={{width:"100%",padding:"7px 8px",border:"1.5px solid #E2E8F0",borderRadius:"8px",fontSize:"11px",fontWeight:600,color:"#0F172A",outline:"none",fontFamily:"'DM Mono',monospace"}}/>
        <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
          <input type="number" min="1" value={qty} onChange={e=>setQty(parseInt(e.target.value)||"")}
            style={{width:"52px",padding:"7px 6px",border:"1.5px solid #E2E8F0",borderRadius:"8px",fontSize:"13px",fontWeight:700,color:"#0F172A",textAlign:"center",outline:"none",fontFamily:"'DM Mono',monospace"}}/>
          <button onClick={doAdd} disabled={!qty||qty<1}
            style={{flex:1,padding:"8px 10px",background:p.accent,color:"#fff",border:"none",borderRadius:"8px",fontSize:"12px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"4px",opacity:(!qty||qty<1)?0.35:1,transition:"opacity 0.15s"}}>
            <I.Plus/> Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CART ROW ─────────────────────────────────────────────────────────────────
function CartRow({ item, uid, onRemove, onQtyChange, pal }) {
  const p = pal;
  const rowUid = uid || `${item.id}__${item.length||""}`;
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
      <td style={{padding:"10px 14px",fontSize:"12px",color:"#64748B",whiteSpace:"nowrap"}}>{item.size}{item.length?` · ${item.length}`:""}</td>
      <td style={{padding:"10px 14px"}}>
        <input type="number" min="1" value={item.quantity} onChange={e=>onQtyChange(rowUid,parseInt(e.target.value)||1)}
          style={{width:"56px",padding:"6px",border:"1.5px solid #E2E8F0",borderRadius:"7px",fontSize:"13px",fontWeight:700,textAlign:"center",color:"#0F172A",fontFamily:"'DM Mono',monospace"}}/>
      </td>
      <td style={{padding:"10px 14px",textAlign:"right"}}>
        <button onClick={()=>onRemove(rowUid)}
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
  const doc = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W=210,pH=297,mX=15;

  // Header
  doc.setFillColor(15,23,42); doc.rect(0,0,W,36,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(16); doc.setTextColor(248,250,252);
  doc.text("SpaceDor Marketing Pte. Ltd.",mX,15);
  doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(148,163,184);
  doc.text("1 Tampines North Drive 1, #07-05/06, T-Space Singapore 528559",mX,22);
  doc.text("T: 6547 8332  |  F: 6547 8384  |  E: spacedorpteltd@gmail.com",mX,28);
  const d=new Date().toLocaleDateString("en-SG",{day:"2-digit",month:"short",year:"numeric"});
  doc.setTextColor(203,213,225); doc.text(d,W-mX,15,{align:"right"});

  // Title
  let y=48;
  doc.setFont("helvetica","bold"); doc.setFontSize(13); doc.setTextColor(15,23,42);
  doc.text("Extrusion Profile Selection",mX,y);
  doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(100,116,139);
  doc.text(`${items.length} profile(s)  ·  Total qty: ${items.reduce((s,i)=>s+i.quantity,0)}`,mX,y+7);
  y+=18;

  // Load images
  const loadImage = (url) => new Promise((resolve)=>{
    const img=new Image(); img.crossOrigin="anonymous";
    img.onload=()=>resolve(img);
    img.onerror=()=>resolve(null);
    img.src=url;
  });
  const images = await Promise.all(items.map(item=> item.image ? loadImage(item.image) : Promise.resolve(null)));

  // Product cards — single column full width
  const cardH=48, imgSize=40, cardW=W-mX*2;

  for(let idx=0;idx<items.length;idx++){
    const item=items[idx];
    const img=images[idx];

    if(y+cardH>pH-20){ doc.addPage(); y=20; }

    // Card bg
    doc.setFillColor(248,250,252);
    doc.roundedRect(mX,y,cardW,cardH,3,3,"F");
    doc.setDrawColor(226,232,240); doc.setLineWidth(0.3);
    doc.roundedRect(mX,y,cardW,cardH,3,3,"S");

    // Image box (left side)
    doc.setFillColor(255,255,255);
    doc.roundedRect(mX+4,y+4,imgSize,imgSize,2,2,"F");
    if(img){
      try{ doc.addImage(img,"PNG",mX+4,y+4,imgSize,imgSize,"","FAST"); }catch(e){}
    } else {
      doc.setFontSize(8); doc.setFont("helvetica","bold"); doc.setTextColor(148,163,184);
      doc.text(item.name.substring(0,5),mX+4+imgSize/2,y+4+imgSize/2+2,{align:"center"});
    }

    // Text details (right of image)
    const tx=mX+imgSize+12;
    const avW=cardW-imgSize-18;

    // Row number badge
    doc.setFillColor(79,70,229); doc.roundedRect(tx,y+5,6,5,1,1,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(255,255,255);
    doc.text(String(idx+1),tx+3,y+9,{align:"center"});

    doc.setFont("helvetica","bold"); doc.setFontSize(13); doc.setTextColor(15,23,42);
    doc.text(item.name,tx+9,y+10);

    doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(100,116,139);
    doc.text(item.series,tx,y+18);

    // Divider line
    doc.setDrawColor(226,232,240); doc.setLineWidth(0.3);
    doc.line(tx,y+21,mX+cardW-4,y+21);

    doc.setFontSize(9); doc.setTextColor(71,85,105);
    doc.text(`Size:`,tx,y+28);
    doc.setFont("helvetica","bold"); doc.setTextColor(15,23,42);
    doc.text(item.size||"-",tx+14,y+28);

    doc.setFont("helvetica","normal"); doc.setTextColor(71,85,105);
    doc.text(`Length:`,tx,y+35);
    doc.setFont("helvetica","bold"); doc.setTextColor(15,23,42);
    doc.text(item.length||"-",tx+18,y+35);

    doc.setFont("helvetica","normal"); doc.setTextColor(71,85,105);
    doc.text(`Qty:`,tx,y+42);
    doc.setFont("helvetica","bold"); doc.setTextColor(79,70,229);
    doc.text(String(item.quantity),tx+11,y+42);

    y+=cardH+5;
  }

  // Footer
  doc.setDrawColor(226,232,240); doc.setLineWidth(0.4); doc.line(mX,pH-16,W-mX,pH-16);
  doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(148,163,184);
  doc.text("Generated by SpaceDor Profile Selector",mX,pH-11);
  doc.text(d,W-mX,pH-11,{align:"right"});
  doc.save("SpaceDor_Profile_Selection.pdf");
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [selected, setSelected]         = useState([]);
  const [search, setSearch]             = useState("");
  const [activeSeries, setSeries]       = useState("All");
  const [tab, setTab]                   = useState("catalog");
  const [viewMode, setViewMode]         = useState("grid");
  const [toast, setToast]               = useState(null);
  const [pdfLoading, setPdfLoading]     = useState(false);
  const [sheetDesigns, setSheetDesigns] = useState([]);
  const [sheetStatus, setSheetStatus]   = useState("idle");

  const fetchSheet = async () => {
    if (SHEET_ID === "YOUR_GOOGLE_SHEET_ID_HERE") { setSheetStatus("unconfigured"); return; }
    setSheetStatus("loading");
    try {
      const res = await fetch(SHEET_URL);
      if (!res.ok) throw new Error();
      const csv = await res.text();
      const parsed = parseCSV(csv);
      setSheetDesigns(parsed);
      setSheetStatus("ok");
    } catch { setSheetStatus("error"); }
  };

  useEffect(() => { fetchSheet(); }, []);

  const allDesigns = useMemo(() => [...BASE_DESIGNS, ...sheetDesigns], [sheetDesigns]);

  const dynamicPAL = useMemo(() => {
    const extra = {};
    let colorIdx = 0;
    sheetDesigns.forEach(d => {
      if (!PAL[d.series] && !extra[d.series]) {
        extra[d.series] = EXTRA_COLORS[colorIdx % EXTRA_COLORS.length];
        colorIdx++;
      }
    });
    return { ...PAL, ...extra };
  }, [sheetDesigns]);

  const getPal = (series) => dynamicPAL[series] || {accent:"#334155",light:"#F8FAFC",badge:"#E2E8F0",text:"#1E293B"};

  const allSeries = useMemo(() => ["All", ...Object.keys(dynamicPAL)], [dynamicPAL]);

  const filtered = useMemo(() => allDesigns.filter(d => {
    const q = search.toLowerCase();
    return (d.name.toLowerCase().includes(q) || d.series.toLowerCase().includes(q))
      && (activeSeries === "All" || d.series === activeSeries);
  }), [search, activeSeries, allDesigns]);

  const showToast = (msg,type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),2200); };

  const handleAdd = item => setSelected(prev => {
    // Same product + same length → merge qty. Different length → separate row
    const uniqueKey = `${item.id}__${item.length||""}`;
    const ex = prev.find(i => `${i.id}__${i.length||""}` === uniqueKey);
    if (ex) {
      showToast(`Updated ${item.name} (${item.length||"no length"}) → qty ${ex.quantity+item.quantity}`);
      return prev.map(i => `${i.id}__${i.length||""}` === uniqueKey ? {...i, quantity:i.quantity+item.quantity} : i);
    }
    showToast(`${item.name}${item.length ? ` · ${item.length}` : ""} added`);
    return [...prev, {...item, _uid: uniqueKey}];
  });
  const handleRemove = uid => setSelected(prev => prev.filter(i=>`${i.id}__${i.length||""}`!==uid));
  const handleQty = (uid,q) => setSelected(prev => prev.map(i=>`${i.id}__${i.length||""}`===uid?{...i,quantity:q}:i));
  const handlePDF = async () => {
    if (!selected.length) { showToast("Add profiles first","error"); return; }
    setPdfLoading(true);
    try { await makePDF(selected); showToast("PDF downloaded!"); }
    catch { showToast("PDF error","error"); }
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
        @keyframes spin{to{transform:rotate(360deg)}}
        .spinning{animation:spin 1s linear infinite;}
      `}</style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"/>

      {toast&&<div style={{position:"fixed",top:20,right:20,zIndex:9999,background:toast.type==="error"?"#FEF2F2":"#F0FDF4",border:`1.5px solid ${toast.type==="error"?"#FECACA":"#BBF7D0"}`,color:toast.type==="error"?"#DC2626":"#15803D",padding:"10px 18px",borderRadius:"11px",fontSize:"13px",fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,0.12)",animation:"fsl 0.2s ease"}}>{toast.msg}</div>}

      {/* NAV */}
      <header style={{background:"#0F172A",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 16px rgba(0,0,0,0.25)",flexWrap:"wrap",gap:"8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <div style={{background:"linear-gradient(135deg,#4F46E5,#7C3AED)",borderRadius:"10px",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 10px #4F46E555"}}>
            <span style={{color:"#fff",fontSize:"13px",fontWeight:900,fontFamily:"'DM Mono',monospace"}}>SD</span>
          </div>
          <div>
            <div style={{color:"#F8FAFC",fontWeight:800,fontSize:"15px",fontFamily:"'DM Mono',monospace",letterSpacing:"-0.03em"}}>SpaceDor</div>
            <div style={{color:"#475569",fontSize:"9px",letterSpacing:"0.1em",fontWeight:700,textTransform:"uppercase"}}>Profile Selector</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          {/* Google Sheet status badge */}
          <div style={{display:"flex",alignItems:"center",gap:"5px",padding:"5px 10px",borderRadius:"8px",background:"#1E293B",fontSize:"11px",fontWeight:600,color:"#64748B"}}>
            <span className={sheetStatus==="loading"?"spinning":""}><I.Sheet/></span>
            {sheetStatus==="loading" && <span style={{color:"#94A3B8"}}>Syncing…</span>}
            {sheetStatus==="ok"      && <span style={{color:"#10B981"}}>+{sheetDesigns.length} from Sheet</span>}
            {sheetStatus==="error"   && <span style={{color:"#F87171"}}>Sheet error</span>}
            {sheetStatus==="unconfigured" && <span style={{color:"#F59E0B"}}>Sheet not set</span>}
            {(sheetStatus==="ok"||sheetStatus==="error") &&
              <button onClick={fetchSheet} style={{background:"none",border:"none",cursor:"pointer",color:"#475569",padding:"0 0 0 2px",display:"flex",alignItems:"center"}} title="Refresh">
                <I.Refresh/>
              </button>
            }
          </div>
          <div style={{display:"flex",gap:"4px",background:"#1E293B",borderRadius:"10px",padding:"4px"}}>
            {[{k:"catalog",l:"Catalog",ic:<I.Grid/>},{k:"cart",l:`Selection${selected.length?` (${selected.length})`:""}`,ic:<I.Cart/>}].map(t=>(
              <button key={t.k} onClick={()=>setTab(t.k)} style={{padding:"7px 16px",borderRadius:"7px",border:"none",cursor:"pointer",background:tab===t.k?"#334155":"transparent",color:tab===t.k?"#F8FAFC":"#64748B",fontSize:"12px",fontWeight:700,transition:"all 0.15s",display:"flex",alignItems:"center",gap:"6px"}}>
                {t.ic}{t.l}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div style={{maxWidth:1440,margin:"0 auto",padding:"24px 20px"}}>

        {/* ── SETUP BANNER ── */}
        {sheetStatus==="unconfigured" && (
          <div style={{background:"#FFFBEB",border:"1.5px solid #FDE68A",borderRadius:"12px",padding:"16px 18px",marginBottom:"16px",display:"flex",gap:"14px",alignItems:"flex-start"}}>
            <span style={{fontSize:"22px",flexShrink:0}}>📋</span>
            <div>
              <div style={{fontWeight:700,color:"#92400E",fontSize:"13px",marginBottom:"6px"}}>Connect your Google Sheet in 2 steps</div>
              <div style={{fontSize:"12px",color:"#78350F",lineHeight:1.8}}>
                <b>Step 1:</b> Open your Google Sheet → <b>File → Share → Publish to web → Sheet: Products → Format: CSV → Publish</b><br/>
                <b>Step 2:</b> Open <code style={{background:"#FEF3C7",padding:"1px 5px",borderRadius:"4px"}}>src/App.jsx</code> → find <code style={{background:"#FEF3C7",padding:"1px 5px",borderRadius:"4px"}}>YOUR_GOOGLE_SHEET_ID_HERE</code> → replace with your Sheet ID from the URL<br/>
                <b>Sheet columns:</b> <code style={{background:"#FEF3C7",padding:"1px 5px",borderRadius:"4px"}}>id | name | series | size | length | image_url</code> (Row 1 = headers)
              </div>
            </div>
          </div>
        )}

        {sheetStatus==="error" && (
          <div style={{background:"#FEF2F2",border:"1.5px solid #FECACA",borderRadius:"12px",padding:"12px 18px",marginBottom:"16px",display:"flex",gap:"10px",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
              <span>⚠️</span>
              <span style={{fontSize:"12px",color:"#991B1B"}}>Could not load Google Sheet. Make sure it's published as CSV and the Sheet ID is correct.</span>
            </div>
            <button onClick={fetchSheet} style={{padding:"6px 12px",background:"#FEE2E2",border:"1.5px solid #FECACA",borderRadius:"7px",color:"#DC2626",fontSize:"11px",fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>Retry</button>
          </div>
        )}

        {/* ── CATALOG ── */}
        {tab==="catalog"&&<>
          <div style={{display:"flex",flexWrap:"wrap",gap:"10px",alignItems:"center",marginBottom:"16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",background:"#fff",border:"1.5px solid #E2E8F0",borderRadius:"10px",padding:"0 12px",flex:"1 1 220px",maxWidth:"340px",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
              <I.Search/>
              <input type="text" placeholder="Search profiles…" value={search} onChange={e=>setSearch(e.target.value)}
                style={{border:"none",outline:"none",flex:1,fontSize:"13px",padding:"10px 0",background:"transparent",fontFamily:"'DM Sans',sans-serif",color:"#0F172A"}}/>
            </div>
            <div style={{display:"flex",background:"#fff",border:"1.5px solid #E2E8F0",borderRadius:"9px",overflow:"hidden"}}>
              {[{k:"grid",ic:<I.Grid/>},{k:"list",ic:<I.List/>}].map(({k,ic})=>(
                <button key={k} onClick={()=>setViewMode(k)} style={{padding:"8px 12px",border:"none",cursor:"pointer",background:viewMode===k?"#0F172A":"transparent",color:viewMode===k?"#fff":"#94A3B8",transition:"all 0.15s"}}>{ic}</button>
              ))}
            </div>
          </div>

          <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"18px"}}>
            {allSeries.map(s=>{
              const p=getPal(s); const act=activeSeries===s;
              return <button key={s} onClick={()=>setSeries(s)} style={{padding:"5px 13px",borderRadius:"99px",cursor:"pointer",border:`2px solid ${act?p.accent:"#E2E8F0"}`,background:act?p.accent:"#fff",color:act?"#fff":"#475569",fontSize:"11px",fontWeight:700,transition:"all 0.15s"}}>
                {s==="All"?`All · ${allDesigns.length}`:s}
              </button>;
            })}
          </div>

          <div style={{marginBottom:"12px",color:"#94A3B8",fontSize:"11px",fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase"}}>
            {filtered.length} profiles{sheetDesigns.length>0&&` · ${sheetDesigns.length} from Google Sheet`}
          </div>

          <div style={viewMode==="grid"?{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:"12px"}:{display:"flex",flexDirection:"column",gap:"8px"}}>
            {filtered.map(d=>(
              <div key={d.id} className={viewMode==="grid"?"gcard":""}>
                <DesignCard design={d} onAdd={handleAdd} isSelected={selected.some(i=>i.id===d.id)} viewMode={viewMode} pal={getPal(d.series)}/>
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
                    {["Profile","Size / Length","Qty",""].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:"10px",fontWeight:800,color:"#94A3B8",letterSpacing:"0.08em",textTransform:"uppercase"}}>{h}</th>)}
                  </tr></thead>
                  <tbody>{selected.map(item=>{ const uid=`${item.id}__${item.length||""}`; return <CartRow key={uid} uid={uid} item={item} onRemove={handleRemove} onQtyChange={handleQty} pal={getPal(item.series)}/>; })}</tbody>
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