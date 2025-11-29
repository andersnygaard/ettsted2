# FEATURE: Portefølje (Portfolio) Page

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: page, portfolio, frontend
**Estimated Effort**: Medium - 3-4 hours

## Context & Motivation

The Portfolio page is the main data entry and viewing page, showing all monthly snapshots in a spreadsheet-style table.

## Reference

Design file: `.docs/design-drafts/draft-1-portfolio.html`

## Desired Outcome

Complete portfolio page with spreadsheet table, filters, and actions.

## Acceptance Criteria

- [ ] Update `/frontend/src/features/portfolio/PortfolioPage.tsx`
- [ ] Breadcrumb navigation (Oversikt → Portefølje)
- [ ] PageHeader with title and action buttons (Eksporter, + Ny måned)
- [ ] TableHeader with year filter and search
- [ ] SpreadsheetTable with all column groups
- [ ] TableFooter with pagination and column toggles
- [ ] Fetches data from portfolio API
- [ ] Loading and error states

## Technical Approach

```tsx
// PortfolioPage.tsx
export function PortfolioPage() {
  const { data: snapshots, isLoading } = useSnapshots();
  const [year, setYear] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const columnGroups = [
    {
      id: 'sparing',
      label: 'Sparing',
      color: '#5a6d7a',
      columns: [
        { id: 'nordnetAsk', label: 'Nordnet ASK' },
        { id: 'bouvetAsk', label: 'Bouvet ASK' },
        { id: 'yolo', label: 'Yolo' },
        { id: 'firi', label: 'Firi' },
        { id: 'kron', label: 'Kron' },
        { id: 'skattKjop', label: 'Skatt/Kjøp' },
        { id: 'sumSparing', label: 'Sum sparing', isTotal: true },
      ]
    },
    {
      id: 'gjeld',
      label: 'Gjeld',
      color: '#8a7060',
      columns: [
        { id: 'sbanken', label: 'SBanken' },
        { id: 'sumGjeld', label: 'Sum gjeld', isTotal: true },
      ]
    },
    {
      id: 'pensjon',
      label: 'Pensjon',
      color: '#6a7a60',
      columns: [
        { id: 'arbeidsgiver', label: 'Arbeidsgiver' },
        { id: 'sumPensjon', label: 'Sum pensjon', isTotal: true },
      ]
    }
  ];

  if (isLoading) return <PortfolioSkeleton />;

  return (
    <main className="portfolio-page">
      <div className="container container--wide">
        <Breadcrumb items={[
          { label: 'Oversikt', path: '/' },
          { label: 'Portefølje' }
        ]} />

        <PageHeader
          title="Portefølje"
          subtitle="Alle data samlet — klikk på gruppeoverskrifter for å utvide/kollapse"
          actions={
            <>
              <Button variant="secondary">Eksporter</Button>
              <Button variant="primary">+ Ny måned</Button>
            </>
          }
        />

        <div className="table-container">
          <TableHeader
            title="Månedlig historikk"
            years={[2025, 2024, 2023]}
            selectedYear={year}
            onYearChange={setYear}
            searchValue={search}
            onSearchChange={setSearch}
          />

          <SpreadsheetTable
            columnGroups={columnGroups}
            data={filteredData}
            dateKey="date"
          />

          <TableFooter
            showing={12}
            total={35}
            page={page}
            totalPages={3}
            onPageChange={setPage}
          />
        </div>
      </div>
    </main>
  );
}
```

## Dependencies

- `028-FEATURE-breadcrumb-component.md`
- `027-FEATURE-page-header-component.md`
- `029-FEATURE-button-component.md`
- `038-FEATURE-spreadsheet-table.md`
- `039-FEATURE-table-header-controls.md`
- `040-FEATURE-table-footer-pagination.md`

---

**Next Steps**: Implement after table components
