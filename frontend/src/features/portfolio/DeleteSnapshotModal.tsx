import { Modal, Button } from '@finans/components';

export interface DeleteSnapshotModalProps {
  isOpen: boolean;
  snapshotDate: string | null;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteSnapshotModal({
  isOpen,
  snapshotDate,
  isPending,
  onConfirm,
  onCancel,
}: DeleteSnapshotModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Slett måned"
      footer={
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'Sletter...' : 'Slett'}
          </Button>
        </div>
      }
    >
      <p>
        Er du sikker på at du vil slette {snapshotDate}?
      </p>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
        Denne handlingen kan ikke angres.
      </p>
    </Modal>
  );
}
