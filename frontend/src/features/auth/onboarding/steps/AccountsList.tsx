/**
 * AccountsList Component
 *
 * Reusable list of accounts for onboarding steps.
 * Displays accounts with name, value, and optional loan details.
 * Shows category total at the bottom.
 */

import { NumberInput, formatNumber, Icon } from '@finans/components';
import { OnboardingAccount, Category } from '../types';
import './AccountsList.css';

interface AccountsListProps {
  /** Category being edited */
  category: Category;
  /** List of accounts */
  accounts: OnboardingAccount[];
  /** Validation errors */
  errors: Record<string, string>;
  /** Update an account */
  onUpdateAccount: (tempId: string, updates: Partial<OnboardingAccount>) => void;
  /** Remove an account */
  onRemoveAccount: (tempId: string) => void;
  /** Add a new account */
  onAddAccount: () => void;
  /** Whether this is the gjeld category (shows loan details) */
  showLoanDetails?: boolean;
}

export function AccountsList({
  category,
  accounts,
  errors,
  onUpdateAccount,
  onRemoveAccount,
  onAddAccount,
  showLoanDetails = false,
}: AccountsListProps) {
  // Calculate category total
  const total = accounts.reduce((sum, acc) => sum + (acc.value || 0), 0);

  // Check if we can delete accounts (must have at least 1)
  const canDelete = accounts.length > 1;

  // Get error key prefix for this account index
  const getErrorKey = (index: number, field: string) => `accounts[${index}].${field}`;

  // Find account index by tempId (for error lookup)
  const getAccountIndex = (tempId: string) => accounts.findIndex(a => a.tempId === tempId);

  return (
    <div className="accounts-list">
      <div className="accounts-list__items">
        {accounts.map((account) => {
          const index = getAccountIndex(account.tempId);
          const nameError = errors[getErrorKey(index, 'name')];
          const valueError = errors[getErrorKey(index, 'value')];
          const interestError = errors[getErrorKey(index, 'loanDetails.interestRate')];
          const yearsError = errors[getErrorKey(index, 'loanDetails.remainingYears')];

          return (
            <div
              key={account.tempId}
              className={`accounts-list__item ${!account.isActive ? 'accounts-list__item--inactive' : ''}`}
            >
              <div className="accounts-list__item-header">
                {/* Account Name */}
                <div className="accounts-list__name-field">
                  <input
                    type="text"
                    className={`accounts-list__name-input ${nameError ? 'accounts-list__name-input--error' : ''}`}
                    value={account.name}
                    onChange={(e) => onUpdateAccount(account.tempId, { name: e.target.value })}
                    placeholder="Kontonavn"
                    maxLength={50}
                  />
                  {nameError && (
                    <span className="accounts-list__error">{nameError}</span>
                  )}
                </div>

                {/* Active Toggle */}
                <label className="accounts-list__toggle">
                  <input
                    type="checkbox"
                    checked={account.isActive}
                    onChange={(e) => onUpdateAccount(account.tempId, { isActive: e.target.checked })}
                  />
                  <span className="accounts-list__toggle-label">
                    {account.isActive ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </label>

                {/* Delete Button */}
                <button
                  type="button"
                  className="accounts-list__delete"
                  onClick={() => onRemoveAccount(account.tempId)}
                  disabled={!canDelete}
                  aria-label={`Slett ${account.name}`}
                  title={canDelete ? 'Slett konto' : 'Må ha minst én konto'}
                >
                  <Icon name="delete" size={18} />
                </button>
              </div>

              {/* Account Value */}
              <div className="accounts-list__value-row">
                <NumberInput
                  label="Verdi"
                  value={account.value}
                  onChange={(value) => onUpdateAccount(account.tempId, { value: value ?? 0 })}
                  suffix="kr"
                  error={valueError}
                  name={`value-${account.tempId}`}
                  disabled={!account.isActive}
                  dataInputGroup={`verdi-${category}`}
                  onActivate={() => onUpdateAccount(account.tempId, { isActive: true })}
                />
              </div>

              {/* Loan Details (for gjeld only) */}
              {showLoanDetails && (
                <div className="accounts-list__loan-details">
                  <div className="accounts-list__loan-row">
                    <div className="accounts-list__loan-field">
                      <label className="accounts-list__loan-label">Rente</label>
                      <div className="accounts-list__loan-input-wrapper">
                        <input
                          type="number"
                          className={`accounts-list__loan-input ${interestError ? 'accounts-list__loan-input--error' : ''}`}
                          value={account.loanDetails?.interestRate ?? ''}
                          onChange={(e) =>
                            onUpdateAccount(account.tempId, {
                              loanDetails: {
                                ...account.loanDetails,
                                interestRate: parseFloat(e.target.value) || 0,
                                remainingYears: account.loanDetails?.remainingYears ?? 0,
                              },
                            })
                          }
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="4.5"
                        />
                        <span className="accounts-list__loan-suffix">%</span>
                      </div>
                      {interestError && (
                        <span className="accounts-list__error">{interestError}</span>
                      )}
                    </div>

                    <div className="accounts-list__loan-field">
                      <label className="accounts-list__loan-label">Gjenstående år</label>
                      <div className="accounts-list__loan-input-wrapper">
                        <input
                          type="number"
                          className={`accounts-list__loan-input ${yearsError ? 'accounts-list__loan-input--error' : ''}`}
                          value={account.loanDetails?.remainingYears ?? ''}
                          onChange={(e) =>
                            onUpdateAccount(account.tempId, {
                              loanDetails: {
                                ...account.loanDetails,
                                interestRate: account.loanDetails?.interestRate ?? 0,
                                remainingYears: parseInt(e.target.value, 10) || 0,
                              },
                            })
                          }
                          min="0"
                          max="50"
                          placeholder="25"
                        />
                        <span className="accounts-list__loan-suffix">år</span>
                      </div>
                      {yearsError && (
                        <span className="accounts-list__error">{yearsError}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Account Button */}
      <button
        type="button"
        className="accounts-list__add-btn"
        onClick={onAddAccount}
      >
        <Icon name="add" size={18} />
        <span>Legg til {category === 'gjeld' ? 'lån' : 'konto'}</span>
      </button>

      {/* Category Total */}
      <div className="accounts-list__total">
        <span className="accounts-list__total-label">
          Sum {category === 'sparing' ? 'sparing' : category === 'gjeld' ? 'gjeld' : 'pensjon'}
        </span>
        <span className="accounts-list__total-value">
          {formatNumber(total)} kr
        </span>
      </div>
    </div>
  );
}
