import { useState, useCallback } from "react";

const R = 8.31446;

const CHEMICALS = [
  { name: "Water", Tc: 647.3, Pc: 220.48, omega: 0.344 },
  { name: "Formaldehyde", Tc: 408, Pc: 65.86, omega: 0.253 },
  { name: "Methane", Tc: 190.6, Pc: 46, omega: 0.008 },
  { name: "Methanol", Tc: 512.6, Pc: 80.96, omega: 0.559 },
  { name: "Acetylene", Tc: 308.3, Pc: 61.4, omega: 0.184 },
  { name: "Acetonitrile", Tc: 548, Pc: 48.33, omega: 0.321 },
  { name: "Ethylene", Tc: 282.4, Pc: 50.36, omega: 0.085 },
  { name: "Acetaldehyde", Tc: 461, Pc: 55.73, omega: 0.303 },
  { name: "Ethylene oxide", Tc: 469, Pc: 71.94, omega: 0.2 },
  { name: "Acetic acid", Tc: 594.4, Pc: 57.86, omega: 0.454 },
  { name: "Ethane", Tc: 305.4, Pc: 48.74, omega: 0.099 },
  { name: "Ethanol", Tc: 516.2, Pc: 63.83, omega: 0.635 },
  { name: "Propylene", Tc: 365, Pc: 46.2, omega: 0.148 },
  { name: "Acetone", Tc: 508.1, Pc: 47.01, omega: 0.309 },
  { name: "Propane", Tc: 370, Pc: 42.44, omega: 0.152 },
  { name: "1-Propanol", Tc: 536.7, Pc: 51.68, omega: 0.624 },
  { name: "1,3-Butadiene", Tc: 425, Pc: 43.27, omega: 0.195 },
  { name: "cis-2-Butene", Tc: 435.6, Pc: 42.05, omega: 0.202 },
  { name: "trans-2-Butene", Tc: 428.6, Pc: 41.04, omega: 0.214 },
  { name: "Ethyl acetate", Tc: 523.2, Pc: 38.3, omega: 0.363 },
  { name: "n-Butane", Tc: 425.2, Pc: 37.9, omega: 0.193 },
  { name: "Isobutane", Tc: 408.1, Pc: 36.48, omega: 0.176 },
  { name: "n-Butanol", Tc: 562.9, Pc: 44.18, omega: 0.59 },
  { name: "1-Pentene", Tc: 464.7, Pc: 40.53, omega: 0.245 },
  { name: "n-Pentane", Tc: 469.6, Pc: 33.74, omega: 0.251 },
  { name: "Benzene", Tc: 562.1, Pc: 48.94, omega: 0.212 },
  { name: "Phenol", Tc: 694.2, Pc: 61.3, omega: 0.44 },
  { name: "Aniline", Tc: 699, Pc: 53.09, omega: 0.382 },
  { name: "Cyclohexane", Tc: 553.4, Pc: 40.73, omega: 0.213 },
  { name: "1-Hexene", Tc: 504, Pc: 31.71, omega: 0.285 },
  { name: "n-Hexane", Tc: 507.4, Pc: 29.69, omega: 0.296 },
  { name: "Toluene", Tc: 591.7, Pc: 41.14, omega: 0.257 },
  { name: "1-Heptene", Tc: 537.2, Pc: 28.37, omega: 0.358 },
  { name: "n-Heptane", Tc: 540.2, Pc: 27.36, omega: 0.351 },
  { name: "Styrene", Tc: 647, Pc: 39.92, omega: 0.257 },
  { name: "o-Xylene", Tc: 630.2, Pc: 37.29, omega: 0.314 },
  { name: "m-Xylene", Tc: 617, Pc: 35.46, omega: 0.331 },
  { name: "p-Xylene", Tc: 616.2, Pc: 35.16, omega: 0.324 },
  { name: "Ethylbenzene", Tc: 617.1, Pc: 36.07, omega: 0.301 },
  { name: "1-Octene", Tc: 566.6, Pc: 26.24, omega: 0.386 },
  { name: "n-Octane", Tc: 568.8, Pc: 24.82, omega: 0.394 },
  { name: "n-Nonane", Tc: 594.6, Pc: 23.1, omega: 0.444 },
  { name: "Naphthalene", Tc: 748.4, Pc: 40.53, omega: 0.302 },
  { name: "n-Decane", Tc: 617.6, Pc: 21.08, omega: 0.49 },
  { name: "Argon", Tc: 150.8, Pc: 48.74, omega: 20.004 },
  { name: "Boron trichloride", Tc: 451.95, Pc: 38.71, omega: 0.148 },
  { name: "Diborane", Tc: 289.8, Pc: 40.5, omega: 0.138 },
  { name: "Bromine", Tc: 584, Pc: 103.35, omega: 0.132 },
  { name: "Trichlorofluoromethane", Tc: 471.2, Pc: 44.08, omega: 0.188 },
  { name: "Carbon tetrafluoride", Tc: 227.6, Pc: 37.39, omega: 0.191 },
  { name: "Hexafluoroethane", Tc: 292.8, Pc: 30.42, omega: 0.255 },
  { name: "Chloroform", Tc: 536.4, Pc: 54.72, omega: 0.216 },
  { name: "Carbon monoxide", Tc: 132.9, Pc: 34.96, omega: 0.049 },
  { name: "Carbon dioxide", Tc: 304.2, Pc: 73.76, omega: 0.225 },
  { name: "Carbon disulfide", Tc: 552, Pc: 79.03, omega: 0.115 },
  { name: "Chlorine", Tc: 417, Pc: 77.01, omega: 0.073 },
  { name: "Fluorine", Tc: 144.3, Pc: 52.18, omega: 0.048 },
  { name: "Hydrogen", Tc: 33.2, Pc: 12.97, omega: 20.22 },
  { name: "Hydrogen bromide", Tc: 363.2, Pc: 85.52, omega: 0.063 },
  { name: "Hydrogen cyanide", Tc: 456.8, Pc: 53.9, omega: 0.407 },
  { name: "Hydrogen chloride", Tc: 324.6, Pc: 83.09, omega: 0.12 },
  { name: "Hydrogen sulfide", Tc: 373.2, Pc: 89.37, omega: 0.1 },
  { name: "Ammonia", Tc: 405.6, Pc: 112.77, omega: 0.25 },
  { name: "Helium-4", Tc: 5.19, Pc: 2.27, omega: 20.387 },
  { name: "Hydrogen fluoride", Tc: 461, Pc: 64.85, omega: 0.372 },
  { name: "Krypton", Tc: 209.4, Pc: 55.02, omega: 20.002 },
  { name: "Nitrogen", Tc: 126.2, Pc: 33.84, omega: 0.039 },
  { name: "Nitrogen trifluoride", Tc: 234, Pc: 45.29, omega: 0.132 },
  { name: "Nitrous oxide", Tc: 309.6, Pc: 72.45, omega: 0.16 },
  { name: "Nitric oxide", Tc: 180, Pc: 64.85, omega: 0.607 },
  { name: "Nitrogen dioxide", Tc: 431.4, Pc: 101.33, omega: 0.86 },
  { name: "Neon", Tc: 44.4, Pc: 27.56, omega: 0 },
  { name: "Oxygen", Tc: 154.6, Pc: 50.46, omega: 0.021 },
  { name: "Phosphene", Tc: 324.45, Pc: 65.35, omega: 0.042 },
  { name: "Sulfur hexafluoride", Tc: 318.7, Pc: 37.59, omega: 0.286 },
  { name: "Sulfur dioxide", Tc: 430.8, Pc: 78.83, omega: 0.251 },
  { name: "Sulfur trioxide", Tc: 491, Pc: 82.07, omega: 0.41 },
  { name: "Trichlorosilane", Tc: 479, Pc: 41.7, omega: 0.203 },
  { name: "Silicon tetrachloride", Tc: 507, Pc: 37.49, omega: 0.264 },
  { name: "Silicon tetrafluoride", Tc: 259.09, Pc: 37.15, omega: 0.456 },
  { name: "Silane", Tc: 269.69, Pc: 48.43, omega: 0.089 },
  { name: "Tungsten hexafluoride", Tc: 444, Pc: 43.4, omega: 0.231 },
];

// ── Cubic root solver (Cardano) ───────────────────────────────────────────────
function cubicRealRoots(A, B, C, D) {
  const b = B / A, c = C / A, d = D / A;
  const shift = b / 3;
  const p = c - b * b / 3;
  const q = 2 * b * b * b / 27 - b * c / 3 + d;
  const disc = q * q / 4 + p * p * p / 27;
  let roots = [];
  if (disc > 1e-14) {
    const sqD = Math.sqrt(disc);
    const u = Math.cbrt(-q / 2 + sqD);
    const v = Math.cbrt(-q / 2 - sqD);
    roots = [u + v - shift];
  } else if (Math.abs(disc) <= 1e-14) {
    const u = Math.cbrt(-q / 2);
    roots = [2 * u - shift, -u - shift];
  } else {
    const m = 2 * Math.sqrt(-p / 3);
    const theta = Math.acos(Math.max(-1, Math.min(1, 3 * q / (p * m)))) / 3;
    roots = [
      m * Math.cos(theta) - shift,
      m * Math.cos(theta + 2 * Math.PI / 3) - shift,
      m * Math.cos(theta + 4 * Math.PI / 3) - shift,
    ];
  }
  return roots;
}

// ── EOS parameters ────────────────────────────────────────────────────────────
function getParams(eosType, Tc, PcPa, omega, T) {
  const Tr = T / Tc;
  let a, b, alpha = 1, fw = 0;
  if (eosType === "vdW") {
    a = 27 / 64 * R * R * Tc * Tc / PcPa;
    b = R * Tc / (8 * PcPa);
  } else if (eosType === "RK") {
    a = 0.42748 * R * R * Math.pow(Tc, 2.5) / (PcPa * Math.sqrt(T));
    b = 0.08664 * R * Tc / PcPa;
  } else if (eosType === "SRK") {
    fw = 0.48 + 1.574 * omega - 0.176 * omega * omega;
    alpha = Math.pow(1 + fw * (1 - Math.sqrt(Tr)), 2);
    a = 0.42748 * R * R * Tc * Tc * alpha / PcPa;
    b = 0.08664 * R * Tc / PcPa;
  } else {
    fw = 0.37464 + 1.54226 * omega - 0.26992 * omega * omega;
    alpha = Math.pow(1 + fw * (1 - Math.sqrt(Tr)), 2);
    a = 0.45724 * R * R * Tc * Tc * alpha / PcPa;
    b = 0.07780 * R * Tc / PcPa;
  }
  return { a, b, alpha, fw };
}

// ── Solve Z-cubic and return physical volume roots ────────────────────────────
function solveVolumes(eosType, params, T, P) {
  const { a, b } = params;
  const Av = a * P / (R * R * T * T);
  const Bv = b * P / (R * T);
  let coeffs;
  if (eosType === "vdW") {
    coeffs = [1, -(Bv + 1), Av, -Av * Bv];
  } else if (eosType === "RK" || eosType === "SRK") {
    coeffs = [1, -1, Av - Bv - Bv * Bv, -Av * Bv];
  } else {
    coeffs = [1, -(1 - Bv), Av - 2 * Bv - 3 * Bv * Bv, -(Av * Bv - Bv * Bv - Bv * Bv * Bv)];
  }
  const Zroots = cubicRealRoots(...coeffs);
  return Zroots
    .filter(z => z > Bv && !isNaN(z) && isFinite(z))
    .map(z => ({ Z: z, V: z * R * T / P }));
}

// ── Departure functions from Z ────────────────────────────────────────────────
function departureFromZ(eosType, params, T, P, Z) {
  const { a, b } = params;
  const Av = a * P / (R * R * T * T);
  const Bv = b * P / (R * T);
  const sq2 = Math.sqrt(2);
  let dH, dS;
  if (eosType === "vdW") {
    dH = R * T * (Z - 1) - Av * R * T / Z;
    dS = R * Math.log(Z - Bv);
  } else if (eosType === "RK") {
    dH = R * T * (Z - 1) - 1.5 * Av * R * T / Bv * Math.log(1 + Bv / Z);
    dS = R * Math.log(Z - Bv) - Av * R / Bv * Math.log(1 + Bv / Z);
  } else if (eosType === "SRK") {
    dH = R * T * (Z - 1) - Av * R * T / Bv * Math.log(1 + Bv / Z);
    dS = R * Math.log(Z - Bv) - Av * R / Bv * Math.log(1 + Bv / Z);
  } else {
    const logTerm = Math.log((Z + (1 + sq2) * Bv) / (Z + (1 - sq2) * Bv));
    dH = R * T * (Z - 1) - Av * R * T / (2 * sq2 * Bv) * logTerm;
    dS = R * Math.log(Z - Bv) - Av * R / (2 * sq2 * Bv) * logTerm;
  }
  const dU = dH - R * T * (Z - 1);
  const dG = dH - T * dS;
  const phi = Math.exp(dG / (R * T));
  return { dH, dU, dS, dG, phi };
}

// ── Main EOS solver — returns roots ordered liquid, vapor, third ──────────────
function solveEOS(eosType, Tc, Pc, omega, T, P) {
  const PcPa = Pc * 1e5;
  const params = getParams(eosType, Tc, PcPa, omega, T);
  const roots = solveVolumes(eosType, params, T, P);
  // Sort ascending Z so smallest = liquid candidate, largest = vapor candidate
  roots.sort((a, b) => a.Z - b.Z);

  const labelled = roots.map((r, i) => {
    const dep = departureFromZ(eosType, params, T, P, r.Z);
    let phase;
    if (roots.length === 1) {
      phase = "vapor";
    } else if (i === 0) {
      phase = "liquid";
    } else if (i === roots.length - 1) {
      phase = "vapor";
    } else {
      phase = "third";
    }
    return { ...r, ...dep, phase };
  });

  // Reorder: liquid first, then vapor, then third (unphysical)
  const liquid = labelled.filter(r => r.phase === "liquid");
  const vapor  = labelled.filter(r => r.phase === "vapor");
  const third  = labelled.filter(r => r.phase === "third");
  return [...liquid, ...vapor, ...third];
}

// ── Number formatter: 2-3 sig decimals, scientific for very large/small ───────
function fmt(n, d) {
  d = (d === undefined) ? 3 : d;
  if (n === undefined || n === null || isNaN(n) || !isFinite(n)) return "—";
  if (Math.abs(n) >= 1e6 || (Math.abs(n) < 1e-4 && n !== 0)) return n.toExponential(2);
  return n.toFixed(d);
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0c0e14;--surf:#12151d;--surf2:#181c27;--bord:#222738;
  --gold:#c8a96e;--teal:#6eb5c8;--mist:#a06ec8;
  --txt:#e8e4dc;--muted:#6a7090;--red:#c86e6e;
}
body{background:var(--bg);color:var(--txt);font-family:'DM Sans',sans-serif;min-height:100vh}
.app{min-height:100vh;background:var(--bg);background-image:radial-gradient(ellipse 60% 40% at 20% 0%,rgba(200,169,110,.06) 0%,transparent 60%),radial-gradient(ellipse 40% 30% at 80% 100%,rgba(110,181,200,.05) 0%,transparent 60%)}
.hdr{padding:2rem 2rem 1.4rem;border-bottom:1px solid var(--bord);display:flex;align-items:flex-end;gap:1.5rem;flex-wrap:wrap}
.hdr-eyebrow{font-family:'IBM Plex Mono',monospace;font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-bottom:.3rem}
.hdr-title{font-family:'DM Serif Display',serif;font-size:clamp(1.5rem,3.5vw,2.2rem);line-height:1.1;color:var(--txt)}
.layout{display:grid;grid-template-columns:340px 1fr;min-height:calc(100vh - 110px)}
.left{border-right:1px solid var(--bord);padding:1.4rem;display:flex;flex-direction:column;gap:1rem;overflow-y:auto}
.right{padding:1.4rem;display:flex;flex-direction:column;gap:1rem;overflow-y:auto}
.card{background:var(--surf);border:1px solid var(--bord);border-radius:6px;padding:1rem 1.1rem}
.card-label{font-family:'IBM Plex Mono',monospace;font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-bottom:.85rem;display:flex;align-items:center;gap:.5rem}
.card-label::after{content:'';flex:1;height:1px;background:var(--bord)}
.radio-row{display:flex;align-items:center;gap:.55rem;padding:.42rem .6rem;border-radius:4px;cursor:pointer;border:1px solid transparent;transition:all .15s;font-size:.85rem;user-select:none}
.radio-row:hover{background:var(--surf2)}
.radio-row.sel{background:var(--surf2);border-color:var(--gold);color:var(--gold)}
.dot{width:13px;height:13px;border-radius:50%;border:2px solid var(--bord);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:border-color .15s}
.radio-row.sel .dot{border-color:var(--gold)}
.dot-inner{width:5px;height:5px;border-radius:50%;background:var(--gold)}
label{display:block;font-size:.72rem;color:var(--muted);margin-bottom:.25rem;letter-spacing:.04em}
select,input[type=number]{width:100%;background:var(--bg);border:1px solid var(--bord);color:var(--txt);padding:.45rem .65rem;border-radius:4px;font-size:.85rem;font-family:'IBM Plex Mono',monospace;outline:none;transition:border-color .15s;appearance:none}
select:focus,input[type=number]:focus{border-color:var(--teal)}
select{cursor:pointer}
.tri{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.45rem;border-top:1px solid var(--bord);margin-top:.75rem;padding-top:.75rem}
.field{margin-bottom:.65rem}.field:last-child{margin-bottom:0}
.btn{width:100%;padding:.7rem;background:var(--gold);color:#0c0e14;border:none;border-radius:4px;font-family:'IBM Plex Mono',monospace;font-size:.82rem;font-weight:500;letter-spacing:.07em;cursor:pointer;transition:opacity .15s,transform .1s}
.btn:hover{opacity:.85}.btn:active{transform:scale(.98)}
.btn.sec{background:transparent;border:1px solid var(--teal);color:var(--teal);margin-top:.45rem}
.btn.sec:hover{background:rgba(110,181,200,.08)}
.err{background:rgba(200,110,110,.1);border:1px solid var(--red);border-radius:4px;padding:.65rem .9rem;font-size:.78rem;color:var(--red);font-family:'IBM Plex Mono',monospace}
.res-title{font-family:'DM Serif Display',serif;font-size:1.25rem;color:var(--txt)}
.phase{background:var(--surf);border:1px solid var(--bord);border-radius:6px;padding:1rem 1.1rem;position:relative;overflow:hidden}
.phase::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px}
.phase.liq::before{background:var(--teal)}
.phase.vap::before{background:var(--gold)}
.phase.third::before{background:var(--mist)}
.phase-hdr{font-family:'IBM Plex Mono',monospace;font-size:.65rem;letter-spacing:.16em;text-transform:uppercase;margin-bottom:.7rem;display:flex;align-items:center;gap:.5rem}
.phase.liq .phase-hdr{color:var(--teal)}.phase.vap .phase-hdr{color:var(--gold)}.phase.third .phase-hdr{color:var(--mist)}
.badge{font-size:.56rem;padding:.1rem .35rem;border-radius:2px;opacity:.75}
.liq .badge{background:rgba(110,181,200,.15);color:var(--teal)}
.vap .badge{background:rgba(200,169,110,.15);color:var(--gold)}
.third .badge{background:rgba(160,110,200,.15);color:var(--mist)}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:.45rem 1.4rem;margin-bottom:.7rem}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.45rem 1rem}
.di label{font-size:.65rem;color:var(--muted);margin-bottom:.1rem;letter-spacing:.05em}
.di .v{font-family:'IBM Plex Mono',monospace;font-size:.82rem;color:var(--txt)}
.div{border:none;border-top:1px solid var(--bord);margin:.65rem 0}
.dep-hdr{font-family:'IBM Plex Mono',monospace;font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:.55rem}
.empty{text-align:center;padding:5rem 2rem;color:var(--muted)}
.empty-icon{font-size:2.5rem;opacity:.35;margin-bottom:1rem}
.empty-title{font-family:'DM Serif Display',serif;font-size:1.2rem;color:var(--muted)}
.empty-sub{font-size:.78rem;margin-top:.4rem}
.saved-note{background:rgba(110,181,200,.07);border:1px solid rgba(110,181,200,.25);border-radius:4px;padding:.45rem .75rem;font-size:.72rem;font-family:'IBM Plex Mono',monospace;color:var(--teal);display:flex;justify-content:space-between;align-items:center}
.saved-note button{background:none;border:none;color:inherit;cursor:pointer;font-size:.9rem}
@media(max-width:720px){.layout{grid-template-columns:1fr}.left{border-right:none;border-bottom:1px solid var(--bord)}}
`;

const EOS_OPTS = [
  { key: "vdW", label: "van der Waals" },
  { key: "RK", label: "Redlich-Kwong" },
  { key: "SRK", label: "Soave-Redlich-Kwong" },
  { key: "PR", label: "Peng-Robinson" },
];

function PhaseCard({ r, savedLabel }) {
  const pc = r.phase === "liquid" ? "liq" : r.phase === "vapor" ? "vap" : "third";
  const label = r.phase === "liquid" ? "Liquid" : r.phase === "vapor" ? "Vapor" : "Third (Unphysical)";
  return (
    <div className={"phase " + pc}>
      <div className="phase-hdr">
        {label}
        <span className="badge">{savedLabel || "Root"}</span>
      </div>
      <div className="grid2">
        <div className="di"><label>Compressibility Z</label><div className="v">{fmt(r.Z, 5)}</div></div>
        <div className="di"><label>Molar Volume v (m³/mol)</label><div className="v">{fmt(r.V, 6)}</div></div>
      </div>
      <hr className="div" />
      <div className="dep-hdr">Departure Functions</div>
      <div className="grid3">
        <div className="di"><label>Δhᵈᵉᵖ (J/mol)</label><div className="v">{fmt(r.dH, 2)}</div></div>
        <div className="di"><label>Δuᵈᵉᵖ (J/mol)</label><div className="v">{fmt(r.dU, 2)}</div></div>
        <div className="di"><label>Δsᵈᵉᵖ (J/mol·K)</label><div className="v">{fmt(r.dS, 3)}</div></div>
        <div className="di"><label>Δgᵈᵉᵖ (J/mol)</label><div className="v">{fmt(r.dG, 2)}</div></div>
        <div className="di"><label>Fugacity coeff. φ</label><div className="v">{fmt(r.phi, 4)}</div></div>
      </div>
    </div>
  );
}

export default function App() {
  const [eos, setEos] = useState("PR");
  const [molecule, setMolecule] = useState("Water");
  const [cTc, setCTc] = useState(647.3);
  const [cPc, setCPc] = useState(220.48);
  const [cOmega, setCOmega] = useState(0.344);
  const [temp, setTemp] = useState(400);
  const [pres, setPres] = useState(50);
  const [results, setResults] = useState(null);
  const [saved, setSaved] = useState(null);
  const [error, setError] = useState("");

  const handleMolChange = (name) => {
    setMolecule(name);
    if (name !== "Custom") {
      const c = CHEMICALS.find(x => x.name === name);
      if (c) { setCTc(c.Tc); setCPc(c.Pc); setCOmega(c.omega); }
    }
  };

  const getTcPcOmega = useCallback(() => {
    if (molecule === "Custom") return [cTc, cPc, cOmega];
    const c = CHEMICALS.find(x => x.name === molecule);
    return c ? [c.Tc, c.Pc, c.omega] : [cTc, cPc, cOmega];
  }, [molecule, cTc, cPc, cOmega]);

  const calculate = useCallback(() => {
    setError("");
    const [Tc, Pc, omega] = getTcPcOmega();
    if (Tc <= 0 || Pc <= 0 || temp <= 0 || pres <= 0 || omega < 0) {
      setError("Invalid inputs — all temperatures and pressures must be positive.");
      setResults(null); return;
    }
    try {
      const res = solveEOS(eos, Tc, Pc, omega, temp, pres);
      if (!res.length) { setError("No physical roots found for these conditions."); setResults(null); return; }
      setResults(res);
    } catch (e) {
      setError("Calculation error: " + e.message); setResults(null);
    }
  }, [eos, getTcPcOmega, temp, pres]);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="hdr">
          <div>
            <div className="hdr-eyebrow">Cubic Equation of State Solver</div>
            <div className="hdr-title">Thermodynamic Properties Calculator</div>
          </div>
        </div>
        <div className="layout">
          <div className="left">
            <div className="card">
              <div className="card-label">Equation of State</div>
              {EOS_OPTS.map(o => (
                <div key={o.key} className={"radio-row" + (eos === o.key ? " sel" : "")} onClick={() => setEos(o.key)}>
                  <div className="dot">{eos === o.key && <div className="dot-inner" />}</div>
                  {o.label}
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-label">Species</div>
              <div className="field">
                <label>Molecule</label>
                <select value={molecule} onChange={e => handleMolChange(e.target.value)}>
                  <option value="Custom">Custom</option>
                  {CHEMICALS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="tri">
                <div>
                  <label>Tᶜ (K)</label>
                  <input type="number" value={cTc} step="0.1" onChange={e => { setCTc(parseFloat(e.target.value)); setMolecule("Custom"); }} />
                </div>
                <div>
                  <label>Pᶜ (bar)</label>
                  <input type="number" value={cPc} step="0.1" onChange={e => { setCPc(parseFloat(e.target.value)); setMolecule("Custom"); }} />
                </div>
                <div>
                  <label>ω</label>
                  <input type="number" value={cOmega} step="0.001" onChange={e => { setCOmega(parseFloat(e.target.value)); setMolecule("Custom"); }} />
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-label">State Conditions</div>
              <div className="field">
                <label>Temperature (K)</label>
                <input type="number" value={temp} step="1" onChange={e => setTemp(parseFloat(e.target.value))} />
              </div>
              <div className="field">
                <label>Pressure (bar)</label>
                <input type="number" value={pres} step="1" onChange={e => setPres(parseFloat(e.target.value))} />
              </div>
            </div>
            <button className="btn" onClick={calculate}>Calculate</button>
            {results && <button className="btn sec" onClick={() => setSaved(results)}>Save Current Run</button>}
            {error && <div className="err">⚠ {error}</div>}
          </div>
          <div className="right">
            {saved && (
              <div className="saved-note">
                <span>Saved run shown below current results</span>
                <button onClick={() => setSaved(null)}>✕</button>
              </div>
            )}
            {results ? (
              <>
                <div className="res-title">Results</div>
                {results.map((r, i) => <PhaseCard key={i} r={r} />)}
                {saved && (
                  <>
                    <div className="res-title" style={{marginTop:".5rem",opacity:.55}}>Saved Run</div>
                    {saved.map((r, i) => <PhaseCard key={i} r={r} savedLabel="Saved" />)}
                  </>
                )}
              </>
            ) : (
              <div className="empty">
                <div className="empty-icon">⚗</div>
                <div className="empty-title">No results yet</div>
                <div className="empty-sub">Configure parameters on the left and press Calculate</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
