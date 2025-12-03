import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../ui/Button';
import './Foundations.css';

/**
 * Design System Foundations
 *
 * Nordic Minimal Design System documentation showing:
 * - Color palette with swatches
 * - Typography (fonts and sizes)
 * - Button variants and usage guidelines
 */

const meta = {
  title: 'DesignSystem/Foundations',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Color definitions from the design system
const colors = {
  primary: [
    { name: 'Bone', var: '--bone', value: '#F5F2ED', usage: 'Primary background' },
    { name: 'Warm White', var: '--warm-white', value: '#FDFCFA', usage: 'Cards, elevated surfaces' },
    { name: 'Charcoal', var: '--charcoal', value: '#2C2C2C', usage: 'Primary text' },
  ],
  accent: [
    { name: 'Muted Sage', var: '--muted-sage', value: '#8B9A7D', usage: 'Positive values, savings' },
    { name: 'Soft Terracotta', var: '--soft-terracotta', value: '#C4A484', usage: 'Accent color' },
    { name: 'Pale Blue', var: '--pale-blue', value: '#B8C5D0', usage: 'Secondary accent' },
  ],
  semantic: [
    { name: 'Text Secondary', var: '--text-secondary', value: '#6B6B6B', usage: 'Muted text, labels' },
    { name: 'Gold', var: '--gold', value: '#C9A962', usage: 'Milestone highlights' },
    { name: 'Positive', var: '--positive', value: '#5A7D5A', usage: 'Positive changes, growth' },
    { name: 'Negative', var: '--negative', value: '#9D6B5A', usage: 'Negative changes, losses' },
    { name: 'Border', var: '--border', value: 'rgba(44, 44, 44, 0.08)', usage: 'Dividers, borders' },
  ],
};

// Typography definitions
const typography = {
  families: [
    { name: 'Cormorant Garamond', var: '--font-heading', usage: 'Headings, large numbers', weight: '300-600' },
    { name: 'DM Sans', var: '--font-body', usage: 'Body text, UI elements', weight: '400-700' },
    { name: 'JetBrains Mono', var: '--font-mono', usage: 'Numbers, data values, code', weight: '400-600' },
  ],
  sizes: [
    { name: 'Hero', size: '64px', element: 'HeroNumber value' },
    { name: 'H1', size: '48px', element: 'Page titles' },
    { name: 'H2', size: '32px', element: 'Section headings' },
    { name: 'H3', size: '24px', element: 'Card titles' },
    { name: 'Body', size: '16px', element: 'Paragraph text' },
    { name: 'Small', size: '14px', element: 'Secondary text' },
    { name: 'Label', size: '11px', element: 'Uppercase labels' },
  ],
};

// Button usage guidelines
const buttonGuidelines = [
  {
    variant: 'primary' as const,
    label: 'Primary',
    when: 'Main action on the page (submit, save, confirm)',
    example: 'Lagre, Opprett, Bekreft',
  },
  {
    variant: 'secondary' as const,
    label: 'Secondary',
    when: 'Alternative actions or cancel buttons',
    example: 'Avbryt, Tilbake, Eksporter',
  },
];

/**
 * Color Palette
 *
 * The Nordic Minimal color palette uses warm, muted tones
 * inspired by Scandinavian design. Colors are organized into
 * three categories: primary, accent, and semantic.
 */
export const ColorPalette: Story = {
  render: () => (
    <div className="foundations">
      <div className="foundations__section">
        <h1 className="foundations__title">Color Palette</h1>
        <p className="foundations__description">
          Nordic Minimal uses warm, muted tones with subtle grain texture overlay.
        </p>

        <div className="foundations__group">
          <h2 className="foundations__subtitle">Primary Colors</h2>
          <div className="color-grid">
            {colors.primary.map((color) => (
              <div key={color.name} className="color-swatch">
                <div
                  className="color-swatch__preview"
                  style={{ backgroundColor: color.value }}
                />
                <div className="color-swatch__info">
                  <div className="color-swatch__name">{color.name}</div>
                  <code className="color-swatch__var">{color.var}</code>
                  <div className="color-swatch__value">{color.value}</div>
                  <div className="color-swatch__usage">{color.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="foundations__group">
          <h2 className="foundations__subtitle">Accent Colors</h2>
          <div className="color-grid">
            {colors.accent.map((color) => (
              <div key={color.name} className="color-swatch">
                <div
                  className="color-swatch__preview"
                  style={{ backgroundColor: color.value }}
                />
                <div className="color-swatch__info">
                  <div className="color-swatch__name">{color.name}</div>
                  <code className="color-swatch__var">{color.var}</code>
                  <div className="color-swatch__value">{color.value}</div>
                  <div className="color-swatch__usage">{color.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="foundations__group">
          <h2 className="foundations__subtitle">Semantic Colors</h2>
          <div className="color-grid">
            {colors.semantic.map((color) => (
              <div key={color.name} className="color-swatch">
                <div
                  className="color-swatch__preview"
                  style={{ backgroundColor: color.value }}
                />
                <div className="color-swatch__info">
                  <div className="color-swatch__name">{color.name}</div>
                  <code className="color-swatch__var">{color.var}</code>
                  <div className="color-swatch__value">{color.value}</div>
                  <div className="color-swatch__usage">{color.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Typography
 *
 * Three font families: Cormorant Garamond for headings (elegant serif),
 * DM Sans for body (clean sans-serif), and JetBrains Mono for data (monospace).
 */
export const Typography: Story = {
  render: () => (
    <div className="foundations">
      <div className="foundations__section">
        <h1 className="foundations__title">Typography</h1>
        <p className="foundations__description">
          Scandinavian-inspired typography with elegant serif headings and clean sans-serif body text.
        </p>

        <div className="foundations__group">
          <h2 className="foundations__subtitle">Font Families</h2>
          <div className="font-families">
            {typography.families.map((font) => (
              <div key={font.name} className="font-family">
                <div
                  className="font-family__sample"
                  style={{ fontFamily: `var(${font.var})` }}
                >
                  Aa Bb Cc 123 456
                </div>
                <div className="font-family__info">
                  <div className="font-family__name">{font.name}</div>
                  <code className="font-family__var">{font.var}</code>
                  <div className="font-family__usage">{font.usage}</div>
                  <div className="font-family__weight">Weights: {font.weight}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="foundations__group">
          <h2 className="foundations__subtitle">Type Scale</h2>
          <div className="type-scale">
            {typography.sizes.map((size) => (
              <div key={size.name} className="type-scale__item">
                <div
                  className="type-scale__sample"
                  style={{ fontSize: size.size }}
                >
                  {size.name}
                </div>
                <div className="type-scale__info">
                  <code className="type-scale__size">{size.size}</code>
                  <span className="type-scale__element">{size.element}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="foundations__group">
          <h2 className="foundations__subtitle">Number Formatting</h2>
          <p className="foundations__note">
            Norwegian locale: space as thousands separator, comma as decimal.
          </p>
          <div className="number-examples">
            <div className="number-example">
              <span className="number-example__value" style={{ fontFamily: 'var(--font-mono)' }}>
                1 234 567,89 kr
              </span>
              <span className="number-example__desc">Currency format</span>
            </div>
            <div className="number-example">
              <span className="number-example__value" style={{ fontFamily: 'var(--font-mono)' }}>
                +2,33%
              </span>
              <span className="number-example__desc">Percentage format</span>
            </div>
            <div className="number-example">
              <span className="number-example__value" style={{ fontFamily: 'var(--font-mono)' }}>
                01.01.2024
              </span>
              <span className="number-example__desc">Date format (dd.MM.yyyy)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Buttons
 *
 * Button variants and usage guidelines for consistent interaction patterns.
 */
export const Buttons: Story = {
  render: () => (
    <div className="foundations">
      <div className="foundations__section">
        <h1 className="foundations__title">Buttons</h1>
        <p className="foundations__description">
          Button variants with clear usage guidelines for consistent user experience.
        </p>

        <div className="foundations__group">
          <h2 className="foundations__subtitle">Button Variants</h2>
          <div className="button-showcase">
            {buttonGuidelines.map((btn) => (
              <div key={btn.variant} className="button-variant">
                <div className="button-variant__buttons">
                  <Button variant={btn.variant}>{btn.label}</Button>
                  <Button variant={btn.variant} disabled>
                    Disabled
                  </Button>
                  <Button variant={btn.variant} icon="+">
                    With Icon
                  </Button>
                </div>
                <div className="button-variant__info">
                  <div className="button-variant__name">{btn.label}</div>
                  <div className="button-variant__when">
                    <strong>When to use:</strong> {btn.when}
                  </div>
                  <div className="button-variant__example">
                    <strong>Examples:</strong> {btn.example}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="foundations__group">
          <h2 className="foundations__subtitle">Button States</h2>
          <div className="button-states">
            <div className="button-state">
              <Button variant="primary">Default</Button>
              <span>Normal state</span>
            </div>
            <div className="button-state">
              <Button variant="primary">Hover me</Button>
              <span>Hover: lift effect (-1px)</span>
            </div>
            <div className="button-state">
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <span>Disabled: 50% opacity</span>
            </div>
          </div>
        </div>

        <div className="foundations__group">
          <h2 className="foundations__subtitle">Missing Variants (Recommended)</h2>
          <div className="button-missing">
            <div className="button-missing__item">
              <div className="button-missing__preview" style={{ background: '#9D6B5A', color: '#fff' }}>
                Danger
              </div>
              <p>For destructive actions (delete, remove)</p>
            </div>
            <div className="button-missing__item">
              <div className="button-missing__preview" style={{ background: 'transparent', color: '#6B6B6B', border: 'none' }}>
                Subtle
              </div>
              <p>For tertiary actions (edit inline, minor toggles)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Spacing & Layout
 *
 * Consistent spacing scale and layout guidelines.
 */
export const SpacingLayout: Story = {
  render: () => (
    <div className="foundations">
      <div className="foundations__section">
        <h1 className="foundations__title">Spacing & Layout</h1>
        <p className="foundations__description">
          Consistent spacing creates visual rhythm and hierarchy.
        </p>

        <div className="foundations__group">
          <h2 className="foundations__subtitle">Spacing Scale</h2>
          <div className="spacing-scale">
            {[4, 8, 12, 16, 20, 24, 32, 48, 64, 80].map((size) => (
              <div key={size} className="spacing-item">
                <div
                  className="spacing-item__box"
                  style={{ width: size, height: size }}
                />
                <code className="spacing-item__value">{size}px</code>
              </div>
            ))}
          </div>
        </div>

        <div className="foundations__group">
          <h2 className="foundations__subtitle">Container Widths</h2>
          <div className="container-widths">
            <div className="container-width">
              <code>max-width: 1200px</code>
              <span>Default container (dashboard, portfolio)</span>
            </div>
            <div className="container-width">
              <code>max-width: 900px</code>
              <span>Focused pages (calculators, forms)</span>
            </div>
            <div className="container-width">
              <code>max-width: 480px</code>
              <span>Narrow content (login, modals)</span>
            </div>
          </div>
        </div>

        <div className="foundations__group">
          <h2 className="foundations__subtitle">Border Radius</h2>
          <div className="radius-examples">
            <div className="radius-example" style={{ borderRadius: '2px' }}>
              <code>2px</code>
              <span>Cards, buttons</span>
            </div>
            <div className="radius-example" style={{ borderRadius: '4px' }}>
              <code>4px</code>
              <span>Inputs, small elements</span>
            </div>
            <div className="radius-example" style={{ borderRadius: '50%' }}>
              <code>50%</code>
              <span>Avatar, circular elements</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
