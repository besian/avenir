'use client';

import Link from 'next/link';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { LogoMark } from '../Logo';
import { fb } from '@/lib/firebase/client';
import { firebaseConfigured } from '@/lib/firebase/config';
import { isAdmin } from '@/lib/admin/api';

interface AdminCtx {
  user: User;
  toast: (msg: string) => void;
}
const Ctx = createContext<AdminCtx | null>(null);
export const useAdmin = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAdmin outside AdminShell');
  return c;
};

type State = { kind: 'loading' } | { kind: 'signedOut' } | { kind: 'noAccess'; user: User } | { kind: 'admin'; user: User } | { kind: 'error'; msg: string };

export function AdminShell({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ kind: firebaseConfigured ? 'loading' : 'error', msg: '' });
  const [toastMsg, setToastMsg] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const toast = useCallback((msg: string) => {
    clearTimeout(timer.current);
    setToastMsg(msg);
    timer.current = setTimeout(() => setToastMsg(''), 3000);
  }, []);

  useEffect(() => {
    if (!firebaseConfigured) return;
    return onAuthStateChanged(fb().auth, async (user) => {
      if (!user) return setState({ kind: 'signedOut' });
      setState({ kind: 'loading' });
      try {
        setState((await isAdmin(user.uid)) ? { kind: 'admin', user } : { kind: 'noAccess', user });
      } catch {
        // Rules deny reading another user's admin doc, and a non-admin has none → treat as no access.
        setState({ kind: 'noAccess', user });
      }
    });
  }, []);

  let body: ReactNode;
  if (!firebaseConfigured) body = <SetupNeeded />;
  else if (state.kind === 'loading') body = <p className="adm-muted adm-center">Loading…</p>;
  else if (state.kind === 'signedOut') body = <SignIn />;
  else if (state.kind === 'noAccess') body = <NoAccess user={state.user} />;
  else if (state.kind === 'admin') body = <Ctx.Provider value={{ user: state.user, toast }}>{children}</Ctx.Provider>;

  const user = state.kind === 'admin' || state.kind === 'noAccess' ? state.user : null;

  return (
    <div className="adm">
      <header className="adm-bar">
        <div className="adm-wrap adm-bar__in">
          <Link href="/admin" className="logo" aria-label="Admin home">
            <LogoMark />
          </Link>
          <span className="adm-badge">Admin</span>
          <span className="spacer" />
          <Link href="/" className="adm-link" target="_blank">
            View site ↗
          </Link>
          {user && (
            <>
              <span className="adm-muted adm-hide-sm">{user.email}</span>
              <button type="button" className="adm-link" onClick={() => signOut(fb().auth)}>
                Sign out
              </button>
            </>
          )}
        </div>
      </header>
      <main className="adm-wrap adm-main">{body}</main>
      {toastMsg && (
        <div role="status" className="toast">
          {toastMsg}
        </div>
      )}
    </div>
  );
}

function SignIn() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await signInWithEmailAndPassword(fb().auth, email.trim(), pw);
    } catch (e) {
      const code = (e as { code?: string }).code ?? '';
      setErr(
        code === 'auth/too-many-requests'
          ? 'Too many attempts. Wait a few minutes or reset your password.'
          : /invalid|wrong-password|user-not-found/.test(code)
            ? 'That email and password don’t match an admin account.'
            : 'Couldn’t sign in. Check your connection and try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    setErr('');
    if (!email.trim()) return setErr('Enter your email above first.');
    try {
      await sendPasswordResetEmail(fb().auth, email.trim());
    } catch {
      /* don't reveal whether the account exists */
    }
    setNote('If that email has an account, a reset link is on its way.');
  };

  return (
    <form className="adm-card adm-signin" onSubmit={submit}>
      <h1 className="adm-h1">Sign in</h1>
      <p className="adm-muted">Manage the homes listed on the Avenir Housing website.</p>
      <label className="field">
        <span className="field__label">Email</span>
        <input className="input" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="field">
        <span className="field__label">Password</span>
        <input className="input" type="password" autoComplete="current-password" required value={pw} onChange={(e) => setPw(e.target.value)} />
      </label>
      {err && <p className="adm-error" role="alert">{err}</p>}
      {note && <p className="adm-note" role="status">{note}</p>}
      <button type="submit" className="btn btn--primary btn--block" aria-disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
      <button type="button" className="link-btn" style={{ alignSelf: 'flex-start', fontSize: 14 }} onClick={reset}>
        Forgot password?
      </button>
    </form>
  );
}

function NoAccess({ user }: { user: User }) {
  return (
    <div className="adm-card adm-signin">
      <h1 className="adm-h1">No admin access</h1>
      <p>
        You’re signed in as <strong>{user.email}</strong>, but this account isn’t on the admin list yet.
      </p>
      <p className="adm-muted">
        Ask an existing admin to add you. In the Firebase console, create a document in the <code>admins</code> collection
        with this ID:
      </p>
      <code className="adm-code">{user.uid}</code>
      <button type="button" className="btn btn--outline btn--md" onClick={() => signOut(fb().auth)}>
        Sign out
      </button>
    </div>
  );
}

function SetupNeeded() {
  return (
    <div className="adm-card adm-signin" style={{ maxWidth: 640 }}>
      <h1 className="adm-h1">Connect Firebase to use admin</h1>
      <p>
        The site is showing the sample homes because Firebase isn’t configured. Add the <code>NEXT_PUBLIC_FIREBASE_*</code>{' '}
        values from your Firebase project to the environment (see <code>.env.example</code> and the README), then redeploy.
      </p>
    </div>
  );
}
