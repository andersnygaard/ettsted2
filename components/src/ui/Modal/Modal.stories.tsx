import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from '../Button'
import './Modal.css'

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    closeOnOverlay: { control: 'boolean' },
    onClose: { action: 'closed' }
  }
}

export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Modal Title"
        >
          <p>This is the modal body content. You can click the overlay or press Escape to close.</p>
        </Modal>
      </>
    )
  }
}

export const WithFooter: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal with Footer</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Confirm Action"
          footer={
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsOpen(false)}>
                Confirm
              </Button>
            </div>
          }
        >
          <p>Are you sure you want to proceed with this action?</p>
        </Modal>
      </>
    )
  }
}

export const NoOverlayClose: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal (No Overlay Close)</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Important Information"
          closeOnOverlay={false}
          footer={
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          }
        >
          <p>This modal can only be closed by clicking the button or close button.</p>
          <p>Clicking the overlay will not close it.</p>
        </Modal>
      </>
    )
  }
}

export const LongContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal with Long Content</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Long Content Example"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <p key={i}>
              This is paragraph {i + 1}. The modal body scrolls when content exceeds the max height.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          ))}
        </Modal>
      </>
    )
  }
}
