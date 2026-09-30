import { useId } from "react";
import type { Product } from "@/lib/products";

const palettes = {
  chalk: { upper: "#d8d8d1", panel: "#f1f0e9", sole: "#d9d7cc", accent: "#303030", lace: "#fbfbf5", shadow: "#99978d" },
  volt: { upper: "#b8e51c", panel: "#d8fa57", sole: "#20252a", accent: "#eeeeee", lace: "#f5f4eb", shadow: "#596d1c" },
  ember: { upper: "#c56a43", panel: "#e7a17d", sole: "#e3ddd3", accent: "#222b30", lace: "#f1e4d8", shadow: "#7c4532" },
  slate: { upper: "#47525a", panel: "#68737a", sole: "#d7d8d2", accent: "#303030", lace: "#e1e4e1", shadow: "#293138" }
};

export function ProductArt({ tone, name, className = "" }: { tone: Product["tone"]; name: string; className?: string }) {
  const c = palettes[tone];
  const instanceId = useId().replace(/:/g, "");
  const uid = `${instanceId}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <svg className={className} viewBox="0 0 720 480" role="img" aria-label={`${name} shoe concept in ${tone}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${uid}-upper`} x1=".15" y1="0" x2=".85" y2="1"><stop stopColor={c.panel}/><stop offset=".48" stopColor={c.upper}/><stop offset="1" stopColor={c.shadow}/></linearGradient>
        <linearGradient id={`${uid}-sole`} x1="0" y1="0" x2=".1" y2="1"><stop stopColor={c.panel}/><stop offset="1" stopColor={c.sole}/></linearGradient>
        <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" stopOpacity=".6"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
        <filter id={`${uid}-shadow`} x="-30%" y="-40%" width="160%" height="200%"><feGaussianBlur stdDeviation="17"/></filter>
      </defs>
      <ellipse cx="380" cy="388" rx="252" ry="27" fill="#000" opacity=".34" filter={`url(#${uid}-shadow)`}/>
      <g transform="translate(0 5) rotate(-4 360 250)">
        <path d="M83 313c25-16 58-27 100-34 43-7 73-17 95-37l41-70c12-20 26-27 46-25 26 3 42 19 58 40 22 30 52 61 94 76l76 27c26 9 47 26 54 49l9 29c5 17-7 33-25 36-65 11-145 13-237 10l-252-8c-54-2-83-13-91-35-8-21 2-43 32-58Z" fill={`url(#${uid}-upper)`}/>
        <path d="m298 183-43 80c-16 30-43 47-81 54l-83 16c-28 5-42 17-45 34-3 15 11 26 36 31 70 15 184 18 318 19 97 1 185-2 257-13 17-3 24-13 19-29l-8-24c-7-21-23-37-47-46l-75-28c-42-16-76-48-102-83-15-21-28-34-47-36-20-2-34 8-49 25Z" fill={`url(#${uid}-upper)`}/>
        <path d="M77 333c33-12 69-17 110-25 40-8 68-24 86-48l36-55c11-18 22-31 38-35 21-6 41 7 56 28 22 31 51 64 91 82 34 15 88 31 124 49 17 8 27 22 31 39l3 12c2 10-4 16-17 18-89 12-195 12-308 9l-207-5c-37-1-58-10-62-25-4-14 3-28 19-44Z" fill={`url(#${uid}-sole)`}/>
        <path d="M90 359c75 11 175 15 300 16 106 1 191-3 253-10" fill="none" stroke={c.shadow} strokeOpacity=".35" strokeWidth="5" strokeLinecap="round"/>
        <path d="M292 187c-11 29-24 58-42 84-20 28-46 45-78 52l-73 15" fill="none" stroke={c.panel} strokeOpacity=".6" strokeWidth="8" strokeLinecap="round"/>
        <path d="M341 195c25 29 47 63 60 103m-30-112c26 30 49 65 64 109m-34-119c24 28 47 62 62 103" fill="none" stroke={c.shadow} strokeOpacity=".48" strokeWidth="4" strokeLinecap="round"/>
        <path d="M329 228c19-4 46-2 67 6m-76 14c28-7 60-3 88 6m-99 11c29-8 65-4 95 5m-106 10c35-7 68-4 102 6" fill="none" stroke={c.lace} strokeWidth="7" strokeLinecap="round"/>
        <path d="M367 168c15-12 34-14 47-4 10 8 21 24 32 40l-35 15c-11-20-25-38-44-51Z" fill={c.accent}/>
        <path d="M498 273c29 6 56 14 80 25" fill="none" stroke={c.accent} strokeWidth="7" strokeLinecap="round"/>
        <path d="M294 185c14-21 30-35 48-38 21-3 36 11 51 29-29 4-54 15-74 32l-25-23Z" fill={`url(#${uid}-glass)`}/>
        <path d="M134 292c15-4 33-8 53-11" fill="none" stroke={c.panel} strokeWidth="7" strokeLinecap="round" opacity=".75"/>
        <path d="M464 215c12 14 25 28 40 41" fill="none" stroke={c.panel} strokeWidth="4" strokeLinecap="round" opacity=".42"/>
        <path d="m204 335 31-5m-15 17 37-5m180 19 31-1m-23 14 42-2" stroke={c.accent} strokeWidth="4" strokeLinecap="round" opacity=".7"/>
      </g>
    </svg>
  );
}

