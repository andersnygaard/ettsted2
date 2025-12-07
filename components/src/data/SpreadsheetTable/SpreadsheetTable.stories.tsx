import type { Meta, StoryObj } from '@storybook/react';
import { SpreadsheetTable } from './SpreadsheetTable';
import type { ColumnGroup } from './SpreadsheetTable';

const meta = {
  title: 'Data/SpreadsheetTable',
  component: SpreadsheetTable,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SpreadsheetTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const columnGroups: ColumnGroup[] = [
  {
    id: 'sparing',
    label: 'SPARING',
    color: '#5a6d7a',
    columns: [
      { id: 'nordnet', label: 'Nordnet ASK' },
      { id: 'bouvet', label: 'Bouvet ASK' },
      { id: 'yolo', label: 'Yolo' },
      { id: 'firi', label: 'Firi' },
      { id: 'kron', label: 'Kron' },
      { id: 'sparing_konto', label: 'S/K' },
      { id: 'sparing_total', label: 'Sum', isTotal: true },
    ],
  },
  {
    id: 'gjeld',
    label: 'GJELD',
    color: '#8a7060',
    columns: [
      { id: 'sbanken', label: 'SBanken' },
      { id: 'gjeld_total', label: 'Sum gjeld', isTotal: true },
    ],
  },
  {
    id: 'pensjon',
    label: 'PENSJON',
    color: '#6a7a60',
    columns: [
      { id: 'arbeidsgiver', label: 'Arb.giver' },
      { id: 'pensjon_total', label: 'Sum pensjon', isTotal: true },
    ],
  },
];

const mockData = [
  {
    id: 'snap-2024-11',
    date: '01.11.2024',
    nordnet: 450000,
    bouvet: 125000,
    yolo: 75000,
    firi: 45000,
    kron: 35000,
    sparing_konto: 25000,
    sparing_total: 755000,
    sbanken: 450000,
    gjeld_total: 450000,
    arbeidsgiver: 125000,
    pensjon_total: 125000,
  },
  {
    id: 'snap-2024-10',
    date: '01.10.2024',
    nordnet: 440000,
    bouvet: 120000,
    yolo: 70000,
    firi: 42000,
    kron: 33000,
    sparing_konto: 23000,
    sparing_total: 728000,
    sbanken: 460000,
    gjeld_total: 460000,
    arbeidsgiver: 120000,
    pensjon_total: 120000,
  },
  {
    id: 'snap-2024-09',
    date: '01.09.2024',
    nordnet: 430000,
    bouvet: 115000,
    yolo: 65000,
    firi: 40000,
    kron: 31000,
    sparing_konto: 22000,
    sparing_total: 703000,
    sbanken: 470000,
    gjeld_total: 470000,
    arbeidsgiver: 115000,
    pensjon_total: 115000,
  },
  {
    id: 'snap-2024-08',
    date: '01.08.2024',
    nordnet: 420000,
    bouvet: 110000,
    yolo: 60000,
    firi: 38000,
    kron: 29000,
    sparing_konto: 20000,
    sparing_total: 677000,
    sbanken: 480000,
    gjeld_total: 480000,
    arbeidsgiver: 110000,
    pensjon_total: 110000,
  },
];

export const Default: Story = {
  args: {
    columnGroups,
    data: mockData,
    dateKey: 'date',
    rowIdKey: 'id',
  },
};

export const WithMilestones: Story = {
  args: {
    columnGroups,
    data: mockData,
    dateKey: 'date',
    rowIdKey: 'id',
    milestones: {
      nordnet: [400000, 450000],
      sparing_total: [700000, 750000],
    },
  },
};

export const InitiallyCollapsed: Story = {
  args: {
    columnGroups,
    data: mockData,
    dateKey: 'date',
    rowIdKey: 'id',
    initialCollapsedGroups: ['sparing', 'gjeld'],
  },
};

export const WithEditing: Story = {
  args: {
    columnGroups,
    data: mockData,
    dateKey: 'date',
    rowIdKey: 'id',
    onCellChange: (event) => console.log('Cell changed:', event),
  },
};

export const EditingDisabled: Story = {
  args: {
    columnGroups,
    data: mockData,
    dateKey: 'date',
    rowIdKey: 'id',
    onCellChange: (event) => console.log('Cell changed:', event),
    editingDisabled: true,
  },
};

export const EmptyData: Story = {
  args: {
    columnGroups,
    data: [],
    dateKey: 'date',
    rowIdKey: 'id',
  },
};

export const SingleRow: Story = {
  args: {
    columnGroups,
    data: [mockData[0]],
    dateKey: 'date',
    rowIdKey: 'id',
  },
};

export const LargeDataset: Story = {
  args: {
    columnGroups,
    data: Array.from({ length: 24 }, (_, i) => ({
      id: `snap-2023-${String(12 - i).padStart(2, '0')}`,
      date: `01.${String(12 - i).padStart(2, '0')}.2023`,
      nordnet: 400000 + i * 5000,
      bouvet: 100000 + i * 1000,
      yolo: 50000 + i * 500,
      firi: 30000 + i * 300,
      kron: 20000 + i * 200,
      sparing_konto: 15000 + i * 100,
      sparing_total: 615000 + i * 7100,
      sbanken: 500000 - i * 2000,
      gjeld_total: 500000 - i * 2000,
      arbeidsgiver: 80000 + i * 800,
      pensjon_total: 80000 + i * 800,
    })),
    dateKey: 'date',
    rowIdKey: 'id',
  },
};

export const AccessibilityDemo: Story = {
  args: {
    columnGroups,
    data: mockData,
    dateKey: 'date',
    rowIdKey: 'id',
    caption: 'Portfolio snapshots with account balances from August to November 2024',
    onCellChange: (event) => console.log('Cell changed:', event),
    onRowDelete: (row) => console.log('Row deleted:', row),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates accessibility features: table caption, scope attributes on headers, and aria-live announcements for edit mode.',
      },
    },
  },
};
