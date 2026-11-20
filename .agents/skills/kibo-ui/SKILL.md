---
name: kibo-ui
description: >-
  Use when building composable, accessible UI primitives and interactive workspace widgets
  modeled after shadcnblocks/kibo (Kibo UI): Status indicators, Pill chips, MiniCalendar,
  Calendar, Dropzone, Tags, AvatarStack, Choicebox, Banner, List, Table, Rating, Kanban,
  or Gantt components.
---

# Kibo UI (`shadcnblocks/kibo`)

Kibo UI is a composable open-source component registry of 41 advanced primitives designed to extend shadcn/ui with production state management and accessibility patterns (`pill`, `status`, `mini-calendar`, `calendar`, `dropzone`, `tags`, `avatar-stack`, `choicebox`, `banner`, `list`, `table`, `rating`, `relative-time`, `kanban`, `gantt`, `snippet`, `tree`, etc.).

Full catalog: [references/registry.md](./references/registry.md)

## Registry Integration

When a project uses shadcn CLI (`components.json`):
```json
{
  "registries": {
    "@kibo-ui": "https://www.kibo-ui.com/r/{name}.json"
  }
}
```
Install a component:
```bash
npx shadcn@latest add @kibo-ui/<component-name>
# or direct URL
npx shadcn@latest add https://www.kibo-ui.com/r/<component-name>.json
```

When integrating into a custom Tailwind project without Radix/shadcn CLI scaffolding, fetch the reference implementation from `https://www.kibo-ui.com/r/<name>.json` or `https://api.github.com/repos/shadcnblocks/kibo/contents/packages/<name>` and compose equivalent lightweight, zero-bloat primitives using the project's design tokens and icon library.

## Key Composable Primitives

1. **`Status` (`Status`, `StatusIndicator`, `StatusLabel`):**
   - Compound status pill with a subtle live indicator dot (`online`, `offline`, `maintenance`, `degraded` mapped to semantic project tokens like verified mentor / pending review / available online). Respect `motion-reduce` on ping indicators.
2. **`Pill` (`Pill`, `PillAvatar`, `PillIndicator`, `PillStatus`, `PillButton`):**
   - Compact pill containers for skill tags, active filters, quick metadata, and dismissible filter chips with consistent `rounded-full` geometry and accessible focus states.
3. **`MiniCalendar` (`MiniCalendar`, `MiniCalendarNavigation`, `MiniCalendarDays`, `MiniCalendarDay`):**
   - Compact 5-to-7 day horizontal date picker strip ideal for scheduling agendas, upcoming session previews, and quick booking jumps without taking a whole viewport.
4. **`Dropzone` (`Dropzone`, `DropzoneContent`, `DropzoneEmptyState`):**
   - Drag-and-drop file upload zone with active drag visual feedback, readable byte-size formatting, file validation messaging, and accessible keyboard trigger.
5. **`Tags` / `Choicebox` / `Banner`:**
   - Structured multi-skill tags, card-based option pickers, and slim contextual banners for verification status or onboarding tips.

## Adaptation Checklist

- Map every color variant (`online`/`success`, `maintenance`/`primary`, `degraded`/`warning`, `offline`/`danger`) onto the host project's semantic palette (`tailwind.config.*` / `globals.css`).
- Preserve accessible ARIA attributes (`aria-pressed`, `aria-current`, `aria-live`, keyboard arrow navigation on calendars).
- Keep transitions subtle and honor `prefers-reduced-motion`.
