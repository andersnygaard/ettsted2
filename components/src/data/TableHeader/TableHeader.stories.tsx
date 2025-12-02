import type { Meta, StoryObj } from '@storybook/react';
import { TableHeader } from './TableHeader';

const meta = {
  title: 'Data/TableHeader',
  component: TableHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TableHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Månedlig historikk',
  },
};

export const WithYearFilter: Story = {
  args: {
    title: 'Månedlig historikk',
    years: [2024, 2023, 2022, 2021],
    selectedYear: 2024,
    onYearChange: (year) => console.log('Year changed:', year),
  },
};

export const WithSearch: Story = {
  args: {
    title: 'Månedlig historikk',
    searchValue: '',
    onSearchChange: (value) => console.log('Search:', value),
  },
};

export const WithBothControls: Story = {
  args: {
    title: 'Månedlig historikk',
    years: [2024, 2023, 2022, 2021],
    selectedYear: 2024,
    onYearChange: (year) => console.log('Year changed:', year),
    searchValue: '',
    onSearchChange: (value) => console.log('Search:', value),
  },
};

export const AllYearsSelected: Story = {
  args: {
    title: 'Månedlig historikk',
    years: [2024, 2023, 2022, 2021],
    selectedYear: null,
    onYearChange: (year) => console.log('Year changed:', year),
  },
};

export const WithSearchText: Story = {
  args: {
    title: 'Månedlig historikk',
    years: [2024, 2023, 2022, 2021],
    selectedYear: 2024,
    onYearChange: (year) => console.log('Year changed:', year),
    searchValue: '01.01.2024',
    onSearchChange: (value) => console.log('Search:', value),
  },
};

export const DifferentTitle: Story = {
  args: {
    title: 'Transaksjoner',
    years: [2024, 2023],
    selectedYear: 2024,
    onYearChange: (year) => console.log('Year changed:', year),
    searchValue: '',
    onSearchChange: (value) => console.log('Search:', value),
  },
};
