import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from '@/components/BottomSheet';
import { Icon } from '@/components/Icon';
import { createDiagnosticSession, listDiagnosticQuestions } from '@/services/endpoints';
import { useAppStore } from '@/store/useAppStore';
import { useAsync } from '@/store/useAsync';
import type { DiagnosticSession } from '@/types';

export function DiagnosticPage() {
  const navigate = useNavigate();
  const { categories, household, applySuggestion, confirmCategory } = useAppStore();
  const questions = useAsync(listDiagnosticQuestions, []);

  const [description, setDescription] = useState('');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [session, setSession] = useState<DiagnosticSession | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const canSubmit = description.trim().length >= 5 && !submitting;

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const result = await createDiagnosticSession({
        description: description.trim(),
        household: household?.id ?? null,
        answers: Object.entries(answers).map(([question, option]) => ({
          question: Number(question),
          option,
        })),
      });
      setSession(result);
      applySuggestion(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos generar la sugerencia.');
    } finally {
      setSubmitting(false);
    }
  }

  const suggestion = session?.suggested_category ?? null;

  return (
    <div className="screen">
      <div className="back-row">
        <button type="button" className="icon-btn" onClick={() => navigate('/')} aria-label="Volver">
          <Icon name="back" strokeWidth={2.1} />
        </button>
        <div className="title">Cuéntanos qué pasa</div>
      </div>

      <div className="screen-scroll">
        <div className="diag-intro">
          <p>
            Describe el problema con tus palabras. Te haremos un par de preguntas para sugerir
            el servicio adecuado.
          </p>
        </div>

        <textarea
          className="diag-input"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Ej: tengo humedad en una pared de la sala…"
        />

        {questions.loading && <p className="state-msg">Cargando preguntas…</p>}
        {questions.error && <p className="state-msg error">{questions.error}</p>}

        {questions.data?.map((question) => (
          <div className="q-block" key={question.id}>
            <p className="q-title">{question.text}</p>
            <div className="option-list">
              {question.options.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={`option-row${answers[question.id] === option.id ? ' on' : ''}`}
                  onClick={() =>
                    setAnswers((current) => ({ ...current, [question.id]: option.id }))
                  }
                >
                  <div className="radio" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        {error && <p className="state-msg error">{error}</p>}

        {!session && (
          <button type="button" className="primary-btn" disabled={!canSubmit} onClick={submit}>
            {submitting ? 'Analizando…' : 'Ver servicio sugerido'}
          </button>
        )}

        {session && (
          <div className="suggest-card">
            <div className="tag">
              <span className="dot" />
              SERVICIO SUGERIDO
            </div>

            {suggestion ? (
              <>
                <div className="result-row">
                  <div className="result-icon">
                    <Icon name={suggestion.icon_key} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3>{suggestion.name}</h3>
                    <p>{session.rationale}</p>
                  </div>
                </div>
                <p className="note">
                  Esta es una recomendación del sistema (confianza{' '}
                  {Math.round(session.confidence * 100)}%). Tú decides con qué profesional
                  avanzar: puedes confirmarla o elegir otro servicio.
                </p>
                <button
                  type="button"
                  className="primary-btn red"
                  onClick={() => {
                    confirmCategory(suggestion);
                    navigate('/mapa');
                  }}
                >
                  Confirmar y ver profesionales
                </button>
              </>
            ) : (
              <p className="note">{session.rationale}</p>
            )}

            <button type="button" className="ghost-btn" onClick={() => setSheetOpen(true)}>
              Elegir otro servicio
            </button>
          </div>
        )}
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Elegir servicio"
        subtitle={
          suggestion ? (
            <>
              El sistema sugirió <b>{suggestion.name}</b>. Puedes confirmarlo o elegir otra
              categoría.
            </>
          ) : (
            'Elige la categoría que mejor describe tu necesidad.'
          )
        }
      >
        <div className="option-list">
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={`option-row${category.id === suggestion?.id ? ' on' : ''}`}
              onClick={() => {
                confirmCategory(category);
                setSheetOpen(false);
                navigate('/mapa');
              }}
            >
              <div className="radio" />
              {category.name}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
