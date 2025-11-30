import { useState, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import client from '../../shared/api/client';

export default function OnboardingPage() {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const setupUserMutation = useMutation({
    mutationFn: async (nickname: string) => {
      const response = await client.post('/users/me/setup', { nickname });
      return response.data;
    },
    onSuccess: () => {
      // Reload the page to refresh auth state
      window.location.href = '/dashboard';
    },
    onError: (error: any) => {
      if (error.response?.data?.error?.message) {
        setError(error.response.data.error.message);
      } else {
        setError('Noe gikk galt. Prøv igjen.');
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate nickname
    const nicknameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!nicknameRegex.test(nickname)) {
      setError('Brukernavnet må være 3-20 tegn og kan kun inneholde bokstaver, tall og understrek');
      return;
    }

    setupUserMutation.mutate(nickname);
  };

  return (
    <div className="middle-align center-align">
      <div className="page padding">
        <div className="row">
          <div className="max center-align">
            <h2 className="large-text">Velg brukernavn</h2>
            <p>Velg et unikt brukernavn for å fortsette</p>

            <div className="space"></div>

            <form onSubmit={handleSubmit}>
              <div className="field label border">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="brukernavn"
                  pattern="[a-zA-Z0-9_]{3,20}"
                  required
                  disabled={setupUserMutation.isPending}
                />
                <label>Brukernavn</label>
              </div>

              {error && (
                <div className="error-text small-text">
                  <i className="material-icons">error</i>
                  <span>{error}</span>
                </div>
              )}

              <div className="space"></div>

              <button
                type="submit"
                className="button large-elevate"
                disabled={setupUserMutation.isPending || !nickname}
              >
                {setupUserMutation.isPending ? (
                  <>
                    <progress className="circle small"></progress>
                    <span>Oppretter...</span>
                  </>
                ) : (
                  <span>Fortsett</span>
                )}
              </button>
            </form>

            <div className="space"></div>

            <p className="small-text">
              Brukernavnet kan inneholde bokstaver, tall og understrek (3-20 tegn)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
