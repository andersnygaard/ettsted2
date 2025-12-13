# FEATURE: New Month Modal

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: component, modal, portfolio, forms
**Estimated Effort**: Medium - 2-3 hours

## Context & Motivation

Users need to add new monthly snapshots via a modal form. This is the primary data entry mechanism.

## Reference

Based on CLAUDE.md specification and portfolio page action button.

## Desired Outcome

Modal form for adding new monthly snapshot data.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/portfolio/NewMonthModal.tsx`
- [ ] Opens when "+ Ny måned" button clicked
- [ ] Date picker (defaults to current month)
- [ ] Account value inputs for each tracked account
- [ ] Norwegian number input formatting
- [ ] Validation (required fields, valid numbers)
- [ ] Submit creates new snapshot via API
- [ ] Loading state during submission
- [ ] Success/error feedback
- [ ] Close on successful submit

## Technical Approach

```tsx
// NewMonthModal.tsx
interface NewMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewMonthModal({ isOpen, onClose, onSuccess }: NewMonthModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const mutation = useCreateSnapshot();

  const onSubmit = async (data: SnapshotFormData) => {
    await mutation.mutateAsync(data);
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <h2>Ny måned</h2>
          <button onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal__body">
            <DateInput label="Dato" {...register('date', { required: true })} />

            <h3>Sparing</h3>
            <NumberInput label="Nordnet ASK" {...register('nordnetAsk')} />
            <NumberInput label="Bouvet ASK" {...register('bouvetAsk')} />
            {/* More account inputs */}

            <h3>Gjeld</h3>
            <NumberInput label="SBanken" {...register('sbanken')} />

            <h3>Pensjon</h3>
            <NumberInput label="Arbeidsgiver" {...register('arbeidsgiver')} />
          </div>

          <div className="modal__footer">
            <Button variant="secondary" onClick={onClose}>Avbryt</Button>
            <Button variant="primary" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Lagrer...' : 'Lagre'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

## Dependencies

- `029-FEATURE-button-component.md`
- `043-FEATURE-modal-component.md`
- `044-FEATURE-number-input-component.md`
- `045-FEATURE-date-input-component.md`

---

**Next Steps**: Implement after form components
