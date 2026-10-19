import { mkdirSync, writeFileSync } from "node:fs";
mkdirSync("public/assets", { recursive: true });
const tones = {
  blue: ["#b9cdd8", "#688796"],
  violet: ["#d5cedf", "#8e82a7"],
  mint: ["#b9d2c9", "#648b7b"],
  peach: ["#ead3bd", "#b88e6d"],
  stone: ["#bfc0ba", "#676963"],
};
for (const [tone, [light, dark]] of Object.entries(tones)) {
  for (const type of [
    "phone",
    "tablet",
    "cover",
    "charger",
    "cable",
    "powerbank",
    "headphones",
    "earbuds",
  ]) {
    let shape = "";
    if (["phone", "tablet", "cover"].includes(type)) {
      const w = type === "tablet" ? 210 : 142,
        h = type === "tablet" ? 275 : 284,
        x = 200 - w / 2;
      shape = `<g transform="rotate(-10 200 200)"><rect x="${x}" y="55" width="${w}" height="${h}" rx="25" fill="url(#body)" stroke="${dark}" stroke-width="2"/><rect x="${x + 5}" y="60" width="${w - 10}" height="${h - 10}" rx="21" fill="none" stroke="white" stroke-opacity=".5"/><rect x="${x + 13}" y="69" width="65" height="72" rx="18" fill="${light}" stroke="${dark}" stroke-opacity=".4"/>${[
        [31, 87],
        [59, 87],
        [31, 118],
      ]
        .map(
          ([cx, cy]) =>
            `<circle cx="${x + cx}" cy="${cy}" r="12" fill="#22272a" stroke="${dark}" stroke-width="3"/><circle cx="${x + cx - 2}" cy="${cy - 3}" r="4" fill="#536273"/><circle cx="${x + cx - 4}" cy="${cy - 5}" r="1.5" fill="#bac8d2"/>`,
        )
        .join(
          "",
        )}<circle cx="${x + 59}" cy="118" r="5" fill="#f0eee5"/><path d="M200 190c-17-10-27 6-21 19 6 15 16 18 21 12 9 6 17-2 21-14-9-3-9-13-1-16-6-7-13-5-20-1z" fill="${dark}" opacity=".6"/><path d="M200 185q1-12 11-14-1 13-11 14" fill="${dark}" opacity=".6"/><rect x="${x + w}" y="112" width="3" height="40" rx="1" fill="${dark}"/></g>`;
    }
    if (type === "charger")
      shape =
        '<g transform="rotate(-12 200 200)"><rect x="139" y="120" width="124" height="145" rx="25" fill="url(#white)" stroke="#d2d1ca"/><rect x="161" y="77" width="13" height="51" rx="4" fill="#a2a29b"/><rect x="224" y="77" width="13" height="51" rx="4" fill="#a2a29b"/><rect x="180" y="245" width="43" height="10" rx="5" fill="#393b39"/><text x="200" y="192" text-anchor="middle" fill="#aaa" font-size="17" font-family="Arial">20W</text></g>';
    if (type === "earbuds")
      shape =
        '<g><rect x="106" y="199" width="188" height="113" rx="45" fill="url(#white)" stroke="#d1d0ca"/><path d="M108 232h184" stroke="#cfcec7"/><rect x="188" y="252" width="24" height="4" rx="2" fill="#c4c4bb"/><g transform="rotate(-20 152 140)"><rect x="145" y="105" width="17" height="85" rx="8" fill="url(#white)" stroke="#d1d0ca"/><ellipse cx="143" cy="107" rx="26" ry="22" fill="url(#white)" stroke="#d1d0ca"/><ellipse cx="126" cy="108" rx="7" ry="12" fill="#3b3c39"/></g><g transform="rotate(20 248 140)"><rect x="238" y="105" width="17" height="85" rx="8" fill="url(#white)" stroke="#d1d0ca"/><ellipse cx="258" cy="107" rx="26" ry="22" fill="url(#white)" stroke="#d1d0ca"/><ellipse cx="275" cy="108" rx="7" ry="12" fill="#3b3c39"/></g></g>';
    if (type === "headphones")
      shape = `<path d="M120 225v-50a80 80 0 0 1 160 0v50" fill="none" stroke="${dark}" stroke-width="23"/><path d="M120 170a80 80 0 0 1 160 0" fill="none" stroke="${light}" stroke-width="10"/><rect x="99" y="194" width="48" height="100" rx="22" fill="url(#body)"/><rect x="253" y="194" width="48" height="100" rx="22" fill="url(#body)"/>`;
    if (type === "powerbank")
      shape = `<g transform="rotate(-12 200 200)"><rect x="125" y="76" width="150" height="250" rx="22" fill="url(#body)" stroke="${dark}"/><rect x="177" y="84" width="46" height="9" rx="3" fill="#313431"/><text x="200" y="200" text-anchor="middle" fill="${dark}" font-size="28" font-family="Arial">20K</text><circle cx="179" cy="277" r="3" fill="white"/><circle cx="193" cy="277" r="3" fill="white"/><circle cx="207" cy="277" r="3" fill="white"/><circle cx="221" cy="277" r="3" fill="white"/></g>`;
    if (type === "cable")
      shape = `<path d="M140 130c-90 180 190 200 130 40s-170 90-70 100" stroke="${dark}" stroke-width="15" fill="none"/><rect x="119" y="79" width="35" height="80" rx="9" fill="url(#body)"/><rect x="126" y="57" width="21" height="29" rx="4" fill="#a7a8a4"/><rect x="188" y="249" width="35" height="80" rx="9" fill="url(#body)"/>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><linearGradient id="body" x1="0" x2="1" y2=".7"><stop stop-color="${light}"/><stop offset=".5" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></linearGradient><linearGradient id="white" x2=".8" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#deded7"/></linearGradient><filter id="shadow" x="-50%" y="-30%" width="200%" height="190%"><feDropShadow dx="7" dy="16" stdDeviation="12" flood-color="#171b18" flood-opacity=".14"/></filter></defs><g filter="url(#shadow)">${shape}</g></svg>`;
    writeFileSync(`public/assets/${type}-${tone}.svg`, svg);
  }
}
for (let i = 1; i <= 3; i++)
  writeFileSync(
    `public/assets/reel-${i}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="450" height="650"><defs><linearGradient id="b" x2="1" y2="1"><stop stop-color="${["#dcd3be", "#d1d9d3", "#d6c7b8"][i - 1]}"/><stop offset="1" stop-color="#8c8c7c"/></linearGradient></defs><rect width="450" height="650" fill="url(#b)"/><circle cx="340" cy="60" r="200" fill="#fff" opacity=".15"/><path d="M50 650Q10 470 160 375L220 330Q260 320 275 365L315 650" fill="#c89b79"/><g transform="rotate(${i === 2 ? 12 : -12} 225 300)"><rect x="135" y="140" width="180" height="330" rx="28" fill="${["#2e383c", "#c4cbc1", "#d6c1aa"][i - 1]}" stroke="#454b46" stroke-width="3"/><rect x="149" y="155" width="78" height="80" rx="20" fill="#626b65"/><circle cx="170" cy="177" r="14" fill="#151d22"/><circle cx="204" cy="177" r="14" fill="#151d22"/><circle cx="170" cy="212" r="14" fill="#151d22"/><circle cx="226" cy="320" r="17" fill="#fff" opacity=".25"/></g><text x="28" y="54" fill="white" font-family="Arial" font-size="16" letter-spacing="3">SAURABH STORIES</text></svg>`,
  );
