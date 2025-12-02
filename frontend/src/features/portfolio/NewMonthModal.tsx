/**
 * NewMonthModal Component
 *
 * Modal form for adding new monthly portfolio snapshots.
 * Allows users to enter the month and account values for all tracked accounts.
 *
 * Features:
 * - Month selection using DateInput (always 1st of month)
 * - Account value inputs grouped by category (Sparing, Gjeld, Pensjon)
 * - Dynamic accounts from user.accounts configuration
 * - Form validation (required date, valid numbers)
 * - API mutation for creating snapshot
 * - Loading state and error handling
 *
 * Based on Nordic Minimal design system.
 */

import { useState, useMemo, useEffect } from 'react';
import { Modal, Button, DateInput, NumberInput } from '@finans/components';
import { useAuth } from '@/features/auth/useAuth';
import type { AccountConfig } from '@/features/auth/types';
import { useCreateSnapshot } from './usePortfolioData';
import './NewMonthModal.css';

export interface NewMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
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

export function NewMonthModal({ isOpen, onClose, onSuccess }: NewMonthModalProps) {
  const { user } = useAuth();
  const createSnapshot = useCreateSnapshot();

  // Form state - dynamic based on user accounts
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState<Record<string, number | undefined>>({});
  const [errors, setErrors] = useState<FormErrors>({});

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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(new Date());
      setFormData({});
      setErrors({});
    }
  }, [isOpen]);

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
   * Format date as dd.MM.yyyy
   */
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  /**
   * Validate form before submission
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate date
    if (!selectedDate || isNaN(selectedDate.getTime())) {
      newErrors.date = 'Dato er påkrevd';
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
        date: formatDate(selectedDate!),
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
    setSelectedDate(new Date());
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
        {/* General error */}
        {errors.general && (
          <div className="new-month-modal__error" role="alert">
            {errors.general}
          </div>
        )}

        {/* Date selection */}
        <div className="new-month-modal__section">
          <DateInput
            value={selectedDate}
            onChange={setSelectedDate}
            label="Måned"
            monthPicker
            required
            error={errors.date}
            disabled={isLoading}
            placeholder="MM.yyyy"
          />
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
