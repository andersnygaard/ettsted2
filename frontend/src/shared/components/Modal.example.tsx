import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

/**
 * Modal Example Usage
 *
 * Demonstrates how to use the Modal component with different configurations.
 */
export function ModalExample() {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isWithFooterOpen, setIsWithFooterOpen] = useState(false);
  const [isNoOverlayCloseOpen, setIsNoOverlayCloseOpen] = useState(false);

  return (
    <div style={{ padding: '24px' }}>
      <h1>Modal Examples</h1>

      {/* Basic Modal */}
      <div style={{ marginBottom: '16px' }}>
        <Button onClick={() => setIsBasicOpen(true)}>
          Open Basic Modal
        </Button>
        <Modal
          isOpen={isBasicOpen}
          onClose={() => setIsBasicOpen(false)}
          title="Basic Modal"
        >
          <p>
            This is a basic modal with just a title and body content.
            Press Escape or click the × button to close.
          </p>
        </Modal>
      </div>

      {/* Modal with Footer */}
      <div style={{ marginBottom: '16px' }}>
        <Button onClick={() => setIsWithFooterOpen(true)}>
          Open Modal with Footer
        </Button>
        <Modal
          isOpen={isWithFooterOpen}
          onClose={() => setIsWithFooterOpen(false)}
          title="Confirm Action"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setIsWithFooterOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setIsWithFooterOpen(false)}>
                Confirm
              </Button>
            </>
          }
        >
          <p>
            This modal includes footer buttons for actions.
            The footer is optional and can contain any React nodes.
          </p>
        </Modal>
      </div>

      {/* Modal without Overlay Close */}
      <div style={{ marginBottom: '16px' }}>
        <Button onClick={() => setIsNoOverlayCloseOpen(true)}>
          Open Modal (No Overlay Close)
        </Button>
        <Modal
          isOpen={isNoOverlayCloseOpen}
          onClose={() => setIsNoOverlayCloseOpen(false)}
          title="Important Message"
          closeOnOverlay={false}
        >
          <p>
            This modal cannot be closed by clicking the overlay.
            You must use the × button or press Escape.
          </p>
          <p>
            This is useful for critical actions where you want to prevent
            accidental dismissal.
          </p>
        </Modal>
      </div>
    </div>
  );
}
