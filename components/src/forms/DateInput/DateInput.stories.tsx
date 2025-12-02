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

export const MonthPickerMode: Story = {
  render: (args) => <DateInputWrapper {...args} />,
  args: {
    value: new Date('2024-01-01'),
    label: 'Måned',
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

export const ErrorState: Story = {
  render: (args) => <DateInputWrapper {...args} />,
  args: {
    value: undefined,
    label: 'Dato',
    placeholder: 'dd.MM.yyyy',
    error: 'Ugyldig dato',
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
