import React, { useState } from 'react';
import { Sparkles, Heart, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AVATARS = ['👑', '🎀', '🌸', '🍓', '🐱', '✨', '🧸', '🪞'];
const GREETINGS = ['princess', 'queen', 'darling', 'sweetheart'];

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState('👑');
  const [preferredGreeting, setPreferredGreeting] = useState('princess');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        showToast('Welcome back, lovely! ✨🌸', 'success');
      } else {
        await register(name, email, password, avatar, preferredGreeting);
        showToast('Welcome to PennyWise, princess! ✨💖', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Authentication error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative cute floating stickers */}
      <div
        style={{
          position: 'absolute',
          top: '12%',
          left: '10%',
          fontSize: '2.5rem',
          opacity: 0.7,
          filter: 'drop-shadow(0 4px 10px rgba(220, 211, 255, 0.5))',
        }}
        className="floating-badge"
      >
        🌸
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '12%',
          fontSize: '2.2rem',
          opacity: 0.6,
        }}
        className="floating-badge"
      >
        🎀
      </div>
      <div
        style={{
          position: 'absolute',
          top: '16%',
          right: '12%',
          fontSize: '2.4rem',
          opacity: 0.7,
        }}
        className="floating-badge"
      >
        ✨
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '18%',
          right: '10%',
          fontSize: '2.2rem',
          opacity: 0.6,
        }}
        className="floating-badge"
      >
        🍰
      </div>

      <div
        className="cute-card"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '38px 32px',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--color-lavender)',
          boxShadow: 'var(--shadow-lg)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-lavender) 0%, var(--color-blush-pink) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              margin: '0 auto 14px auto',
              boxShadow: '0 8px 20px rgba(220, 211, 255, 0.5)',
            }}
          >
            🌸
          </div>
          <h1
            style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              color: 'var(--color-deep-plum)',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            PennyWise <Sparkles size={20} color="var(--color-muted-purple)" className="sparkle-icon" />
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-plum-subtle)', fontWeight: 500 }}>
            {isLogin
              ? 'Welcome back to your mindful financial sanctuary ✨'
              : 'Begin your journey to financial softness & sparkle 💖'}
          </p>
        </div>

        {/* Tab switch */}
        <div
          style={{
            display: 'flex',
            background: 'var(--color-cream)',
            padding: '5px',
            borderRadius: 'var(--radius-full)',
            marginBottom: '26px',
            border: '1px solid var(--color-lavender)',
          }}
        >
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: isLogin ? 'var(--color-white)' : 'transparent',
              color: isLogin ? 'var(--color-deep-plum)' : 'var(--color-plum-subtle)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: isLogin ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Sign In 🌸
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: !isLogin ? 'var(--color-white)' : 'transparent',
              color: !isLogin ? 'var(--color-deep-plum)' : 'var(--color-plum-subtle)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: !isLogin ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Register ✨
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              {/* Name */}
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={18}
                    color="var(--color-muted-purple)"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Princess Jasmine 👑"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              {/* Avatar Picker */}
              <div className="form-group">
                <label className="form-label">Pick Your Cute Avatar</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {AVATARS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setAvatar(emoji)}
                      style={{
                        fontSize: '1.25rem',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: avatar === emoji ? '2px solid var(--color-muted-purple)' : '1px solid rgba(220, 211, 255, 0.6)',
                        background: avatar === emoji ? 'var(--color-lavender-light)' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Greeting */}
              <div className="form-group">
                <label className="form-label">Preferred Title</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {GREETINGS.map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setPreferredGreeting(g)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        border: preferredGreeting === g ? '2px solid var(--color-muted-purple)' : '1px solid rgba(220, 211, 255, 0.6)',
                        background: preferredGreeting === g ? 'var(--color-blush-pink)' : '#ffffff',
                        color: 'var(--color-deep-plum)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                color="var(--color-muted-purple)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="email"
                required
                placeholder="princess@sparkle.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                color="var(--color-muted-purple)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-plum-subtle)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '12px' }}
          >
            <Sparkles size={18} />
            <span>
              {loading
                ? 'Sprinkling magic...'
                : isLogin
                ? 'Sign In to PennyWise ✨'
                : 'Create My Cute Account 💖'}
            </span>
          </button>
        </form>

        {/* Motivational note */}
        <div style={{ textAlign: 'center', marginTop: '22px' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-plum-subtle)', fontStyle: 'italic' }}>
            "Little steps today, bigger dreams tomorrow." 🌸
          </p>
        </div>
      </div>
    </div>
  );
};
