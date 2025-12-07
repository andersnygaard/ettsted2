import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ReactNode } from 'react';
import { OnboardingWizard } from './OnboardingWizard';
import { AuthContext } from '../AuthContext';
import type { AuthContextType } from '../types';
import type { WizardStep } from './types';
import './OnboardingWizard.css';
import './steps/StepUser.css';
import './steps/StepAccounts.css';
import './steps/AccountsList.css';
import './WizardProgressBar.css';

/**
 * Mock auth context for Storybook
 */
const mockAuthContext: AuthContextType = {
  user: {
    id: 'user-123',
    nickname: 'testuser',
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    profile: {
      monthlySalary: 50000,
      annualExpenses: 300000,
      birthYear: 1990,
      plannedRetirementAge: 65,
      fireNumber: 7500000,
    },
    accounts: [],
  },
  isLoading: false,
  isAuthenticated: true,
  hasEasyAuthSession: false,
  needsOnboarding: false,
  login: () => Promise.resolve(),
  demoLogin: () => Promise.resolve(),
  logout: () => {},
  refreshUser: () => Promise.resolve(),
};

/**
 * Wrapper component that provides QueryClient and Router
 */
interface ProvidersWrapperProps {
  children: ReactNode;
  authContext?: AuthContextType;
}

function ProvidersWrapper({ children, authContext = mockAuthContext }: ProvidersWrapperProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          {children}
        </AuthContext.Provider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

/**
 * Storybook Meta for OnboardingWizard
 */
const meta: Meta<typeof OnboardingWizard> = {
  title: 'Features/Auth/OnboardingWizard',
  component: OnboardingWizard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'OnboardingWizard is a 4-step wizard for user onboarding and settings editing. Supports both "create" mode (new users) and "edit" mode (existing users updating their profile).',
      },
    },
  },
  argTypes: {
    mode: {
      control: 'radio',
      options: ['create', 'edit'],
      description: 'Wizard mode: "create" for new users, "edit" for existing users',
    },
    onComplete: {
      action: 'completed',
      description: 'Callback when wizard completes successfully',
    },
  },
  decorators: [
    (Story) => (
      <ProvidersWrapper>
        <Story />
      </ProvidersWrapper>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OnboardingWizard>;

/**
 * Step 1: User Info
 * Shows the initial form with nickname, salary, expenses, birth year, and retirement age
 */
export const Step1UserInfo: Story = {
  args: {
    mode: 'create',
  },
  parameters: {
    docs: {
      description: {
        story: 'Step 1 displays user info collection: nickname, monthly salary, annual expenses, birth year, and planned retirement age.',
      },
    },
  },
};

/**
 * Step 2: Savings Accounts
 * Shows account management for savings (sparing) category
 */
export const Step2Sparing: Story = {
  args: {
    mode: 'create',
    initialState: {
      currentStep: 2 as WizardStep,
      userInfo: { nickname: 'testuser' },
      profile: {
        monthlySalary: 50000,
        annualExpenses: 300000,
        birthYear: 1990,
        plannedRetirementAge: 65,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Step 2 displays savings account management. Includes default accounts like Aksjer, Fond, Bankkonto, and Krypto (inactive).',
      },
    },
  },
};

/**
 * Step 3: Debt Accounts
 * Shows account management for debt (gjeld) category with loan details
 */
export const Step3Gjeld: Story = {
  args: {
    mode: 'create',
    initialState: {
      currentStep: 3 as WizardStep,
      userInfo: { nickname: 'testuser' },
      profile: {
        monthlySalary: 50000,
        annualExpenses: 300000,
        birthYear: 1990,
        plannedRetirementAge: 65,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Step 3 displays debt account management. Includes loan details (interest rate, remaining years). Default accounts: Boliglån (mortgage) and Studielån (student loan).',
      },
    },
  },
};

/**
 * Step 4: Pension Accounts
 * Shows account management for pension (pensjon) category
 */
export const Step4Pensjon: Story = {
  args: {
    mode: 'create',
    initialState: {
      currentStep: 4 as WizardStep,
      userInfo: { nickname: 'testuser' },
      profile: {
        monthlySalary: 50000,
        annualExpenses: 300000,
        birthYear: 1990,
        plannedRetirementAge: 65,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Step 4 displays pension account management. Default accounts: Arbeidsgiver (OTP), Folketrygden (NAV), and IPS (inactive).',
      },
    },
  },
};

/**
 * Create Mode
 * Wizard in create mode for new users (empty state)
 */
export const CreateMode: Story = {
  args: {
    mode: 'create',
  },
  parameters: {
    docs: {
      description: {
        story: 'Create mode is used for new user onboarding. All fields start empty or with sensible defaults.',
      },
    },
  },
};

/**
 * Edit Mode - Pre-populated Data
 * Wizard in edit mode with existing user data
 */
export const EditMode: Story = {
  args: {
    mode: 'edit',
    initialState: {
      currentStep: 1 as WizardStep,
      userInfo: {
        nickname: 'johndoe',
      },
      profile: {
        monthlySalary: 60000,
        annualExpenses: 360000,
        birthYear: 1985,
        plannedRetirementAge: 62,
        fireNumber: 9000000,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Edit mode is used when existing users update their profile and accounts. All fields are pre-populated with current data.',
      },
    },
  },
};

/**
 * Validation Error - Nickname
 * Step 1 with validation error for invalid nickname
 */
export const ValidationErrorNickname: Story = {
  args: {
    mode: 'create',
    initialState: {
      currentStep: 1 as WizardStep,
      userInfo: {
        nickname: 'ab', // Too short (min 3 chars)
      },
      profile: {
        monthlySalary: 50000,
        annualExpenses: 300000,
        birthYear: 1990,
        plannedRetirementAge: 65,
      },
      errors: {
        nickname: 'Brukernavn må være 3-20 tegn (bokstaver, tall, understrek)',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates validation error for nickname. Username must be 3-20 characters with alphanumeric characters and underscores only.',
      },
    },
  },
};

/**
 * Validation Error - Birth Year
 * Step 1 with validation error for invalid birth year
 */
export const ValidationErrorBirthYear: Story = {
  args: {
    mode: 'create',
    initialState: {
      currentStep: 1 as WizardStep,
      userInfo: {
        nickname: 'validuser',
      },
      profile: {
        monthlySalary: 50000,
        annualExpenses: 300000,
        birthYear: 2030, // Invalid - future year
        plannedRetirementAge: 65,
      },
      errors: {
        'profile.birthYear': 'Fødselsår må være mellom 1900 og 2025',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates validation error for birth year. Birth year must be between 1900 and current year.',
      },
    },
  },
};

/**
 * Validation Error - Missing Account
 * Step 2 with error showing at least one account is required
 */
export const ValidationErrorMissingAccount: Story = {
  args: {
    mode: 'create',
    initialState: {
      currentStep: 2 as WizardStep,
      userInfo: { nickname: 'testuser' },
      profile: {
        monthlySalary: 50000,
        annualExpenses: 300000,
        birthYear: 1990,
        plannedRetirementAge: 65,
      },
      accounts: {
        sparing: [],
        gjeld: [],
        pensjon: [],
      },
      errors: {
        accounts: 'Minst én konto i kategorien "sparing" er påkrevd',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates validation error when no accounts exist in a category. At least one account is required for savings, debt, and pension.',
      },
    },
  },
};

/**
 * Validation Error - Loan Details
 * Step 3 with error showing invalid loan details
 */
export const ValidationErrorLoanDetails: Story = {
  args: {
    mode: 'create',
    initialState: {
      currentStep: 3 as WizardStep,
      userInfo: { nickname: 'testuser' },
      profile: {
        monthlySalary: 50000,
        annualExpenses: 300000,
        birthYear: 1990,
        plannedRetirementAge: 65,
      },
      errors: {
        'accounts[0].loanDetails.interestRate': 'Rente må være mellom 0 og 100%',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates validation error for loan details in debt accounts. Interest rate must be between 0 and 100%, remaining years between 0 and 50.',
      },
    },
  },
};

/**
 * Server Error
 * Shows error banner when server submission fails
 */
export const ServerError: Story = {
  args: {
    mode: 'create',
    initialState: {
      currentStep: 1 as WizardStep,
      userInfo: {
        nickname: 'testuser',
      },
      profile: {
        monthlySalary: 50000,
        annualExpenses: 300000,
        birthYear: 1990,
        plannedRetirementAge: 65,
      },
      submitError: 'Kunne ikke fullføre oppsett. Prøv igjen senere.',
      isSubmitting: false,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates error banner when server submission fails. The error message is displayed prominently above the navigation buttons.',
      },
    },
  },
};

/**
 * Loading State
 * Shows submit button in loading state
 */
export const LoadingState: Story = {
  args: {
    mode: 'create',
    initialState: {
      currentStep: 4 as WizardStep,
      userInfo: {
        nickname: 'testuser',
      },
      profile: {
        monthlySalary: 50000,
        annualExpenses: 300000,
        birthYear: 1990,
        plannedRetirementAge: 65,
      },
      isSubmitting: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates loading state on final step. Submit button shows spinner and "Lagrer..." text while submission is in progress.',
      },
    },
  },
};

/**
 * Completed State
 * Final step showing the submit button ready for submission
 */
export const CompletedState: Story = {
  args: {
    mode: 'create',
    initialState: {
      currentStep: 4 as WizardStep,
      userInfo: {
        nickname: 'testuser',
      },
      profile: {
        monthlySalary: 50000,
        annualExpenses: 300000,
        birthYear: 1990,
        plannedRetirementAge: 65,
        fireNumber: 7500000,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Final step showing all data collected. Submit button displays "Fullfør" (Complete) with checkmark icon.',
      },
    },
  },
};

/**
 * Full Workflow - Create
 * Interactive story showing complete onboarding workflow from step 1 to completion
 */
export const FullWorkflowCreate: Story = {
  args: {
    mode: 'create',
    onComplete: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story demonstrating full onboarding workflow. Users can navigate through all 4 steps, fill in data, and submit.',
      },
    },
  },
};

/**
 * Full Workflow - Edit
 * Interactive story showing complete edit workflow
 */
export const FullWorkflowEdit: Story = {
  args: {
    mode: 'edit',
    initialState: {
      currentStep: 1 as WizardStep,
      userInfo: {
        nickname: 'johndoe',
      },
      profile: {
        monthlySalary: 55000,
        annualExpenses: 330000,
        birthYear: 1987,
        plannedRetirementAge: 63,
        fireNumber: 8250000,
      },
    },
    onComplete: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story demonstrating edit workflow. Pre-populated with existing user data, allowing users to update their information.',
      },
    },
  },
};

/**
 * Multiple Accounts
 * Step 2 showing multiple savings accounts
 */
export const MultipleAccounts: Story = {
  args: {
    mode: 'create',
    initialState: {
      currentStep: 2 as WizardStep,
      userInfo: { nickname: 'testuser' },
      profile: {
        monthlySalary: 50000,
        annualExpenses: 300000,
        birthYear: 1990,
        plannedRetirementAge: 65,
      },
      accounts: {
        sparing: [
          { tempId: 'temp-1', name: 'Nordnet ASK', category: 'sparing', value: 250000, isActive: true },
          { tempId: 'temp-2', name: 'Fond', category: 'sparing', value: 150000, isActive: true },
          { tempId: 'temp-3', name: 'Bankkonto', category: 'sparing', value: 50000, isActive: true },
          { tempId: 'temp-4', name: 'Bitcoin', category: 'sparing', value: 25000, isActive: true },
        ],
        gjeld: [],
        pensjon: [],
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Step 2 showing multiple savings accounts with various values. Demonstrates how the wizard handles multiple account entries.',
      },
    },
  },
};

/**
 * Debt with Loan Details
 * Step 3 showing debt accounts with loan details populated
 */
export const DebtWithLoanDetails: Story = {
  args: {
    mode: 'edit',
    initialState: {
      currentStep: 3 as WizardStep,
      userInfo: { nickname: 'testuser' },
      profile: {
        monthlySalary: 50000,
        annualExpenses: 300000,
        birthYear: 1990,
        plannedRetirementAge: 65,
      },
      accounts: {
        sparing: [],
        gjeld: [
          {
            tempId: 'acc-mortgage',
            name: 'Boliglån',
            category: 'gjeld' as const,
            value: 2000000,
            isActive: true,
            loanDetails: { interestRate: 4.25, remainingYears: 20 },
          },
          {
            tempId: 'acc-student',
            name: 'Studielån',
            category: 'gjeld' as const,
            value: 150000,
            isActive: true,
            loanDetails: { interestRate: 2.75, remainingYears: 15 },
          },
        ],
        pensjon: [],
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Step 3 showing debt accounts with detailed loan information (interest rate, remaining years). Useful for financial projections.',
      },
    },
  },
};

/**
 * Inactive Accounts
 * Demonstrating wizard with some inactive accounts
 */
export const InactiveAccounts: Story = {
  args: {
    mode: 'edit',
    initialState: {
      currentStep: 2 as WizardStep,
      userInfo: { nickname: 'testuser' },
      profile: {
        monthlySalary: 50000,
        annualExpenses: 300000,
        birthYear: 1990,
        plannedRetirementAge: 65,
      },
      accounts: {
        sparing: [
          { tempId: 'temp-1', name: 'Aksjer', category: 'sparing', value: 100000, isActive: true },
          { tempId: 'temp-2', name: 'Krypto (retired)', category: 'sparing', value: 0, isActive: false },
        ],
        gjeld: [],
        pensjon: [],
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates inactive accounts in the wizard. Inactive accounts can be hidden from main UI but preserved in historical data.',
      },
    },
  },
};

/**
 * All Pension Types
 * Step 4 showing all pension account types
 */
export const AllPensionTypes: Story = {
  args: {
    mode: 'edit',
    initialState: {
      currentStep: 4 as WizardStep,
      userInfo: { nickname: 'testuser' },
      profile: {
        monthlySalary: 50000,
        annualExpenses: 300000,
        birthYear: 1990,
        plannedRetirementAge: 65,
      },
      accounts: {
        sparing: [],
        gjeld: [],
        pensjon: [
          {
            tempId: 'temp-1',
            name: 'Arbeidsgiver (OTP)',
            category: 'pensjon',
            value: 500000,
            isActive: true,
          },
          {
            tempId: 'temp-2',
            name: 'Folketrygden (NAV)',
            category: 'pensjon',
            value: 1200000,
            isActive: true,
          },
          {
            tempId: 'temp-3',
            name: 'IPS',
            category: 'pensjon',
            value: 300000,
            isActive: false,
          },
        ],
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Step 4 showing all pension account types: Arbeidsgiver (employer OTP), Folketrygden (social security), and IPS (individual pension savings).',
      },
    },
  },
};

/**
 * High Net Worth Example
 * Example with significant assets and custom F.I.R.E. number
 */
export const HighNetWorthExample: Story = {
  args: {
    mode: 'edit',
    initialState: {
      currentStep: 1 as WizardStep,
      userInfo: {
        nickname: 'kristian_millionaire',
      },
      profile: {
        monthlySalary: 150000,
        annualExpenses: 800000,
        birthYear: 1980,
        plannedRetirementAge: 55,
        fireNumber: 20000000, // Custom F.I.R.E. target
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing high net worth profile with significant income, expenses, and custom F.I.R.E. number (target wealth for financial independence).',
      },
    },
  },
};

/**
 * Minimal Example
 * Example with minimal data (student, early in career)
 */
export const MinimalExample: Story = {
  args: {
    mode: 'create',
    initialState: {
      currentStep: 1 as WizardStep,
      userInfo: {
        nickname: 'student_2025',
      },
      profile: {
        monthlySalary: 25000,
        annualExpenses: 180000,
        birthYear: 2005,
        plannedRetirementAge: 70,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing minimal data profile (student or early career): lower income, lower expenses, younger user, standard retirement age.',
      },
    },
  },
};
