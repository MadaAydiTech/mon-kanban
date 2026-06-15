import { useEffect, useMemo, useState } from 'react';

export default function PomodoroTimer() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);

  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedWorkSessions, setCompletedWorkSessions] = useState(0);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timeout = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft > 0) return;

    if (mode === 'work') {
      const nextCount = completedWorkSessions + 1;
      setCompletedWorkSessions(nextCount);

      if (nextCount % 4 === 0) {
        setMode('long');
        setTimeLeft(longBreakMinutes * 60);
      } else {
        setMode('short');
        setTimeLeft(shortBreakMinutes * 60);
      }
    } else {
      setMode('work');
      setTimeLeft(workMinutes * 60);
    }

    setIsRunning(false);
  }, [timeLeft, mode, completedWorkSessions, workMinutes, shortBreakMinutes, longBreakMinutes]);

  function formatTime(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function resetTimer() {
    setIsRunning(false);

    if (mode === 'work') setTimeLeft(workMinutes * 60);
    if (mode === 'short') setTimeLeft(shortBreakMinutes * 60);
    if (mode === 'long') setTimeLeft(longBreakMinutes * 60);
  }

  function switchMode(newMode) {
    setIsRunning(false);
    setMode(newMode);

    if (newMode === 'work') setTimeLeft(workMinutes * 60);
    if (newMode === 'short') setTimeLeft(shortBreakMinutes * 60);
    if (newMode === 'long') setTimeLeft(longBreakMinutes * 60);
  }

  function handleWorkChange(value) {
    const minutes = Number(value);
    setWorkMinutes(minutes);
    if (mode === 'work') setTimeLeft(minutes * 60);
  }

  function handleShortBreakChange(value) {
    const minutes = Number(value);
    setShortBreakMinutes(minutes);
    if (mode === 'short') setTimeLeft(minutes * 60);
  }

  function handleLongBreakChange(value) {
    const minutes = Number(value);
    setLongBreakMinutes(minutes);
    if (mode === 'long') setTimeLeft(minutes * 60);
  }

  const modeLabel =
    mode === 'work' ? 'Focus' : mode === 'short' ? 'Pause courte' : 'Pause longue';

  const totalSeconds = useMemo(() => {
    if (mode === 'work') return workMinutes * 60;
    if (mode === 'short') return shortBreakMinutes * 60;
    return longBreakMinutes * 60;
  }, [mode, workMinutes, shortBreakMinutes, longBreakMinutes]);

  const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        gap: '20px',
        alignItems: 'stretch',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.82)',
          border: '1px solid rgba(15, 23, 42, 0.06)',
          borderRadius: '32px',
          padding: '28px',
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '28px',
              padding: '0 10px',
              borderRadius: '999px',
              background: 'rgba(245,245,247,0.95)',
              border: '1px solid rgba(15, 23, 42, 0.05)',
              color: '#8E8E93',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Focus timer
          </div>

          <h2
            style={{
              margin: 0,
              color: '#111111',
              fontSize: '1.5rem',
              fontWeight: 700,
              letterSpacing: '-0.04em',
            }}
          >
            Pomodoro
          </h2>

          <p
            style={{
              marginTop: '8px',
              color: '#6E6E73',
              fontSize: '0.98rem',
              lineHeight: 1.6,
            }}
          >
            Alternez périodes de concentration et pauses dans une interface simple et calme.
          </p>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px',
            borderRadius: '999px',
            background: 'rgba(245,245,247,0.92)',
            border: '1px solid rgba(15, 23, 42, 0.05)',
            flexWrap: 'wrap',
            alignSelf: 'flex-start',
          }}
        >
          <button onClick={() => switchMode('work')} style={segmentStyle(mode === 'work')}>
            Focus
          </button>
          <button onClick={() => switchMode('short')} style={segmentStyle(mode === 'short')}>
            Pause courte
          </button>
          <button onClick={() => switchMode('long')} style={segmentStyle(mode === 'long')}>
            Pause longue
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '320px',
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              background: `conic-gradient(#111111 ${progress}%, rgba(15,23,42,0.08) ${progress}% 100%)`,
              padding: '14px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
            }}
          >
            <div
              role="timer"
              aria-atomic="true"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,248,250,0.96))',
                border: '1px solid rgba(15, 23, 42, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 16px 36px rgba(15, 23, 42, 0.08)',
                textAlign: 'center',
                padding: '24px',
              }}
            >
              <span
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#8E8E93',
                  marginBottom: '12px',
                }}
              >
                {modeLabel}
              </span>

              <div
                style={{
                  fontSize: 'clamp(2.8rem, 7vw, 4.8rem)',
                  fontWeight: 800,
                  color: '#111111',
                  letterSpacing: '-0.08em',
                  lineHeight: 1,
                }}
              >
                {formatTime(timeLeft)}
              </div>

              <div
                style={{
                  marginTop: '14px',
                  fontSize: '0.95rem',
                  color: '#6E6E73',
                }}
              >
                {isRunning ? 'Session en cours' : 'Prêt à démarrer'}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <button onClick={() => setIsRunning(true)} style={primaryButtonStyle}>
            Démarrer
          </button>

          <button onClick={() => setIsRunning(false)} style={secondaryButtonStyle}>
            Pause
          </button>

          <button onClick={resetTimer} style={ghostButtonStyle}>
            Réinitialiser
          </button>
        </div>
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.78)',
          border: '1px solid rgba(15, 23, 42, 0.06)',
          borderRadius: '32px',
          padding: '28px',
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              color: '#111111',
              fontSize: '1.2rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
            }}
          >
            Réglages
          </h3>

          <p
            style={{
              marginTop: '8px',
              color: '#6E6E73',
              fontSize: '0.95rem',
              lineHeight: 1.6,
            }}
          >
            Ajustez la durée des sessions selon votre rythme de concentration.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
          }}
        >
          <label style={labelStyle}>
            Focus (min)
            <input
              type="number"
              min="1"
              max="120"
              value={workMinutes}
              onChange={(e) => handleWorkChange(e.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Pause courte (min)
            <input
              type="number"
              min="1"
              max="60"
              value={shortBreakMinutes}
              onChange={(e) => handleShortBreakChange(e.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Pause longue (min)
            <input
              type="number"
              min="1"
              max="90"
              value={longBreakMinutes}
              onChange={(e) => handleLongBreakChange(e.target.value)}
              style={inputStyle}
            />
          </label>
        </div>

        <div
          style={{
            height: '1px',
            background:
              'linear-gradient(90deg, rgba(15,23,42,0), rgba(15,23,42,0.08), rgba(15,23,42,0))',
          }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px',
          }}
        >
          <div style={statCardStyle}>
            <span style={statLabelStyle}>Mode</span>
            <strong style={statValueStyle}>{modeLabel}</strong>
          </div>

          <div style={statCardStyle}>
            <span style={statLabelStyle}>Sessions terminées</span>
            <strong style={statValueStyle}>{completedWorkSessions}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function segmentStyle(active) {
  return {
    minHeight: '40px',
    padding: '0 14px',
    borderRadius: '999px',
    border: active
      ? '1px solid rgba(15, 23, 42, 0.08)'
      : '1px solid transparent',
    background: active ? 'rgba(255,255,255,0.92)' : 'transparent',
    color: active ? '#111111' : '#6E6E73',
    fontWeight: active ? 600 : 500,
    fontSize: '0.92rem',
    cursor: 'pointer',
    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.04)' : 'none',
    transition: 'all 0.2s ease',
  };
}

const primaryButtonStyle = {
  minHeight: '46px',
  padding: '0 18px',
  borderRadius: '999px',
  background: '#111111',
  color: '#ffffff',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.95rem',
  fontWeight: 600,
  boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
};

const secondaryButtonStyle = {
  minHeight: '46px',
  padding: '0 18px',
  borderRadius: '999px',
  background: 'rgba(245,245,247,0.95)',
  color: '#111111',
  border: '1px solid rgba(15, 23, 42, 0.08)',
  cursor: 'pointer',
  fontSize: '0.95rem',
  fontWeight: 600,
};

const ghostButtonStyle = {
  minHeight: '46px',
  padding: '0 18px',
  borderRadius: '999px',
  background: 'transparent',
  color: '#6E6E73',
  border: '1px solid rgba(15, 23, 42, 0.08)',
  cursor: 'pointer',
  fontSize: '0.95rem',
  fontWeight: 600,
};

const labelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  color: '#111111',
  fontWeight: 600,
  fontSize: '0.9rem',
};

const inputStyle = {
  padding: '14px 16px',
  borderRadius: '14px',
  border: '1px solid rgba(15, 23, 42, 0.08)',
  background: 'rgba(255,255,255,0.92)',
  color: '#111111',
  fontSize: '0.95rem',
  outline: 'none',
};

const statCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '18px',
  borderRadius: '22px',
  background: 'rgba(250,250,252,0.92)',
  border: '1px solid rgba(15, 23, 42, 0.05)',
};

const statLabelStyle = {
  fontSize: '0.78rem',
  color: '#8E8E93',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

const statValueStyle = {
  fontSize: '1.1rem',
  color: '#111111',
  fontWeight: 700,
  letterSpacing: '-0.03em',
};