/**
 * WizardProgressBar Component
 *
 * Visual step indicator for the onboarding wizard.
 * Shows 4 steps with clickable completed steps for back navigation.
 *
 * Design: Nordic Minimal with Cormorant Garamond typography
 */

import { WizardStep } from './types';
import './WizardProgressBar.css';

interface StepConfig {
  number: WizardStep;
  label: string;
}

const STEPS: StepConfig[] = [
  { number: 1, label: 'Bruker' },
  { number: 2, label: 'Sparing' },
  { number: 3, label: 'Gjeld' },
  { number: 4, label: 'Pensjon' },
];

interface WizardProgressBarProps {
  /** Current active step */
  currentStep: WizardStep;
  /** Callback when user clicks a completed step to go back */
  onStepClick: (step: WizardStep) => void;
}

export function WizardProgressBar({ currentStep, onStepClick }: WizardProgressBarProps) {
  const handleStepClick = (step: WizardStep) => {
    // Only allow clicking on completed steps (steps before current)
    if (step < currentStep) {
      onStepClick(step);
    }
  };

  return (
    <div className="wizard-progress">
      <div className="wizard-progress__track">
        {STEPS.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isClickable = isCompleted;

          return (
            <div key={step.number} className="wizard-progress__step-wrapper">
              {/* Connector line (not for first step) */}
              {index > 0 && (
                <div
                  className={`wizard-progress__connector ${
                    step.number <= currentStep ? 'wizard-progress__connector--active' : ''
                  }`}
                />
              )}

              {/* Step circle */}
              <button
                type="button"
                className={`wizard-progress__step ${
                  isCompleted ? 'wizard-progress__step--completed' : ''
                } ${isCurrent ? 'wizard-progress__step--current' : ''} ${
                  isClickable ? 'wizard-progress__step--clickable' : ''
                }`}
                onClick={() => handleStepClick(step.number)}
                disabled={!isClickable}
                aria-label={`${step.label} ${isCompleted ? '(fullført)' : isCurrent ? '(nåværende)' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? (
                  <i className="wizard-progress__check">check</i>
                ) : (
                  <span className="wizard-progress__number">{step.number}</span>
                )}
              </button>

              {/* Step label */}
              <span
                className={`wizard-progress__label ${
                  isCurrent || isCompleted ? 'wizard-progress__label--active' : ''
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
