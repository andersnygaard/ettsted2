import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Forms/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 300, step: 1 } },
    variant: { control: 'select', options: ['default', 'gold', 'blue'] },
    height: { control: { type: 'range', min: 4, max: 20, step: 1 } },
    leftLabel: { control: 'text' },
    rightLabel: { control: 'text' },
    animate: { control: 'boolean' },
    delay: { control: { type: 'number', min: 0, max: 1000, step: 50 } },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
    variant: 'default',
    height: 8,
  },
};

export const DefaultWithLabels: Story = {
  args: {
    value: 50,
    variant: 'default',
    height: 8,
    leftLabel: 'Spareprogress',
    rightLabel: '500 000 kr',
  },
};

export const Gold: Story = {
  args: {
    value: 75,
    variant: 'gold',
    height: 8,
  },
};

export const GoldWithLabels: Story = {
  args: {
    value: 75,
    variant: 'gold',
    height: 8,
    leftLabel: 'Milestone: 1M kr',
    rightLabel: '75%',
  },
};

export const Blue: Story = {
  args: {
    value: 30,
    variant: 'blue',
    height: 8,
  },
};

export const BlueWithLabels: Story = {
  args: {
    value: 30,
    variant: 'blue',
    height: 8,
    leftLabel: 'Gjeldsdekning',
    rightLabel: '30%',
  },
};

export const EmptyProgress: Story = {
  args: {
    value: 0,
    variant: 'default',
    height: 8,
    leftLabel: 'Spareprogress',
    rightLabel: '0 kr',
  },
};

export const HalfProgress: Story = {
  args: {
    value: 50,
    variant: 'default',
    height: 8,
    leftLabel: 'F.I.R.E. mål',
    rightLabel: '50%',
  },
};

export const FullProgress: Story = {
  args: {
    value: 100,
    variant: 'default',
    height: 8,
    leftLabel: 'Nådd målsetning',
    rightLabel: '100%',
  },
};

export const OverfilledProgress: Story = {
  args: {
    value: 212.5,
    variant: 'default',
    height: 8,
    leftLabel: 'Dekning',
    rightLabel: '212.5%',
  },
  parameters: {
    docs: { description: { story: 'Progress can exceed 100% for values like debt coverage (savings/debt)' } },
  },
};

export const TallProgressBar: Story = {
  args: {
    value: 65,
    variant: 'default',
    height: 12,
    leftLabel: 'Dekning',
    rightLabel: '65%',
  },
};

export const HighProgress: Story = {
  args: {
    value: 97,
    variant: 'gold',
    height: 8,
    leftLabel: 'Nesten der!',
    rightLabel: '97%',
  },
};

export const WithoutLabels: Story = {
  args: {
    value: 60,
    variant: 'default',
    height: 8,
  },
};

export const SmallHeight: Story = {
  args: {
    value: 45,
    variant: 'default',
    height: 4,
    leftLabel: 'Progress',
    rightLabel: '45%',
  },
};

export const LargeHeight: Story = {
  args: {
    value: 80,
    variant: 'gold',
    height: 16,
    leftLabel: 'Major milestone',
    rightLabel: '80%',
  },
};

export const NorwegianLabels: Story = {
  args: {
    value: 42.3,
    variant: 'default',
    height: 8,
    leftLabel: 'Sparerate',
    rightLabel: '42,3 %',
  },
  parameters: {
    docs: { description: { story: 'Demonstrates Norwegian number formatting in labels' } },
  },
};

export const AnimatedProgress: Story = {
  args: {
    value: 65,
    variant: 'gold',
    height: 8,
    leftLabel: 'Animation demo',
    rightLabel: '65%',
    animate: true,
  },
  parameters: {
    docs: { description: { story: 'Progress bar animates from 0% to target width on mount (600ms ease-out)' } },
  },
};

export const AnimatedWithDelay: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '300px' }}>
      <ProgressBar value={30} variant="default" height={8} leftLabel="First" rightLabel="30%" animate delay={0} />
      <ProgressBar value={50} variant="default" height={8} leftLabel="Second" rightLabel="50%" animate delay={100} />
      <ProgressBar value={75} variant="default" height={8} leftLabel="Third" rightLabel="75%" animate delay={200} />
      <ProgressBar value={90} variant="default" height={8} leftLabel="Fourth" rightLabel="90%" animate delay={300} />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Multiple progress bars with staggered animations using delay prop for sequential fill effect' } },
  },
};

export const NoAnimation: Story = {
  args: {
    value: 75,
    variant: 'default',
    height: 8,
    leftLabel: 'Static progress',
    rightLabel: '75%',
    animate: false,
  },
  parameters: {
    docs: { description: { story: 'Progress bar renders at final width immediately without animation' } },
  },
};
