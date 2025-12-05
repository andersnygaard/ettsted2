import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './PageHeader';

const meta: Meta<typeof PageHeader> = {
  title: 'Layout/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'bone' },
  },
  argTypes: {
    title: {
      description: 'Page title displayed as h1',
      control: 'text',
    },
    subtitle: {
      description: 'Optional description below title',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: 'Kalkulatorer',
    subtitle: 'Verktøy for å planlegge din økonomi',
  },
};

export const WithoutSubtitle: Story = {
  args: {
    title: 'Oversikt',
  },
};

export const LongSubtitle: Story = {
  args: {
    title: 'Portefølje',
    subtitle: 'Alle data samlet — klikk på gruppeoverskrifter for å utvide/kollapse',
  },
};
