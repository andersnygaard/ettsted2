import type { Meta, StoryObj } from '@storybook/react';
import { TableFooter } from './TableFooter';

const meta = {
  title: 'Data/TableFooter',
  component: TableFooter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TableFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showing: 12,
    total: 24,
    unit: 'måneder',
    page: 1,
    totalPages: 2,
    onPageChange: (page) => console.log('Page changed:', page),
  },
};

export const WithColumnToggles: Story = {
  args: {
    showing: 12,
    total: 24,
    unit: 'måneder',
    columnToggles: [
      { id: 'nordnet', label: 'Nordnet', visible: true },
      { id: 'bouvet', label: 'Bouvet', visible: true },
      { id: 'yolo', label: 'Yolo', visible: false },
      { id: 'firi', label: 'Firi', visible: true },
    ],
    onToggleColumn: (id) => console.log('Toggle column:', id),
    page: 1,
    totalPages: 2,
    onPageChange: (page) => console.log('Page changed:', page),
  },
};

export const ManyPages: Story = {
  args: {
    showing: 10,
    total: 100,
    unit: 'transaksjoner',
    page: 5,
    totalPages: 10,
    onPageChange: (page) => console.log('Page changed:', page),
  },
};

export const FirstPage: Story = {
  args: {
    showing: 12,
    total: 36,
    unit: 'måneder',
    page: 1,
    totalPages: 3,
    onPageChange: (page) => console.log('Page changed:', page),
  },
};

export const LastPage: Story = {
  args: {
    showing: 12,
    total: 36,
    unit: 'måneder',
    page: 3,
    totalPages: 3,
    onPageChange: (page) => console.log('Page changed:', page),
  },
};

export const SinglePage: Story = {
  args: {
    showing: 10,
    total: 10,
    unit: 'måneder',
    page: 1,
    totalPages: 1,
    onPageChange: (page) => console.log('Page changed:', page),
  },
};

export const CustomUnit: Story = {
  args: {
    showing: 5,
    total: 20,
    unit: 'rader',
    page: 2,
    totalPages: 4,
    onPageChange: (page) => console.log('Page changed:', page),
  },
};
