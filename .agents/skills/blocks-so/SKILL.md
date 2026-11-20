---
name: blocks-so
description: >-
  Use when designing or building React + Tailwind + shadcn/ui application layouts, dashboards,
  sidebar shells, KPI stats rows, grid lists, tables, form layouts, dialogs, onboarding flows,
  or file upload sections modeled after the ephraimduncan/blocks (blocks.so) registry.
---

# blocks.so (`ephraimduncan/blocks`)

`blocks.so` is an open-source registry of 81 production React + Tailwind + shadcn/ui blocks covering dashboards (`dashboard-01`), collapsible sidebars (`sidebar-01`..`06`), KPI stat strips (`stats-01`..`15`), grid lists (`grid-list-01`..`03`), filterable tables (`table-01`..`05`), multi-column form layouts (`form-layout-01`..`05`), dialogs (`dialog-01`..`12`), onboarding sequences (`onboarding-01`..`07`), command menus (`command-menu-01`..`04`), and file upload dropzones (`file-upload-01`..`06`).

Full catalog: [references/registry.md](./references/registry.md)

## Registry Integration

When a project uses shadcn CLI (`components.json`):
```json
{
  "registries": {
    "@blocks-so": "https://blocks.so/r/{name}.json"
  }
}
```
Install a block directly:
```bash
npx shadcn@latest add @blocks-so/<block-name>
# or direct URL
npx shadcn@latest add https://blocks.so/r/<block-name>.json
```

When a project uses custom Tailwind CSS v3/v4 tokens without `components.json`, fetch the source JSON from `https://raw.githubusercontent.com/ephraimduncan/blocks/main/public/r/<name>.json`, preserve the block's layout proportions, spacing, and interaction model, and bind every color, radius, and button class to the project's existing design system tokens.

## Core Layout Patterns

1. **Dashboard Shell (`dashboard-01`, `sidebar-01`..`03`):**
   - Clean inset workspace with compact left navigation rail (`15.5rem` expanded, icon rail or mobile drawer below `md`), minimal sticky top bar (context title, search/quick action), and structured content bands without heavy shadow stacks.
2. **KPI / Stats Strip (`stats-02`, `stats-05`, `stats-06`):**
   - `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` (or 3-column) summary cards with crisp top metrics (`text-2xl font-semibold tracking-tight tabular-nums`), concise label, status indicator, and a clean bottom footer link strip (`border-t` action bar) leading directly into the corresponding section.
3. **Structured Form Layouts (`form-layout-01`, `form-layout-02`):**
   - Asymmetric split (`md:grid-cols-3`, 1-col section title/description + 2-col input grid `sm:grid-cols-6`) separated by hairlines (`Separator`) rather than nesting cards inside cards.
4. **Action Grid Lists & Tables (`grid-list-01`..`03`, `table-02`, `table-03`):**
   - Scannable toolbar (search input + inline filters + result count) pinned cleanly above list/grid/table regions; uniform card padding and pinned footer actions.
5. **File Upload Dropzones (`file-upload-03`, `file-upload-04`, `file-upload-06`):**
   - Dashed border dropzone with explicit drag-over state, file type/size helper copy, selected file summary pill, and remove/replace action.

## Adaptation Checklist

- Keep the host project's exact color tokens, typography, and brand button language (`action-primary`, `action-secondary`, semantic CSS variables).
- Replace all placeholder copy, currency, and mock arrays with live domain data and empty/loading/error states.
- Verify zero horizontal overflow at `390px` mobile and `1440px` desktop.
