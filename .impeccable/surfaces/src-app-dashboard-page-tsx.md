---
version: 1
slug: "src-app-dashboard-page-tsx"
primary_target: "src/app/dashboard/page.tsx"
related_targets: []
---

# Surface Brief: Dashboard (/dashboard)

- **Scope:** Full redesign of `src/app/dashboard/page.tsx` sections aligned directly with the landing page (`src/app/page.tsx`, `LearningFeatures.tsx`, `LearningRoadmap.tsx`) visual and structural grammar: Identity Header + Workspace Pill Tabs (`bg-canvas`), Full-Bleed Mentor / Tab Workspace Band (`bg-primary-soft` with `border-y border-line` and Beranda-style `rounded-2xl border border-line bg-white` two-zone cards), and Lower Summary Companion Band (`bg-canvas` asymmetric 2-column split matching `Cara Kerja Mentora`).
- **Visitor mode:** Operate — returning students (`Mentee`, `Mentor`, `Admin`) finding verified mentors, tracking booked sessions, managing skills/profile, and submitting/reviewing mentor credentials.
- **Constraints:** Preserve the established Google News palette (`#F8F7F4` canvas, `#FFFEFC`/`#FFFFFF` surface, `#202124` ink, `#3C4043` graphite, `#5F6368` ink-muted, `#E2DED7` line, `#174EA6` primary, `#D2E3FC` primary-soft band, `#0D652D` success), Navbar/Beranda `rounded-full` pill buttons (`action-primary` / `action-secondary`), all API contracts, `BookingModal`, and Indonesian UX copy.

## Direction contract

- **THESIS:** Replace crowded multi-column directory tables and stacked padded boxes with Beranda's calm, full-bleed section banding (`bg-canvas` ↔ `bg-primary-soft` ↔ `bg-canvas`), generous spacing, and crisp two-zone white `rounded-2xl` cards so every workspace section breathes and reads effortlessly at a glance.
- **OWN-WORLD:** Matte `#F8F7F4` canvas alternating with `#D2E3FC` (`bg-primary-soft`) full-bleed workspace band bordered top/bottom by `1px solid #E2DED7`; pure white `#FFFFFF` `rounded-2xl` cards with flat `border-line` frames (no drop-shadow stack clutter) and a subtle `bg-canvas border-b border-line` card header zone; Navbar-matched `rounded-full` workspace pill tabs and `action-primary`/`action-secondary` buttons; calm typography with `text-primary` text links and tabular numerals.
- **STORY:** On landing, a student immediately recognizes the exact visual rhythm of Beranda: a clean unboxed profile greeting with `Cari Partner Belajar` & `Pesan & Diskusi` pill buttons and pill workspace tabs on `#F8F7F4`, transitioning directly into a full-bleed soft-blue `#D2E3FC` `Daftar Mentor` section with clean search/filters and uncluttered two-zone white mentor cards, followed by a calm `#F8F7F4` summary band below.
- **FIRST VIEWPORT:** Unboxed compact Identity Header on `#F8F7F4` (clean avatar, bold `2xl–3xl` name + subtle role badge, 1-line university/domicile/EduPoints summary, right-aligned `rounded-full` action pills) with flush Navbar-style pill workspace tabs beneath; directly anchored into the full-bleed `bg-primary-soft border-y border-line` Mentor Directory section featuring clean title + search bar, `rounded-full` skill filter chips, and balanced Beranda-style two-zone mentor cards (`bg-canvas` header strip with name/verified check/mode -> calm white bio, neutral skill pills, EduPoints readout, `Lihat Profil` text link, and `Booking Sesi` pill CTA).
- **FORM:** Beranda-Aligned Alternating Section Bands + Two-Zone White Cards (user-directed refinement on `seed:229bdadbd6ca84a5`).
- **FINISH:** "unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance"
