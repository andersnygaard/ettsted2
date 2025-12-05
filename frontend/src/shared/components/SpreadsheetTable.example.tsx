/**
 * SpreadsheetTable Component Example
 *
 * This file demonstrates how to use the SpreadsheetTable component
 * with realistic portfolio data.
 */

import { SpreadsheetTable, type ColumnGroup } from '@finans/components';

/**
 * Example: Portfolio Table with Full Data
 */
export function PortfolioTableExample() {
  // Define column groups
  const columnGroups: ColumnGroup[] = [
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
      ],
    },
    {
      id: 'gjeld',
      label: 'Gjeld',
      color: '#8a7060',
      columns: [
        { id: 'sbanken', label: 'SBanken' },
        { id: 'sumGjeld', label: 'Sum gjeld', isTotal: true },
      ],
    },
    {
      id: 'pensjon',
      label: 'Pensjon',
      color: '#6a7a60',
      columns: [
        { id: 'arbeidsgiver', label: 'Arbeidsgiver' },
        { id: 'sumPensjon', label: 'Sum pensjon', isTotal: true },
      ],
    },
  ];

  // Sample portfolio data (from design reference)
  const data = [
    {
      date: '01.03.2025',
      nordnetAsk: 218037,
      bouvetAsk: 144566,
      yolo: 86890,
      firi: 2634,
      kron: 344371,
      skattKjop: null,
      sumSparing: 796498,
      sbanken: 798450,
      sumGjeld: 798450,
      arbeidsgiver: 2850000,
      sumPensjon: 3920000,
    },
    {
      date: '01.02.2025',
      nordnetAsk: 214137,
      bouvetAsk: 164404,
      yolo: 81225,
      firi: 2077,
      kron: 351156,
      skattKjop: null,
      sumSparing: 812999,
      sbanken: 805200,
      sumGjeld: 805200,
      arbeidsgiver: 2820000,
      sumPensjon: 3890000,
    },
    {
      date: '01.01.2025',
      nordnetAsk: 208716,
      bouvetAsk: 155588,
      yolo: 76878,
      firi: 981,
      kron: 330720,
      skattKjop: null,
      sumSparing: 772883,
      sbanken: 811900,
      sumGjeld: 811900,
      arbeidsgiver: 2790000,
      sumPensjon: 3848757,
    },
    {
      date: '01.12.2024',
      nordnetAsk: 231399,
      bouvetAsk: 116131,
      yolo: 77931,
      firi: null,
      kron: 326450,
      skattKjop: null,
      sumSparing: 751911,
      sbanken: 818600,
      sumGjeld: 818600,
      arbeidsgiver: 2760000,
      sumPensjon: 3810000,
    },
    {
      date: '01.11.2024',
      nordnetAsk: 236088,
      bouvetAsk: 109575,
      yolo: 77207,
      firi: null,
      kron: 310177,
      skattKjop: null,
      sumSparing: 733047,
      sbanken: 823751,
      sumGjeld: 823751,
      arbeidsgiver: 2730000,
      sumPensjon: 3780000,
    },
  ];

  // Milestone detection: Values that crossed thresholds
  const milestones = {
    yolo: [80000], // Crossed 80k in Feb 2025
    sumSparing: [750000, 800000], // Crossed 750k and 800k
    bouvetAsk: [100000], // Crossed 100k in Feb 2025
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-title">Månedlig historikk</div>
        <div className="table-controls">
          <select className="filter-select">
            <option>Alle år</option>
            <option>2025</option>
            <option>2024</option>
          </select>
          <input type="text" className="search-input" placeholder="Søk..." />
        </div>
      </div>

      <SpreadsheetTable
        columnGroups={columnGroups}
        data={data}
        dateKey="date"
        milestones={milestones}
      />

      <div className="table-footer">
        <div className="table-info">Viser 5 av 35 måneder</div>
        <div className="column-toggles">
          <label className="column-toggle">
            <input type="checkbox" defaultChecked /> Sparing
          </label>
          <label className="column-toggle">
            <input type="checkbox" defaultChecked /> Gjeld
          </label>
          <label className="column-toggle">
            <input type="checkbox" defaultChecked /> Pensjon
          </label>
        </div>
        <div className="pagination">
          <button>← Forrige</button>
          <button className="active">1</button>
          <button>2</button>
          <button>Neste →</button>
        </div>
      </div>
    </div>
  );
}

/**
 * Example: Minimal Table with Two Groups
 */
export function MinimalTableExample() {
  const columnGroups: ColumnGroup[] = [
    {
      id: 'assets',
      label: 'Assets',
      color: '#5a6d7a',
      columns: [
        { id: 'stocks', label: 'Stocks' },
        { id: 'bonds', label: 'Bonds' },
        { id: 'totalAssets', label: 'Total', isTotal: true },
      ],
    },
    {
      id: 'liabilities',
      label: 'Liabilities',
      color: '#8a7060',
      columns: [
        { id: 'mortgage', label: 'Mortgage' },
        { id: 'totalLiabilities', label: 'Total', isTotal: true },
      ],
    },
  ];

  const data = [
    {
      date: '01.01.2025',
      stocks: 500000,
      bonds: 200000,
      totalAssets: 700000,
      mortgage: 300000,
      totalLiabilities: 300000,
    },
    {
      date: '01.12.2024',
      stocks: 480000,
      bonds: 190000,
      totalAssets: 670000,
      mortgage: 310000,
      totalLiabilities: 310000,
    },
  ];

  return (
    <SpreadsheetTable
      columnGroups={columnGroups}
      data={data}
      dateKey="date"
    />
  );
}
