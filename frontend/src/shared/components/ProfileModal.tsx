import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Modal } from './Modal';
import { NumberInput } from './NumberInput';
import { Button } from './Button';
import client from '../api/client';
import type { UserProfile } from '../../features/auth/types';
import './ProfileModal.css';

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: UserProfile;
  onSaved: () => void;
}

/**
 * Profile Edit Modal
 *
 * Modal for editing user profile information including financial planning settings.
 * Uses NumberInput for monetary values and regular inputs for other fields.
 */
export function ProfileModal({ isOpen, onClose, profile, onSaved }: ProfileModalProps) {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    monthlySalary: 0,
    annualExpenses: 0,
    birthYear: 1990,
    plannedRetirementAge: 67,
    fireNumber: undefined,
  });
  const [error, setError] = useState<string | null>(null);

  // Sync form data with profile when modal opens
  useEffect(() => {
    if (isOpen && profile) {
      setFormData({
        monthlySalary: profile.monthlySalary,
        annualExpenses: profile.annualExpenses,
        birthYear: profile.birthYear,
        plannedRetirementAge: profile.plannedRetirementAge,
        fireNumber: profile.fireNumber,
      });
      setError(null);
    }
  }, [isOpen, profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const response = await client.patch('/users/me', { profile: data });
      return response.data;
    },
    onSuccess: () => {
      onSaved();
      onClose();
    },
    onError: (err: any) => {
      const message = err.response?.data?.error?.message || 'Kunne ikke lagre endringer';
      setError(message);
    },
  });

  const doSubmit = () => {
    setError(null);

    // Basic validation
    if (formData.birthYear && (formData.birthYear < 1900 || formData.birthYear > new Date().getFullYear())) {
      setError('Ugyldig fødselsår');
      return;
    }

    if (formData.plannedRetirementAge && (formData.plannedRetirementAge < 30 || formData.plannedRetirementAge > 100)) {
      setError('Pensjonsalder må være mellom 30 og 100');
      return;
    }

    updateProfileMutation.mutate(formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSubmit();
  };

  const handleNumberChange = (field: keyof UserProfile) => (value: number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const currentYear = new Date().getFullYear();
  const calculatedAge = formData.birthYear ? currentYear - formData.birthYear : null;
  const defaultFireNumber = formData.annualExpenses ? formData.annualExpenses * 25 : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Min informasjon"
      footer={
        <div className="profile-modal__footer">
          <Button variant="secondary" onClick={onClose}>
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={doSubmit}
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? 'Lagrer...' : 'Lagre'}
          </Button>
        </div>
      }
    >
      <form className="profile-modal__form" onSubmit={handleSubmit}>
        {error && (
          <div className="profile-modal__error" role="alert">
            {error}
          </div>
        )}

        <div className="profile-modal__section">
          <h3 className="profile-modal__section-title">Inntekt og utgifter</h3>

          <NumberInput
            label="Månedlig inntekt"
            value={formData.monthlySalary}
            onChange={handleNumberChange('monthlySalary')}
            suffix="kr"
          />

          <NumberInput
            label="Årlige utgifter"
            value={formData.annualExpenses}
            onChange={handleNumberChange('annualExpenses')}
            suffix="kr"
          />
        </div>

        <div className="profile-modal__section">
          <h3 className="profile-modal__section-title">Personlig informasjon</h3>

          <div className="profile-modal__field">
            <label className="profile-modal__label" htmlFor="birthYear">
              Fødselsår
            </label>
            <input
              type="number"
              id="birthYear"
              className="profile-modal__input"
              value={formData.birthYear || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  birthYear: e.target.value ? parseInt(e.target.value, 10) : undefined,
                }))
              }
              min={1900}
              max={currentYear}
            />
            {calculatedAge !== null && calculatedAge > 0 && (
              <span className="profile-modal__hint">{calculatedAge} år</span>
            )}
          </div>

          <div className="profile-modal__field">
            <label className="profile-modal__label" htmlFor="plannedRetirementAge">
              Planlagt pensjonsalder
            </label>
            <input
              type="number"
              id="plannedRetirementAge"
              className="profile-modal__input"
              value={formData.plannedRetirementAge || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  plannedRetirementAge: e.target.value ? parseInt(e.target.value, 10) : undefined,
                }))
              }
              min={30}
              max={100}
            />
          </div>
        </div>

        <div className="profile-modal__section">
          <h3 className="profile-modal__section-title">F.I.R.E. mål</h3>

          <NumberInput
            label="F.I.R.E. tall"
            value={formData.fireNumber}
            onChange={handleNumberChange('fireNumber')}
            suffix="kr"
            placeholder={defaultFireNumber ? defaultFireNumber.toLocaleString('nb-NO') : '0'}
          />
          <p className="profile-modal__description">
            Valgfritt. Standard er 25 ganger årlige utgifter
            {defaultFireNumber > 0 && ` (${defaultFireNumber.toLocaleString('nb-NO')} kr)`}.
          </p>
        </div>
      </form>
    </Modal>
  );
}
