/**
 * OnboardingWizard Component
 *
 * Main orchestrator for the 4-step onboarding wizard.
 * Manages state with useReducer and handles navigation, validation, and submission.
 */

import { useReducer, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import apiClient from '@/shared/api/client';
import { WizardProgressBar } from './WizardProgressBar';
import { StepUser } from './steps/StepUser';
import { StepSparing } from './steps/StepSparing';
import { StepGjeld } from './steps/StepGjeld';
import { StepPensjon } from './steps/StepPensjon';
import {
  OnboardingState,
  OnboardingAction,
  WizardStep,
  Category,
  OnboardingAccount,
  OnboardingRequestBody,
  OnboardingResponse,
} from './types';
import {
  getDefaultAccounts,
  getDefaultProfile,
  getDefaultUserInfo,
  createNewAccount,
} from './defaultAccounts';
import './OnboardingWizard.css';

// ============================================================================
// INITIAL STATE
// ============================================================================

function getInitialState(): OnboardingState {
  return {
    currentStep: 1,
    userInfo: getDefaultUserInfo(),
    profile: getDefaultProfile(),
    accounts: getDefaultAccounts(),
    errors: {},
    isSubmitting: false,
    submitError: null,
  };
}

// ============================================================================
// REDUCER
// ============================================================================

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step, errors: {}, submitError: null };

    case 'UPDATE_USER_INFO':
      return { ...state, userInfo: { ...state.userInfo, ...action.payload } };

    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };

    case 'ADD_ACCOUNT': {
      const newAccount = createNewAccount(action.category);
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [action.category]: [...state.accounts[action.category], newAccount],
        },
      };
    }

    case 'UPDATE_ACCOUNT': {
      const accounts = state.accounts[action.category].map((acc) =>
        acc.tempId === action.tempId ? { ...acc, ...action.updates } : acc
      );
      return {
        ...state,
        accounts: { ...state.accounts, [action.category]: accounts },
      };
    }

    case 'REMOVE_ACCOUNT': {
      const accounts = state.accounts[action.category].filter(
        (acc) => acc.tempId !== action.tempId
      );
      return {
        ...state,
        accounts: { ...state.accounts, [action.category]: accounts },
      };
    }

    case 'SET_ERRORS':
      return { ...state, errors: action.errors };

    case 'CLEAR_ERRORS':
      return { ...state, errors: {} };

    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.value };

    case 'SET_SUBMIT_ERROR':
      return { ...state, submitError: action.error };

    case 'RESET':
      return getInitialState();

    default:
      return state;
  }
}

// ============================================================================
// VALIDATION
// ============================================================================

const NICKNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

function validateStep1(state: OnboardingState): Record<string, string> {
  const errors: Record<string, string> = {};
  const currentYear = new Date().getFullYear();

  // Nickname
  if (!state.userInfo.nickname) {
    errors.nickname = 'Brukernavn er påkrevd';
  } else if (!NICKNAME_REGEX.test(state.userInfo.nickname)) {
    errors.nickname = 'Brukernavn må være 3-20 tegn (bokstaver, tall, understrek)';
  }

  // Monthly salary
  if (state.profile.monthlySalary < 0) {
    errors['profile.monthlySalary'] = 'Månedlig inntekt kan ikke være negativ';
  }

  // Annual expenses
  if (state.profile.annualExpenses < 0) {
    errors['profile.annualExpenses'] = 'Årlige utgifter kan ikke være negative';
  }

  // Birth year
  if (!state.profile.birthYear) {
    errors['profile.birthYear'] = 'Fødselsår er påkrevd';
  } else if (state.profile.birthYear < 1900 || state.profile.birthYear > currentYear) {
    errors['profile.birthYear'] = `Fødselsår må være mellom 1900 og ${currentYear}`;
  }

  // Retirement age
  if (!state.profile.plannedRetirementAge) {
    errors['profile.plannedRetirementAge'] = 'Pensjonsalder er påkrevd';
  } else if (state.profile.plannedRetirementAge < 30 || state.profile.plannedRetirementAge > 100) {
    errors['profile.plannedRetirementAge'] = 'Pensjonsalder må være mellom 30 og 100';
  }

  // Fire number (optional, but if provided must be positive)
  if (state.profile.fireNumber !== undefined && state.profile.fireNumber <= 0) {
    errors['profile.fireNumber'] = 'F.I.R.E. tall må være større enn 0';
  }

  return errors;
}

function validateAccountsStep(accounts: OnboardingAccount[], category: Category): Record<string, string> {
  const errors: Record<string, string> = {};

  accounts.forEach((account, index) => {
    const prefix = `accounts[${index}]`;

    // Name
    if (!account.name || account.name.trim() === '') {
      errors[`${prefix}.name`] = 'Kontonavn er påkrevd';
    } else if (account.name.length > 50) {
      errors[`${prefix}.name`] = 'Kontonavn kan ikke være mer enn 50 tegn';
    }

    // Value
    if (account.value < 0) {
      errors[`${prefix}.value`] = 'Verdi kan ikke være negativ';
    }

    // Loan details for gjeld
    if (category === 'gjeld') {
      if (!account.loanDetails) {
        errors[`${prefix}.loanDetails`] = 'Lånedetaljer er påkrevd for gjeld';
      } else {
        if (account.loanDetails.interestRate < 0 || account.loanDetails.interestRate > 100) {
          errors[`${prefix}.loanDetails.interestRate`] = 'Rente må være mellom 0 og 100%';
        }
        if (account.loanDetails.remainingYears < 0 || account.loanDetails.remainingYears > 50) {
          errors[`${prefix}.loanDetails.remainingYears`] = 'Gjenstående år må være mellom 0 og 50';
        }
      }
    }
  });

  // Must have at least one account
  if (accounts.length === 0) {
    errors.accounts = `Minst én konto i kategorien "${category}" er påkrevd`;
  }

  return errors;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function OnboardingWizard() {
  const [state, dispatch] = useReducer(onboardingReducer, getInitialState());
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  // API mutation for submitting onboarding
  const submitMutation = useMutation<OnboardingResponse, Error, OnboardingRequestBody>({
    mutationFn: async (data) => {
      const response = await apiClient.post<OnboardingResponse>('/users/me/onboarding', data);
      return response.data;
    },
    onSuccess: async () => {
      await refreshUser();
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Kunne ikke fullføre oppsett';
      dispatch({ type: 'SET_SUBMIT_ERROR', error: message });
      dispatch({ type: 'SET_SUBMITTING', value: false });
    },
  });

  // Navigate to a step
  const goToStep = useCallback((step: WizardStep) => {
    dispatch({ type: 'SET_STEP', step });
  }, []);

  // Validate current step and return whether it's valid
  const validateCurrentStep = useCallback((): boolean => {
    let errors: Record<string, string> = {};

    switch (state.currentStep) {
      case 1:
        errors = validateStep1(state);
        break;
      case 2:
        errors = validateAccountsStep(state.accounts.sparing, 'sparing');
        break;
      case 3:
        errors = validateAccountsStep(state.accounts.gjeld, 'gjeld');
        break;
      case 4:
        errors = validateAccountsStep(state.accounts.pensjon, 'pensjon');
        break;
    }

    dispatch({ type: 'SET_ERRORS', errors });
    return Object.keys(errors).length === 0;
  }, [state]);

  // Handle next button click
  const handleNext = useCallback(() => {
    if (!validateCurrentStep()) {
      return;
    }

    if (state.currentStep < 4) {
      dispatch({ type: 'SET_STEP', step: (state.currentStep + 1) as WizardStep });
    } else {
      // Final step - submit
      handleSubmit();
    }
  }, [state.currentStep, validateCurrentStep]);

  // Handle back button click
  const handleBack = useCallback(() => {
    if (state.currentStep > 1) {
      dispatch({ type: 'SET_STEP', step: (state.currentStep - 1) as WizardStep });
    }
  }, [state.currentStep]);

  // Submit the onboarding data
  const handleSubmit = useCallback(() => {
    dispatch({ type: 'SET_SUBMITTING', value: true });
    dispatch({ type: 'SET_SUBMIT_ERROR', error: null });

    // Build all accounts into a single array
    const allAccounts = [
      ...state.accounts.sparing.map((acc) => ({
        name: acc.name,
        category: 'sparing' as Category,
        value: acc.value,
        isActive: acc.isActive,
      })),
      ...state.accounts.gjeld.map((acc) => ({
        name: acc.name,
        category: 'gjeld' as Category,
        value: acc.value,
        isActive: acc.isActive,
        loanDetails: acc.loanDetails,
      })),
      ...state.accounts.pensjon.map((acc) => ({
        name: acc.name,
        category: 'pensjon' as Category,
        value: acc.value,
        isActive: acc.isActive,
      })),
    ];

    const requestBody: OnboardingRequestBody = {
      nickname: state.userInfo.nickname,
      profile: {
        monthlySalary: state.profile.monthlySalary,
        annualExpenses: state.profile.annualExpenses,
        birthYear: state.profile.birthYear,
        plannedRetirementAge: state.profile.plannedRetirementAge,
        ...(state.profile.fireNumber ? { fireNumber: state.profile.fireNumber } : {}),
      },
      accounts: allAccounts,
    };

    submitMutation.mutate(requestBody);
  }, [state, submitMutation]);

  // Account handlers for each category
  const createAccountHandlers = (category: Category) => ({
    onUpdateAccount: (tempId: string, updates: Partial<OnboardingAccount>) => {
      dispatch({ type: 'UPDATE_ACCOUNT', category, tempId, updates });
    },
    onRemoveAccount: (tempId: string) => {
      dispatch({ type: 'REMOVE_ACCOUNT', category, tempId });
    },
    onAddAccount: () => {
      dispatch({ type: 'ADD_ACCOUNT', category });
    },
  });

  // Render current step content
  const renderStepContent = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <StepUser
            userInfo={state.userInfo}
            profile={state.profile}
            errors={state.errors}
            onUserInfoChange={(updates) => dispatch({ type: 'UPDATE_USER_INFO', payload: updates })}
            onProfileChange={(updates) => dispatch({ type: 'UPDATE_PROFILE', payload: updates })}
          />
        );
      case 2:
        return (
          <StepSparing
            accounts={state.accounts.sparing}
            errors={state.errors}
            {...createAccountHandlers('sparing')}
          />
        );
      case 3:
        return (
          <StepGjeld
            accounts={state.accounts.gjeld}
            errors={state.errors}
            {...createAccountHandlers('gjeld')}
          />
        );
      case 4:
        return (
          <StepPensjon
            accounts={state.accounts.pensjon}
            errors={state.errors}
            {...createAccountHandlers('pensjon')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-wizard">
      <WizardProgressBar
        currentStep={state.currentStep}
        onStepClick={goToStep}
      />

      <div className="onboarding-wizard__content">
        {renderStepContent()}
      </div>

      {/* Error Banner */}
      {state.submitError && (
        <div className="onboarding-wizard__error-banner" role="alert">
          <i>error</i>
          <span>{state.submitError}</span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="onboarding-wizard__nav">
        {state.currentStep > 1 && (
          <button
            type="button"
            className="onboarding-wizard__btn onboarding-wizard__btn--secondary"
            onClick={handleBack}
            disabled={state.isSubmitting}
          >
            <i>arrow_back</i>
            <span>Tilbake</span>
          </button>
        )}

        <button
          type="button"
          className="onboarding-wizard__btn onboarding-wizard__btn--primary"
          onClick={handleNext}
          disabled={state.isSubmitting}
        >
          {state.isSubmitting ? (
            <>
              <span className="onboarding-wizard__spinner" />
              <span>Lagrer...</span>
            </>
          ) : state.currentStep === 4 ? (
            <>
              <i>check</i>
              <span>Fullfør</span>
            </>
          ) : (
            <>
              <span>Neste</span>
              <i>arrow_forward</i>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
