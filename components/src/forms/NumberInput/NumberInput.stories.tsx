import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { NumberInput } from './NumberInput';

const meta = {
  title: 'Forms/NumberInput',
  component: NumberInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'number' },
    label: { control: 'text' },
    suffix: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to manage state
function NumberInputWrapper(props: React.ComponentProps<typeof NumberInput>) {
  const [value, setValue] = useState(props.value);

  return <NumberInput {...props} value={value} onChange={setValue} />;
}

export const Empty: Story = {
  render: (args) => <NumberInputWrapper {...args} />,
  args: {
    value: undefined,
    label: 'Beløp',
    placeholder: '0',
    suffix: 'kr',
  },
};

export const WithValue: Story = {
  render: (args) => <NumberInputWrapper {...args} />,
  args: {
    value: 123456.78,
    label: 'Beløp',
    placeholder: '0',
    suffix: 'kr',
  },
};

export const NorwegianFormatting: Story = {
  render: (args) => <NumberInputWrapper {...args} />,
  args: {
    value: 1234567.89,
    label: 'Porteføljeverdi',
    placeholder: '0',
    suffix: 'kr',
  },
  parameters: {
    docs: { description: { story: 'Demonstrates Norwegian number formatting with space as thousands separator and comma as decimal' } },
  },
};

export const WithSuffix: Story = {
  render: (args) => <NumberInputWrapper {...args} />,
  args: {
    value: 50000,
    label: 'Årlig inntekt',
    suffix: 'kr',
  },
};

export const Disabled: Story = {
  render: (args) => <NumberInputWrapper {...args} />,
  args: {
    value: 100000,
    label: 'Beløp',
    suffix: 'kr',
    disabled: true,
  },
};

export const DisabledEmpty: Story = {
  render: (args) => <NumberInputWrapper {...args} />,
  args: {
    value: undefined,
    label: 'Beløp',
    suffix: 'kr',
    disabled: true,
  },
};

export const ErrorState: Story = {
  render: (args) => <NumberInputWrapper {...args} />,
  args: {
    value: undefined,
    label: 'Beløp',
    suffix: 'kr',
    error: 'Må være større enn 0',
  },
};

export const ErrorWithValue: Story = {
  render: (args) => <NumberInputWrapper {...args} />,
  args: {
    value: -50000,
    label: 'Beløp',
    suffix: 'kr',
    error: 'Kan ikke være negativt',
  },
};

export const Required: Story = {
  render: (args) => <NumberInputWrapper {...args} />,
  args: {
    value: undefined,
    label: 'Beløp',
    suffix: 'kr',
    required: true,
  },
};

export const LargeNumber: Story = {
  render: (args) => <NumberInputWrapper {...args} />,
  args: {
    value: 1234567.89,
    label: 'Portefølje verdi',
    suffix: 'kr',
  },
};

export const WithoutLabel: Story = {
  render: (args) => <NumberInputWrapper {...args} />,
  args: {
    value: undefined,
    placeholder: 'Skriv beløp',
    suffix: 'kr',
  },
};

export const NoSuffix: Story = {
  render: (args) => <NumberInputWrapper {...args} />,
  args: {
    value: 123456,
    label: 'Prosent',
    suffix: '%',
  },
};

export const RequiredError: Story = {
  render: (args) => <NumberInputWrapper {...args} />,
  args: {
    value: undefined,
    label: 'Beløp',
    suffix: 'kr',
    required: true,
    error: 'Dette feltet er påkrevd',
  },
};
