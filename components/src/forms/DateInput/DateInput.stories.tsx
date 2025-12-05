import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DateInput } from './DateInput';

const meta = {
  title: 'Forms/DateInput',
  component: DateInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    monthPicker: { control: 'boolean' },
  },
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to manage state
function DateInputWrapper(props: React.ComponentProps<typeof DateInput>) {
  const [value, setValue] = useState(props.value);

  return <DateInput {...props} value={value} onChange={setValue} />;
}

export const Default: Story = {
  render: (args) => <DateInputWrapper {...args} />,
  args: {
    value: undefined,
    label: 'Dato',
    placeholder: 'dd.MM.yyyy',
  },
};

export const WithValue: Story = {
  render: (args) => <DateInputWrapper {...args} />,
  args: {
    value: new Date('2024-01-01'),
    label: 'Dato',
    placeholder: 'dd.MM.yyyy',
  },
};

export const NorwegianFormat: Story = {
  render: (args) => <DateInputWrapper {...args} />,
  args: {
    value: new Date('2024-12-15'),
    label: 'Dato (dd.MM.yyyy)',
    placeholder: 'dd.MM.yyyy',
  },
  parameters: {
    docs: { description: { story: 'Demonstrates Norwegian date formatting (dd.MM.yyyy)' } },
  },
};

export const MonthPickerMode: Story = {
  render: (args) => <DateInputWrapper {...args} />,
  args: {
    value: new Date('2024-01-01'),
    label: 'Måned',
    placeholder: 'dd.MM.yyyy',
    monthPicker: true,
  },
};

export const MonthPickerEmpty: Story = {
  render: (args) => <DateInputWrapper {...args} />,
  args: {
    value: undefined,
    label: 'Velg måned',
    placeholder: 'dd.MM.yyyy',
    monthPicker: true,
  },
};

export const Disabled: Story = {
  render: (args) => <DateInputWrapper {...args} />,
  args: {
    value: new Date('2024-12-01'),
    label: 'Dato',
    placeholder: 'dd.MM.yyyy',
    disabled: true,
  },
};

export const DisabledEmpty: Story = {
  render: (args) => <DateInputWrapper {...args} />,
  args: {
    value: undefined,
    label: 'Dato',
    placeholder: 'dd.MM.yyyy',
    disabled: true,
  },
};

export const ErrorState: Story = {
  render: (args) => <DateInputWrapper {...args} />,
  args: {
    value: undefined,
    label: 'Dato',
    placeholder: 'dd.MM.yyyy',
    error: 'Ugyldig dato',
  },
};

export const ErrorWithValue: Story = {
  render: (args) => <DateInputWrapper {...args} />,
  args: {
    value: new Date('2020-01-01'),
    label: 'Dato',
    placeholder: 'dd.MM.yyyy',
    error: 'Dato må være i fremtiden',
  },
};

export const Required: Story = {
  render: (args) => <DateInputWrapper {...args} />,
  args: {
    value: undefined,
    label: 'Dato',
    placeholder: 'dd.MM.yyyy',
    required: true,
  },
};

export const RequiredError: Story = {
  render: (args) => <DateInputWrapper {...args} />,
  args: {
    value: undefined,
    label: 'Dato',
    placeholder: 'dd.MM.yyyy',
    required: true,
    error: 'Dette feltet er påkrevd',
  },
};

export const WithoutLabel: Story = {
  render: (args) => <DateInputWrapper {...args} />,
  args: {
    value: undefined,
    placeholder: 'Velg dato',
  },
};

export const CurrentDate: Story = {
  render: (args) => <DateInputWrapper {...args} />,
  args: {
    value: new Date(),
    label: 'I dag',
  },
};

export const SnapshotDate: Story = {
  render: (args) => <DateInputWrapper {...args} />,
  args: {
    value: new Date('2024-01-31'),
    label: 'Snapshot-dato',
    placeholder: 'dd.MM.yyyy',
  },
};
