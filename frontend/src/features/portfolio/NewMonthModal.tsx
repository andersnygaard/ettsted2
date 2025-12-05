/**
 * NewMonthModal Component
 *
 * Modal form for adding new monthly portfolio snapshots.
 * Allows users to enter the month and account values for all tracked accounts.
 *
 * Features:
 * - Month/year picker using dropdown selects (always 1st of month)
 * - Prevents selecting future months
 * - Account value inputs grouped by category (Sparing, Gjeld, Pensjon)
 * - Dynamic accounts from user.accounts configuration
 * - Form validation (required date, valid numbers)
 * - API mutation for creating snapshot
 * - Loading state and error handling
 *
 * Based on Nordic Minimal design system.
 */

import { useState, useMemo, useEffect } from 'react';
import { Modal, Button, NumberInput } from '@finans/components';
import { useAuth } from '@/features/auth/useAuth';
import type { AccountConfig } from '@/features/auth/types';
import type { PortfolioRow } from './usePortfolioData';
import { useCreateSnapshot } from './usePortfolioData';
import './NewMonthModal.css';

export interface NewMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  latestSnapshot?: PortfolioRow;
}

type CategoryType = 'sparing' | 'gjeld' | 'pensjon';

const CATEGORY_LABELS: Record<CategoryType, string> = {
  sparing: 'Sparing',
  gjeld: 'Gjeld',
  pensjon: 'Pensjon',
};

// Map category to default assetClass for snapshot
const CATEGORY_TO_ASSET_CLASS: Record<CategoryType, string> = {
  sparing: 'aksjer',
  gjeld: 'gjeld',
  pensjon: 'pensjon',
};

/**
 * Form validation errors
 */
interface FormErrors {
  date?: string;
  general?: string;
}

export function NewMonthModal({ isOpen, onClose, onSuccess, latestSnapshot }: NewMonthModalProps) {
  const { user } = useAuth();
  const createSnapshot = useCreateSnapshot();

  // Norwegian month names
  const MONTHS = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember',
  ];

  // Form state - dynamic based on user accounts
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [formData, setFormData] = useState<Record<string, number | undefined>>({});
  const [errors, setErrors] = useState<FormErrors>({});

  // Generate available years (2020 to current year)
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);
  }, []);

  // Check if a month/year combination is in the future
  const isMonthDisabled = useMemo(() => {
    return (monthIndex: number, year: number) => {
      const now = new Date();
      return year > now.getFullYear() ||
             (year === now.getFullYear() && monthIndex > now.getMonth());
    };
  }, []);

  // Group accounts by category
  const accountsByCategory = useMemo(() => {
    if (!user?.accounts) return {} as Record<CategoryType, AccountConfig[]>;

    const categories: CategoryType[] = ['sparing', 'gjeld', 'pensjon'];
    const grouped = {} as Record<CategoryType, AccountConfig[]>;

    categories.forEach((category) => {
      grouped[category] = user.accounts!
        .filter((acc) => acc.category === category && acc.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    });

    return grouped;
  }, [user?.accounts]);

  // Reset form when modal opens and pre-fill with latest snapshot values
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      setSelectedMonth(now.getMonth());
      setSelectedYear(now.getFullYear());
      setErrors({});

      // Pre-fill account values from latest snapshot
      if (latestSnapshot) {
        const initialValues: Record<string, number> = {};
        latestSnapshot.accounts.forEach((acc) => {
          // Find matching account config by name
          const accountConfig = user?.accounts?.find(
            (cfg) => cfg.name.toLowerCase() === acc.name.toLowerCase()
          );
          if (accountConfig) {
            // Store gjeld as positive value (will be converted to negative during submission)
            initialValues[accountConfig.id] = Math.abs(acc.value);
          }
        });
        setFormData(initialValues);
      } else {
        setFormData({});
      }
    }
  }, [isOpen, latestSnapshot, user?.accounts]);

  /**
   * Handle account value change
   */
  const handleAccountChange = (accountId: string, value: number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [accountId]: value,
    }));
  };

  /**
   * Format date as dd.MM.yyyy using selected month and year
   */
  const formatDate = (monthIndex: number, year: number): string => {
    const day = '01';
    const month = String(monthIndex + 1).padStart(2, '0');
    return `${day}.${month}.${year}`;
  };

  /**
   * Validate form before submission
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate date (check if month is disabled)
    if (isMonthDisabled(selectedMonth, selectedYear)) {
      newErrors.date = 'Valgt måned er i fremtiden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submit form data to API
   */
  const submitForm = async () => {
    if (!validateForm() || !user?.accounts) {
      return;
    }

    // Build accounts array for snapshot
    const accounts = user.accounts
      .filter((acc) => acc.isActive && formData[acc.id] !== undefined)
      .map((acc) => ({
        id: acc.id,
        name: acc.name,
        assetClass: CATEGORY_TO_ASSET_CLASS[acc.category as CategoryType] || 'aksjer',
        value: acc.category === 'gjeld'
          ? -(formData[acc.id] || 0) // Store gjeld as negative
          : (formData[acc.id] || 0),
      }));

    // Calculate total net worth
    const totalNetWorth = accounts.reduce((sum, acc) => sum + acc.value, 0);

    try {
      await createSnapshot.mutateAsync({
        date: formatDate(selectedMonth, selectedYear),
        accounts,
        totalNetWorth,
      });

      // Call success callback
      onSuccess?.();

      // Close modal
      handleClose();
    } catch (error) {
      console.error('Failed to create snapshot:', error);
      setErrors({
        general: 'En feil oppstod. Vennligst prøv igjen.',
      });
    }
  };

  /**
   * Handle form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  /**
   * Reset form and close modal
   */
  const handleClose = () => {
    const now = new Date();
    setSelectedMonth(now.getMonth());
    setSelectedYear(now.getFullYear());
    setFormData({});
    setErrors({});
    onClose();
  };

  const isLoading = createSnapshot.isPending;

  const categories: CategoryType[] = ['sparing', 'gjeld', 'pensjon'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Ny måned"
      closeOnOverlay={!isLoading}
      footer={
        <div className="new-month-modal__actions">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={submitForm}
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? 'Lagrer...' : 'Lagre'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="new-month-modal__form">
        {/* Info when values are copied from previous snapshot */}
        {latestSnapshot && (
          <div className="new-month-modal__info" role="status">
            Verdier kopiert fra {latestSnapshot.date} — endre etter behov
          </div>
        )}

        {/* General error */}
        {errors.general && (
          <div className="new-month-modal__error" role="alert">
            {errors.general}
          </div>
        )}

        {/* Date selection */}
        <div className="new-month-modal__section">
          <label className="new-month-modal__label">
            Måned
            <span className="new-month-modal__required">*</span>
          </label>
          <div className="new-month-modal__date-picker">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              disabled={isLoading}
              className="new-month-modal__select"
              aria-label="Velg måned"
            >
              {MONTHS.map((month, index) => (
                <option
                  key={month}
                  value={index}
                  disabled={isMonthDisabled(index, selectedYear)}
                >
                  {month}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              disabled={isLoading}
              className="new-month-modal__select"
              aria-label="Velg år"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          {errors.date && (
            <span className="new-month-modal__error-message" role="alert">
              {errors.date}
            </span>
          )}
        </div>

        {/* Dynamic account sections */}
        {categories.map((category) => {
          const categoryAccounts = accountsByCategory[category] || [];
          if (categoryAccounts.length === 0) return null;

          return (
            <div key={category} className="new-month-modal__section">
              <h3 className="new-month-modal__section-title">{CATEGORY_LABELS[category]}</h3>
              <div className="new-month-modal__fields">
                {categoryAccounts.map((account) => (
                  <NumberInput
                    key={account.id}
                    value={formData[account.id]}
                    onChange={(value) => handleAccountChange(account.id, value)}
                    label={account.name}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty state if no accounts */}
        {!user?.accounts || user.accounts.filter((a) => a.isActive).length === 0 ? (
          <div className="new-month-modal__empty">
            <p>Ingen kontoer konfigurert. Gå til "Mitt oppsett" for å legge til kontoer.</p>
          </div>
        ) : null}
      </form>
    </Modal>
  );
}
