/**
 * TermsDialog Component
 *
 * Modal dialog with tabbed interface for Terms of Service and Privacy Policy.
 * Accessible from login screens via clickable link.
 */

import { useState } from 'react';
import './TermsDialog.css';

interface TermsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy';
}

export function TermsDialog({ isOpen, onClose, initialTab = 'terms' }: TermsDialogProps) {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="terms-dialog-overlay" onClick={onClose}>
      <div className="terms-dialog" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="terms-dialog__close"
          onClick={onClose}
          aria-label="Lukk"
        >
          ×
        </button>

        <div className="terms-dialog__tabs">
          <button
            type="button"
            className={`terms-dialog__tab ${activeTab === 'terms' ? 'terms-dialog__tab--active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            Vilkår
          </button>
          <button
            type="button"
            className={`terms-dialog__tab ${activeTab === 'privacy' ? 'terms-dialog__tab--active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Personvern
          </button>
        </div>

        <div className="terms-dialog__content">
          {activeTab === 'terms' ? <TermsContent /> : <PrivacyContent />}
        </div>
      </div>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="terms-content">
      <h2>Vilkår for bruk</h2>
      <p className="terms-updated">Sist oppdatert: Januar 2025</p>

      <h3>1. Aksept av vilkår</h3>
      <p>Ved å bruke Finans godtar du disse vilkårene. Hvis du ikke godtar vilkårene, ber vi deg om ikke å bruke tjenesten.</p>

      <h3>2. Beskrivelse av tjenesten</h3>
      <p>Finans er et verktøy for portefølje- og formuessporing som lar deg manuelt registrere og overvåke investeringer og nettoformue over tid. Tjenesten er ikke ment som finansiell rådgivning.</p>

      <h3>3. Brukerens ansvar</h3>
      <p>Du er ansvarlig for nøyaktigheten av all data du legger inn i systemet. Finans lagrer dataene du oppgir, men er ikke ansvarlig for feil eller manglende informasjon.</p>

      <h3>4. Ansvarsfraskrivelse</h3>
      <p>Finans gir ikke finansiell rådgivning, investeringsanbefalinger eller skatteveiledning. Kalkulatorer og prognoser er basert på antakelser du oppgir og er ikke garantert nøyaktige. Konsulter alltid en kvalifisert finansiell rådgiver før du tar investeringsbeslutninger.</p>

      <h3>5. Bruk av tjenesten</h3>
      <p>Du godtar å bruke Finans kun til lovlige formål. Du skal ikke forsøke å få uautorisert tilgang til systemet eller forstyrre driften.</p>

      <h3>6. Endringer av vilkår</h3>
      <p>Finans forbeholder seg retten til å endre disse vilkårene når som helst. Fortsatt bruk av tjenesten etter endringer betyr at du godtar de nye vilkårene.</p>

      <h3>7. Slettelse av konto</h3>
      <p>Du kan når som helst be om å få slettet kontoen din og all tilhørende data. Ta kontakt med støtte for å initialisere denne prosessen.</p>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="privacy-content">
      <h2>Personvernerklæring</h2>
      <p className="terms-updated">Sist oppdatert: Januar 2025</p>

      <h3>1. Hvilke data samler vi inn</h3>
      <p>Vi samler inn og lagrer:</p>
      <ul>
        <li>E-postadresse (fra OAuth-provider)</li>
        <li>Navn (fra OAuth-provider)</li>
        <li>Finansdata du manuelt legger inn (kontoer, verdier, lånedetaljer)</li>
        <li>Profilinformasjon (lønn, utgifter, planlagt pensjoneringsalder)</li>
      </ul>

      <h3>2. Hvordan bruker vi dataene</h3>
      <p>Dataene brukes kun til å:</p>
      <ul>
        <li>Levere tjenesten (lagre og vise dine porteføljedata)</li>
        <li>Beregne statistikk og prognoser</li>
        <li>Forbedre brukeropplevelsen</li>
      </ul>
      <p>Vi deler ikke dine data med tredjeparter.</p>

      <h3>3. Lagring og sikkerhet</h3>
      <p>Data lagres kryptert i Azure CosmosDB. Vi bruker HTTPS for all kommunikasjon. Du er alene ansvarlig for å holde passordet ditt sikkert.</p>

      <h3>4. Dine rettigheter</h3>
      <p>Du har rett til å:</p>
      <ul>
        <li>Eksportere all dine data</li>
        <li>Slette din konto og all tilhørende data</li>
        <li>Be om innsyn i hvilke data vi lagrer om deg</li>
      </ul>

      <h3>5. Cookies</h3>
      <p>Vi bruker cookies til autentisering og sesjonshåndtering. OAuth-provideren (Google/Facebook) kan også bruke cookies.</p>

      <h3>6. Kontakt</h3>
      <p>Hvis du har spørsmål om personvernet eller ønsker å bruke rettighetene dine, ta kontakt med oss.</p>

      <h3>7. Endringer av personvernerklæring</h3>
      <p>Finans forbeholder seg retten til å oppdatere denne erklæringen. Vi vil varsle brukere om vesentlige endringer.</p>
    </div>
  );
}
