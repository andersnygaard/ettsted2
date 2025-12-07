import type { Meta, StoryObj } from '@storybook/react';

// UI Components
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { Breadcrumb } from '../ui/Breadcrumb';
import { Avatar } from '../ui/Avatar';

// Form Components
import { NumberInput } from '../forms/NumberInput';
import { DateInput } from '../forms/DateInput';
import { ProgressBar } from '../forms/ProgressBar';

// Data Components
import { HeroNumber } from '../data/HeroNumber';
import { StatsRow } from '../data/StatsRow';
import { SpreadsheetTable } from '../data/SpreadsheetTable';
import { TableHeader } from '../data/TableHeader';
import { TableFooter } from '../data/TableFooter';

// Card Components
import { StatCard } from '../cards/StatCard';
import { MilestoneCard } from '../cards/MilestoneCard';
import { CalculatorCard } from '../cards/CalculatorCard';

// Chart Components
import { AreaChart } from '../charts/AreaChart';
import { StackedAreaChart } from '../charts/StackedAreaChart';
import { DonutChart } from '../charts/DonutChart';

// Layout Components
import { Container } from '../layout/Container';
import { SectionLink } from '../layout/SectionLink';

// System Components
import { ToastProvider, useToast } from '../system/Toast';

import './AllComponents.css';

/**
 * Kitchen Sink Demo
 *
 * Showcases all components working together in a realistic layout.
 * Use this to verify visual consistency and component interplay.
 */

const meta = {
  title: 'Demo/AllComponents',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data for charts
const chartData = [
  { date: new Date(2024, 0, 1), value: 450000 },
  { date: new Date(2024, 1, 1), value: 465000 },
  { date: new Date(2024, 2, 1), value: 478000 },
  { date: new Date(2024, 3, 1), value: 492000 },
  { date: new Date(2024, 4, 1), value: 510000 },
  { date: new Date(2024, 5, 1), value: 525000 },
];

const stackedChartData = [
  { date: new Date(2024, 0, 1), sparing: 400000, pensjon: 100000 },
  { date: new Date(2024, 1, 1), sparing: 420000, pensjon: 105000 },
  { date: new Date(2024, 2, 1), sparing: 445000, pensjon: 110000 },
  { date: new Date(2024, 3, 1), sparing: 470000, pensjon: 115000 },
  { date: new Date(2024, 4, 1), sparing: 495000, pensjon: 120000 },
  { date: new Date(2024, 5, 1), sparing: 520000, pensjon: 125000 },
];

// Mock table data
const tableColumnGroups = [
  {
    id: 'sparing',
    label: 'SPARING',
    color: '#5a6d7a',
    columns: [
      { id: 'nordnet', label: 'Nordnet' },
      { id: 'kron', label: 'Kron' },
      { id: 'sparing_total', label: 'Sum', isTotal: true },
    ],
  },
  {
    id: 'gjeld',
    label: 'GJELD',
    color: '#8a7060',
    columns: [
      { id: 'huslan', label: 'Huslån' },
      { id: 'gjeld_total', label: 'Sum', isTotal: true },
    ],
  },
];

const tableData = [
  { id: '1', date: '01.06.2024', nordnet: 320000, kron: 45000, sparing_total: 365000, huslan: -400000, gjeld_total: -400000 },
  { id: '2', date: '01.05.2024', nordnet: 310000, kron: 43000, sparing_total: 353000, huslan: -405000, gjeld_total: -405000 },
  { id: '3', date: '01.04.2024', nordnet: 300000, kron: 41000, sparing_total: 341000, huslan: -410000, gjeld_total: -410000 },
];

// Toast Demo Component
function ToastDemo() {
  const { showToast } = useToast();

  return (
    <div className="demo-toast-buttons">
      <Button onClick={() => showToast('Endringer lagret', 'success')}>
        Success Toast
      </Button>
      <Button variant="secondary" onClick={() => showToast('Vennligst sjekk feltene', 'warning')}>
        Warning Toast
      </Button>
      <Button variant="secondary" onClick={() => showToast('Kunne ikke lagre', 'error')}>
        Error Toast
      </Button>
    </div>
  );
}

/**
 * Full Kitchen Sink
 *
 * All components displayed together in a structured layout.
 */
export const KitchenSink: Story = {
  render: () => (
    <ToastProvider>
      <div className="demo-page">
        {/* Header Section */}
        <section className="demo-section">
          <h2 className="demo-section__title">Layout Components</h2>

          <div className="demo-grid demo-grid--2">
            <div className="demo-card">
              <h3>PageHeader</h3>
              <h1 style={{ fontFamily: "Cormorant Garamond", fontWeight: 300, margin: 0 }}>Oversikt</h1>
              <p style={{ color: "var(--text-secondary)", margin: "4px 0 0" }}>Din finansielle status</p>
            </div>
            <div className="demo-card">
              <h3>Breadcrumb</h3>
              <Breadcrumb
                items={[
                  { label: 'Hjem', path: '/' },
                  { label: 'Portefølje', path: '/portfolio' },
                  { label: 'November 2024' },
                ]}
              />
            </div>
          </div>

          <div className="demo-grid demo-grid--3">
            <SectionLink
              title="Portefølje"
              subtitle="Se din totale formue"
              href="/portfolio"
            />
            <SectionLink
              title="Kalkulatorer"
              subtitle="Planlegg din fremtid"
              href="/calculators"
            />
            <SectionLink
              title="Sparing"
              subtitle="F.I.R.E. fremgang"
              href="/sparing"
            />
          </div>
        </section>

        {/* Data Display Section */}
        <section className="demo-section">
          <h2 className="demo-section__title">Data Display Components</h2>

          <div className="demo-hero">
            <HeroNumber
              label="Netto formue"
              value="1 234 567 kr"
              change={2.33}
              changeLabel="denne måneden"
            />
          </div>

          <div className="demo-grid demo-grid--4">
            <StatCard value="970 194 kr" label="Sum sparing" onClick={() => {}} />
            <StatCard value="-456 789 kr" label="Sum gjeld" onClick={() => {}} />
            <StatCard value="125 000 kr" label="Pensjon" onClick={() => {}} />
            <StatCard value="42,5%" label="Sparerate" onClick={() => {}} />
          </div>

          <div className="demo-grid demo-grid--1">
            <MilestoneCard
              label="Neste milepæl"
              target={1500000}
              current={1234567}
            />
          </div>

          <div className="demo-grid demo-grid--1">
            <StatsRow
              stats={[
                { value: '42,5%', label: 'Sparerate' },
                { value: '+5,8%', label: 'Siste måned' },
                { value: '18', label: 'Måneder fri' },
              ]}
            />
          </div>
        </section>

        {/* Charts Section */}
        <section className="demo-section">
          <h2 className="demo-section__title">Chart Components</h2>

          <div className="demo-grid demo-grid--2">
            <div className="demo-card demo-card--chart">
              <h3>AreaChart</h3>
              <AreaChart
                data={chartData}
                height={200}
                color="var(--muted-sage)"
              />
            </div>
            <div className="demo-card demo-card--chart">
              <h3>DonutChart</h3>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <DonutChart
                  percentage={85.5}
                  label="Dekning"
                  size={180}
                />
              </div>
            </div>
          </div>

          <div className="demo-card demo-card--chart">
            <h3>StackedAreaChart</h3>
            <StackedAreaChart
              data={stackedChartData}
              series={[
                { key: 'sparing', label: 'Sparing', color: 'var(--muted-sage)' },
                { key: 'pensjon', label: 'Pensjon', color: 'var(--pale-blue)' },
              ]}
              height={250}
            />
          </div>
        </section>

        {/* Table Section */}
        <section className="demo-section">
          <h2 className="demo-section__title">Table Components</h2>

          <div className="demo-card">
            <TableHeader
              title="Månedlig historikk"
              years={[2024, 2023, 2022]}
              selectedYear={2024}
              onYearChange={() => {}}
              searchValue=""
              onSearchChange={() => {}}
            />
            <SpreadsheetTable
              columnGroups={tableColumnGroups}
              data={tableData}
              dateKey="date"
              rowIdKey="id"
            />
            <TableFooter
              page={1}
              totalPages={3}
              showing={3}
              total={24}
              onPageChange={() => {}}
              columnToggles={[]}
              onToggleColumn={() => {}}
            />
          </div>
        </section>

        {/* Form Components Section */}
        <section className="demo-section">
          <h2 className="demo-section__title">Form Components</h2>

          <div className="demo-grid demo-grid--3">
            <div className="demo-card">
              <h3>NumberInput</h3>
              <NumberInput
                label="Beløp"
                value={123456}
                onChange={() => {}}
                suffix="kr"
              />
            </div>
            <div className="demo-card">
              <h3>DateInput</h3>
              <DateInput
                label="Dato"
                value={new Date(2024, 5, 1)}
                onChange={() => {}}
              />
            </div>
            <div className="demo-card">
              <h3>NumberInput (Error)</h3>
              <NumberInput
                label="Ugyldig verdi"
                value={undefined}
                onChange={() => {}}
                error="Må være et gyldig tall"
              />
            </div>
          </div>

          <div className="demo-grid demo-grid--2">
            <div className="demo-card">
              <h3>ProgressBar (Default)</h3>
              <ProgressBar
                value={65}
                leftLabel="65% oppnådd"
                rightLabel="650 000 / 1 000 000 kr"
              />
            </div>
            <div className="demo-card">
              <h3>ProgressBar (Gold)</h3>
              <ProgressBar
                value={100}
                variant="gold"
                leftLabel="Fullført!"
              />
            </div>
          </div>
        </section>

        {/* UI Components Section */}
        <section className="demo-section">
          <h2 className="demo-section__title">UI Components</h2>

          <div className="demo-grid demo-grid--4">
            <div className="demo-card demo-card--center">
              <h3>Button Primary</h3>
              <Button variant="primary">Lagre</Button>
            </div>
            <div className="demo-card demo-card--center">
              <h3>Button Secondary</h3>
              <Button variant="secondary">Avbryt</Button>
            </div>
            <div className="demo-card demo-card--center">
              <h3>Button with Icon</h3>
              <Button icon="+">Ny måned</Button>
            </div>
            <div className="demo-card demo-card--center">
              <h3>Button Disabled</h3>
              <Button disabled>Disabled</Button>
            </div>
          </div>

          <div className="demo-grid demo-grid--4">
            <div className="demo-card demo-card--center">
              <h3>Avatar Small</h3>
              <Avatar initials="AN" size="small" />
            </div>
            <div className="demo-card demo-card--center">
              <h3>Avatar Medium</h3>
              <Avatar initials="AN" size="medium" />
            </div>
            <div className="demo-card demo-card--center">
              <h3>Avatar Large</h3>
              <Avatar initials="AN" size="large" />
            </div>
            <div className="demo-card demo-card--center">
              <h3>Card</h3>
              <Card>Card content</Card>
            </div>
          </div>

          <div className="demo-grid demo-grid--3">
            <div className="demo-card">
              <h3>Skeleton (Text)</h3>
              <Skeleton variant="text" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
            </div>
            <div className="demo-card demo-card--center">
              <h3>Skeleton (Circular)</h3>
              <Skeleton variant="circular" width={64} height={64} />
            </div>
            <div className="demo-card">
              <h3>Skeleton (Rectangular)</h3>
              <Skeleton variant="rectangular" height={100} />
            </div>
          </div>
        </section>

        {/* Calculator Cards Section */}
        <section className="demo-section">
          <h2 className="demo-section__title">Calculator Cards</h2>

          <div className="demo-grid demo-grid--4">
            <CalculatorCard
              title="Renters rente"
              description="Se hvordan sparepengene dine vokser over tid"
              icon="trending_up"
              href="/calculators/compound"
            />
            <CalculatorCard
              title="F.I.R.E."
              description="Beregn tid til økonomisk uavhengighet"
              icon="local_fire_department"
              href="/calculators/fire"
            />
            <CalculatorCard
              title="Lånekalkulator"
              description="Månedlige kostnader og total rente"
              icon="home"
              href="/calculators/loan"
            />
            <CalculatorCard
              title="Monte Carlo"
              description="Simuler ulike pensjonsscenarier"
              icon="casino"
              href="/calculators/monte-carlo"
            />
          </div>
        </section>

        {/* System Components Section */}
        <section className="demo-section">
          <h2 className="demo-section__title">System Components</h2>

          <div className="demo-card">
            <h3>Toast Notifications</h3>
            <p className="demo-description">Click buttons to trigger toasts:</p>
            <ToastDemo />
          </div>
        </section>

        {/* Container Demo */}
        <section className="demo-section">
          <h2 className="demo-section__title">Container Widths</h2>

          <Container width="wide">
            <div className="demo-container-box">
              <code>wide</code>
            </div>
          </Container>

          <Container width="default">
            <div className="demo-container-box">
              <code>default</code>
            </div>
          </Container>

          <Container width="narrow">
            <div className="demo-container-box">
              <code>narrow</code>
            </div>
          </Container>
        </section>
      </div>
    </ToastProvider>
  ),
};

/**
 * Dashboard Layout
 *
 * Components arranged as they would appear on the dashboard page.
 */
export const DashboardLayout: Story = {
  render: () => (
    <div className="demo-page demo-page--dashboard">
      <Container width="wide">
        <h1 style={{ fontFamily: "Cormorant Garamond", fontWeight: 300, margin: 0 }}>God morgen, Anders</h1>
        <p style={{ color: "var(--text-secondary)", margin: "4px 0 0" }}>November 2024</p>

        <div className="demo-hero">
          <HeroNumber
            label="Netto formue"
            value="1 234 567 kr"
            change={2.33}
            changeLabel="denne måneden"
          />
        </div>

        <div className="demo-grid demo-grid--4">
          <StatCard value="970 194 kr" label="Sum sparing" onClick={() => {}} />
          <StatCard value="-456 789 kr" label="Sum gjeld" onClick={() => {}} />
          <StatCard value="125 000 kr" label="Pensjon" onClick={() => {}} />
          <StatCard value="42,5%" label="Sparerate" onClick={() => {}} />
        </div>

        <div className="demo-grid demo-grid--1" style={{ marginTop: 32 }}>
          <MilestoneCard
            label="Neste milepæl"
            target={1500000}
            current={1234567}
          />
        </div>

        <div className="demo-grid demo-grid--3" style={{ marginTop: 32 }}>
          <SectionLink
            title="Portefølje"
            subtitle="Detaljert oversikt over alle kontoer"
            href="/portfolio"
          />
          <SectionLink
            title="Sparing & F.I.R.E."
            subtitle="Din vei mot økonomisk frihet"
            href="/sparing"
          />
          <SectionLink
            title="Kalkulatorer"
            subtitle="Planlegg din finansielle fremtid"
            href="/calculators"
          />
        </div>
      </Container>
    </div>
  ),
};

/**
 * Forms Layout
 *
 * Form components in a realistic settings/input context.
 */
export const FormsLayout: Story = {
  render: () => (
    <ToastProvider>
      <div className="demo-page">
        <Container width="narrow">
          <h1 style={{ fontFamily: "Cormorant Garamond", fontWeight: 300, margin: 0 }}>Min informasjon</h1>
          <p style={{ color: "var(--text-secondary)", margin: "4px 0 0" }}>Oppdater din profil og innstillinger</p>

          <Card>
            <div className="demo-form">
              <div className="demo-form__section">
                <h3>Inntekt og utgifter</h3>
                <NumberInput
                  label="Månedlig inntekt"
                  value={65000}
                  onChange={() => {}}
                  suffix="kr"
                />
                <NumberInput
                  label="Månedlig sparing"
                  value={15000}
                  onChange={() => {}}
                  suffix="kr"
                />
                <NumberInput
                  label="Årlige utgifter"
                  value={420000}
                  onChange={() => {}}
                  suffix="kr"
                />
              </div>

              <div className="demo-form__section">
                <h3>F.I.R.E. mål</h3>
                <NumberInput
                  label="F.I.R.E. tall"
                  value={10500000}
                  onChange={() => {}}
                  suffix="kr"
                />
                <p className="demo-form__hint">
                  Standard er 25 ganger årlige utgifter
                </p>
              </div>

              <div className="demo-form__section">
                <h3>Fremgang</h3>
                <ProgressBar
                  value={11.8}
                  leftLabel="11,8% av F.I.R.E. mål"
                  rightLabel="1 234 567 / 10 500 000 kr"
                />
              </div>

              <div className="demo-form__actions">
                <Button variant="secondary">Avbryt</Button>
                <Button variant="primary">Lagre endringer</Button>
              </div>
            </div>
          </Card>
        </Container>
      </div>
    </ToastProvider>
  ),
};
