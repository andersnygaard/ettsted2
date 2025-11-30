import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Modal } from './Modal';
import { Button } from './Button';
import client from '../api/client';
import type { AccountConfig, LoanDetails } from '../../features/auth/types';
import './AccountsModal.css';

export interface AccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts?: AccountConfig[];
  onSaved: () => void;
}

type CategoryType = 'sparing' | 'gjeld' | 'pensjon';

const CATEGORY_LABELS: Record<CategoryType, string> = {
  sparing: 'Sparing',
  gjeld: 'Gjeld',
  pensjon: 'Pensjon',
};

interface EditingAccount extends Omit<AccountConfig, 'id' | 'createdAt'> {
  id?: string;
  createdAt?: string;
  isNew?: boolean;
}

/**
 * Accounts Setup Modal
 *
 * Modal for managing user account configurations.
 * Allows creating, editing, deleting, and reordering accounts.
 */
export function AccountsModal({ isOpen, onClose, accounts, onSaved }: AccountsModalProps) {
  const [editingAccounts, setEditingAccounts] = useState<EditingAccount[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Sync accounts when modal opens
  useEffect(() => {
    if (isOpen && accounts) {
      setEditingAccounts(accounts.map((acc) => ({ ...acc })));
      setError(null);
    }
  }, [isOpen, accounts]);

  const updateAccountsMutation = useMutation({
    mutationFn: async (data: { accounts: AccountConfig[] }) => {
      const response = await client.patch('/users/me', data);
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

  const handleSave = () => {
    setError(null);

    // Validate
    const invalidAccounts = editingAccounts.filter((acc) => !acc.name.trim());
    if (invalidAccounts.length > 0) {
      setError('Alle kontoer må ha et navn');
      return;
    }

    // Prepare accounts for saving
    const accountsToSave: AccountConfig[] = editingAccounts.map((acc, index) => ({
      id: acc.id || `acc-${Date.now()}-${index}`,
      name: acc.name.trim(),
      category: acc.category,
      isActive: acc.isActive,
      sortOrder: index + 1,
      createdAt: acc.createdAt || new Date().toISOString(),
      loanDetails: acc.category === 'gjeld' ? acc.loanDetails : undefined,
    }));

    updateAccountsMutation.mutate({ accounts: accountsToSave });
  };

  const handleAddAccount = (category: CategoryType) => {
    const categoryAccounts = editingAccounts.filter((acc) => acc.category === category);
    const newAccount: EditingAccount = {
      name: '',
      category,
      isActive: true,
      sortOrder: categoryAccounts.length + 1,
      isNew: true,
      loanDetails: category === 'gjeld' ? { interestRate: 0, remainingYears: 0 } : undefined,
    };
    setEditingAccounts([...editingAccounts, newAccount]);
  };

  const handleRemoveAccount = (index: number) => {
    setEditingAccounts(editingAccounts.filter((_, i) => i !== index));
  };

  const handleUpdateAccount = (index: number, updates: Partial<EditingAccount>) => {
    setEditingAccounts(
      editingAccounts.map((acc, i) => (i === index ? { ...acc, ...updates } : acc))
    );
  };

  const handleUpdateLoanDetails = (index: number, updates: Partial<LoanDetails>) => {
    setEditingAccounts(
      editingAccounts.map((acc, i) =>
        i === index
          ? { ...acc, loanDetails: { ...acc.loanDetails, ...updates } as LoanDetails }
          : acc
      )
    );
  };

  // Drag & Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    // Only allow drop within same category
    const draggedAcc = editingAccounts[draggedIndex];
    const targetAcc = editingAccounts[index];
    if (draggedAcc.category !== targetAcc.category) return;

    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const draggedAcc = editingAccounts[draggedIndex];
    const targetAcc = editingAccounts[dropIndex];

    // Only allow drop within same category
    if (draggedAcc.category !== targetAcc.category) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Reorder within category
    const newAccounts = [...editingAccounts];
    newAccounts.splice(draggedIndex, 1);
    newAccounts.splice(dropIndex, 0, draggedAcc);
    setEditingAccounts(newAccounts);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Group accounts by category
  const groupedAccounts = editingAccounts.reduce(
    (groups, acc, index) => {
      if (!groups[acc.category]) {
        groups[acc.category] = [];
      }
      groups[acc.category].push({ ...acc, originalIndex: index });
      return groups;
    },
    {} as Record<CategoryType, (EditingAccount & { originalIndex: number })[]>
  );

  const categories: CategoryType[] = ['sparing', 'gjeld', 'pensjon'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mitt oppsett"
      footer={
        <div className="accounts-modal__footer">
          <Button variant="secondary" onClick={onClose}>
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={updateAccountsMutation.isPending}
          >
            {updateAccountsMutation.isPending ? 'Lagrer...' : 'Lagre'}
          </Button>
        </div>
      }
    >
      <div className="accounts-modal__content">
        {error && (
          <div className="accounts-modal__error" role="alert">
            {error}
          </div>
        )}

        {categories.map((category) => (
          <div key={category} className="accounts-modal__section">
            <div className="accounts-modal__section-header">
              <h3 className="accounts-modal__section-title">{CATEGORY_LABELS[category]}</h3>
              <button
                type="button"
                className="accounts-modal__add-btn"
                onClick={() => handleAddAccount(category)}
              >
                + Legg til
              </button>
            </div>

            <div className="accounts-modal__list">
              {(groupedAccounts[category] || []).map((acc) => (
                <div
                  key={acc.originalIndex}
                  className={`accounts-modal__item ${!acc.isActive ? 'accounts-modal__item--inactive' : ''} ${draggedIndex === acc.originalIndex ? 'accounts-modal__item--dragging' : ''} ${dragOverIndex === acc.originalIndex ? 'accounts-modal__item--drag-over' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(acc.originalIndex)}
                  onDragOver={(e) => handleDragOver(e, acc.originalIndex)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, acc.originalIndex)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="accounts-modal__item-main">
                    <div className="accounts-modal__drag-handle" title="Dra for å endre rekkefølge">
                      ⋮⋮
                    </div>

                    <input
                      type="text"
                      className="accounts-modal__input"
                      value={acc.name}
                      onChange={(e) =>
                        handleUpdateAccount(acc.originalIndex, { name: e.target.value })
                      }
                      placeholder="Kontonavn"
                    />

                    <label className="accounts-modal__toggle">
                      <input
                        type="checkbox"
                        checked={acc.isActive}
                        onChange={(e) =>
                          handleUpdateAccount(acc.originalIndex, { isActive: e.target.checked })
                        }
                      />
                      <span className="accounts-modal__toggle-label">Aktiv</span>
                    </label>

                    <button
                      type="button"
                      className="accounts-modal__remove-btn"
                      onClick={() => handleRemoveAccount(acc.originalIndex)}
                      title="Fjern konto"
                    >
                      ×
                    </button>
                  </div>

                  {category === 'gjeld' && acc.loanDetails && (
                    <div className="accounts-modal__loan-details">
                      <div className="accounts-modal__loan-field">
                        <label>Rente %</label>
                        <input
                          type="number"
                          step="0.1"
                          value={acc.loanDetails.interestRate || ''}
                          onChange={(e) =>
                            handleUpdateLoanDetails(acc.originalIndex, {
                              interestRate: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="accounts-modal__loan-field">
                        <label>Gjenstående år</label>
                        <input
                          type="number"
                          value={acc.loanDetails.remainingYears || ''}
                          onChange={(e) =>
                            handleUpdateLoanDetails(acc.originalIndex, {
                              remainingYears: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="accounts-modal__loan-field">
                        <label>Opprinnelig beløp</label>
                        <input
                          type="number"
                          value={acc.loanDetails.originalAmount || ''}
                          onChange={(e) =>
                            handleUpdateLoanDetails(acc.originalIndex, {
                              originalAmount: parseInt(e.target.value) || undefined,
                            })
                          }
                          placeholder="Valgfritt"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {(!groupedAccounts[category] || groupedAccounts[category].length === 0) && (
                <div className="accounts-modal__empty">Ingen kontoer</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
