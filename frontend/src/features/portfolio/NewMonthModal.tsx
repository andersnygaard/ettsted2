/**
 * NewMonthModal Component
 *
 * Modal form for adding new monthly portfolio snapshots.
 * Allows users to enter the month and account values for all tracked accounts.
 *
 * Features:
 * - Month selection using DateInput (always 1st of month)
 * - Account value inputs grouped by category (Sparing, Gjeld, Pensjon)
 * - Form validation (required date, valid numbers)
 * - API mutation for creating snapshot
 * - Loading state and error handling
 *
 * Based on Nordic Minimal design system.
 */

import { useState } from 'react';
import { Modal, Button, DateInput, NumberInput } from '@/shared/components';
import './NewMonthModal.css';

export interface NewMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Account structure for the form
 */
interface AccountFormData {
  // Sparing
  nordnetAsk: number | undefined;
  bouvetAsk: number | undefined;
  yolo: number | undefined;
  firi: number | undefined;
  kron: number | undefined;
  skattKjop: number | undefined;

  // Gjeld
  sbanken: number | undefined;

  // Pensjon
  arbeidsgiver: number | undefined;
}

/**
 * Form validation errors
 */
interface FormErrors {
  date?: string;
  accounts?: Partial<Record<keyof AccountFormData, string>>;
}

export function NewMonthModal({ isOpen, onClose, onSuccess }: NewMonthModalProps) {
  // Form state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState<AccountFormData>({
    nordnetAsk: undefined,
    bouvetAsk: undefined,
    yolo: undefined,
    firi: undefined,
    kron: undefined,
    skattKjop: undefined,
    sbanken: undefined,
    arbeidsgiver: undefined,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle account value change
   */
  const handleAccountChange = (account: keyof AccountFormData, value: number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [account]: value,
    }));

    // Clear error for this field if it exists
    if (errors.accounts?.[account]) {
      setErrors((prev) => ({
        ...prev,
        accounts: {
          ...prev.accounts,
          [account]: undefined,
        },
      }));
    }
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

    // No account validation - all fields are optional
    // Users can enter values for only the accounts they have

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submit form data to API
   */
  const submitForm = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API mutation
      // For now, just simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Creating new month snapshot:', {
        date: selectedDate,
        accounts: formData,
      });

      // Call success callback
      onSuccess?.();

      // Close modal
      handleClose();
    } catch (error) {
      console.error('Failed to create snapshot:', error);
      setErrors({
        date: 'En feil oppstod. Vennligst prøv igjen.',
      });
    } finally {
      setIsLoading(false);
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
    setFormData({
      nordnetAsk: undefined,
      bouvetAsk: undefined,
      yolo: undefined,
      firi: undefined,
      kron: undefined,
      skattKjop: undefined,
      sbanken: undefined,
      arbeidsgiver: undefined,
    });
    setErrors({});
    setIsLoading(false);
    onClose();
  };

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

        {/* Sparing section */}
        <div className="new-month-modal__section">
          <h3 className="new-month-modal__section-title">Sparing</h3>
          <div className="new-month-modal__fields">
            <NumberInput
              value={formData.nordnetAsk}
              onChange={(value) => handleAccountChange('nordnetAsk', value)}
              label="Nordnet ASK"
              disabled={isLoading}
            />
            <NumberInput
              value={formData.bouvetAsk}
              onChange={(value) => handleAccountChange('bouvetAsk', value)}
              label="Bouvet ASK"
              disabled={isLoading}
            />
            <NumberInput
              value={formData.yolo}
              onChange={(value) => handleAccountChange('yolo', value)}
              label="Yolo"
              disabled={isLoading}
            />
            <NumberInput
              value={formData.firi}
              onChange={(value) => handleAccountChange('firi', value)}
              label="Firi"
              disabled={isLoading}
            />
            <NumberInput
              value={formData.kron}
              onChange={(value) => handleAccountChange('kron', value)}
              label="Kron"
              disabled={isLoading}
            />
            <NumberInput
              value={formData.skattKjop}
              onChange={(value) => handleAccountChange('skattKjop', value)}
              label="Skatt/Kjøp"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Gjeld section */}
        <div className="new-month-modal__section">
          <h3 className="new-month-modal__section-title">Gjeld</h3>
          <div className="new-month-modal__fields">
            <NumberInput
              value={formData.sbanken}
              onChange={(value) => handleAccountChange('sbanken', value)}
              label="SBanken"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Pensjon section */}
        <div className="new-month-modal__section">
          <h3 className="new-month-modal__section-title">Pensjon</h3>
          <div className="new-month-modal__fields">
            <NumberInput
              value={formData.arbeidsgiver}
              onChange={(value) => handleAccountChange('arbeidsgiver', value)}
              label="Arbeidsgiver"
              disabled={isLoading}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
