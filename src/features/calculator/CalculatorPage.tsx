import UserInfo from '../auth/UserInfo';
import RentesrenteKalkulator from './RentesrenteKalkulator';

export default function CalculatorPage() {
  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <UserInfo />
      <RentesrenteKalkulator />
    </main>
  );
}
