/**
 * StepUser Component - Step 1 of Onboarding Wizard
 *
 * Collects:
 * - Nickname (username)
 * - Profile: Monthly salary, Annual expenses, Birth year, Retirement age, F.I.R.E. number
 */

import { NumberInput } from '@finans/components';
import { OnboardingUserInfo, OnboardingProfile } from '../types';
import './StepUser.css';

interface StepUserProps {
  /** User info state */
  userInfo: OnboardingUserInfo;
  /** Profile state */
  profile: OnboardingProfile;
  /** Validation errors */
  errors: Record<string, string>;
  /** Update user info */
  onUserInfoChange: (updates: Partial<OnboardingUserInfo>) => void;
  /** Update profile */
  onProfileChange: (updates: Partial<OnboardingProfile>) => void;
}

export function StepUser({
  userInfo,
  profile,
  errors,
  onUserInfoChange,
  onProfileChange,
}: StepUserProps) {
  const currentYear = new Date().getFullYear();

  // Calculate default fireNumber (25x annual expenses) for placeholder
  const defaultFireNumber = profile.annualExpenses > 0 ? profile.annualExpenses * 25 : undefined;

  return (
    <div className="step-user">
      <div className="step-user__header">
        <h2 className="step-user__title">Brukerinformasjon</h2>
        <p className="step-user__subtitle">
          Fortell oss litt om deg selv for å komme i gang
        </p>
      </div>

      <div className="step-user__form">
        {/* Nickname */}
        <div className="step-user__field">
          <label htmlFor="nickname" className="step-user__label">
            Brukernavn <span className="step-user__required">*</span>
          </label>
          <input
            type="text"
            id="nickname"
            className={`step-user__input ${errors.nickname ? 'step-user__input--error' : ''}`}
            value={userInfo.nickname}
            onChange={(e) => onUserInfoChange({ nickname: e.target.value })}
            placeholder="ditt_brukernavn"
            maxLength={20}
            aria-invalid={errors.nickname ? 'true' : 'false'}
            aria-describedby={errors.nickname ? 'nickname-error' : undefined}
          />
          {errors.nickname && (
            <span className="step-user__error" id="nickname-error" role="alert">
              {errors.nickname}
            </span>
          )}
          <span className="step-user__hint">3-20 tegn, bokstaver, tall og understrek</span>
        </div>

        <div className="step-user__divider" />

        {/* Profile Section */}
        <h3 className="step-user__section-title">Din økonomi</h3>

        {/* Monthly Salary */}
        <div className="step-user__field">
          <NumberInput
            label="Månedlig inntekt"
            value={profile.monthlySalary}
            onChange={(value) => onProfileChange({ monthlySalary: value ?? 0 })}
            suffix="kr"
            required
            error={errors['profile.monthlySalary']}
            name="monthlySalary"
          />
        </div>

        {/* Annual Expenses */}
        <div className="step-user__field">
          <NumberInput
            label="Årlige utgifter"
            value={profile.annualExpenses}
            onChange={(value) => onProfileChange({ annualExpenses: value ?? 0 })}
            suffix="kr"
            required
            error={errors['profile.annualExpenses']}
            name="annualExpenses"
          />
        </div>

        <div className="step-user__row">
          {/* Birth Year */}
          <div className="step-user__field step-user__field--half">
            <label htmlFor="birthYear" className="step-user__label">
              Fødselsår <span className="step-user__required">*</span>
            </label>
            <input
              type="number"
              id="birthYear"
              className={`step-user__input step-user__input--number ${
                errors['profile.birthYear'] ? 'step-user__input--error' : ''
              }`}
              value={profile.birthYear || ''}
              onChange={(e) => onProfileChange({ birthYear: parseInt(e.target.value, 10) || 0 })}
              min={1900}
              max={currentYear}
              placeholder={`${currentYear - 30}`}
              aria-invalid={errors['profile.birthYear'] ? 'true' : 'false'}
            />
            {errors['profile.birthYear'] && (
              <span className="step-user__error" role="alert">
                {errors['profile.birthYear']}
              </span>
            )}
            <span className="step-user__hint">
              Alder: {profile.birthYear ? currentYear - profile.birthYear : '—'} år
            </span>
          </div>

          {/* Planned Retirement Age */}
          <div className="step-user__field step-user__field--half">
            <label htmlFor="retirementAge" className="step-user__label">
              Pensjonsalder <span className="step-user__required">*</span>
            </label>
            <input
              type="number"
              id="retirementAge"
              className={`step-user__input step-user__input--number ${
                errors['profile.plannedRetirementAge'] ? 'step-user__input--error' : ''
              }`}
              value={profile.plannedRetirementAge || ''}
              onChange={(e) => onProfileChange({ plannedRetirementAge: parseInt(e.target.value, 10) || 0 })}
              min={30}
              max={100}
              placeholder="67"
              aria-invalid={errors['profile.plannedRetirementAge'] ? 'true' : 'false'}
            />
            {errors['profile.plannedRetirementAge'] && (
              <span className="step-user__error" role="alert">
                {errors['profile.plannedRetirementAge']}
              </span>
            )}
          </div>
        </div>

        {/* F.I.R.E. Number (optional) */}
        <div className="step-user__field">
          <NumberInput
            label="F.I.R.E. tall (valgfritt)"
            value={profile.fireNumber}
            onChange={(value) => onProfileChange({ fireNumber: value })}
            suffix="kr"
            placeholder={defaultFireNumber ? defaultFireNumber.toLocaleString('nb-NO') : '0'}
            error={errors['profile.fireNumber']}
            name="fireNumber"
          />
          <span className="step-user__hint">
            Standard: 25 × årlige utgifter
            {defaultFireNumber && ` = ${defaultFireNumber.toLocaleString('nb-NO')} kr`}
          </span>
        </div>
      </div>
    </div>
  );
}
