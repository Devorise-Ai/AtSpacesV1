import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setToken, setUser } from '../lib/token';
import type { StoredUser } from '../lib/token';
import { Loader2 } from 'lucide-react';

/**
 * Landing page for Google OAuth callback.
 * Backend redirects here after Google auth with ?token=...&user=...
 * We store the credentials and redirect to /dashboard.
 */
export default function AuthCallback() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = params.get('token');
        const userRaw = params.get('user');

        if (token && userRaw) {
            try {
                const user: StoredUser = JSON.parse(decodeURIComponent(userRaw));
                setToken(token);
                setUser(user);
                navigate('/dashboard', { replace: true });
            } catch {
                // Malformed data — go home
                navigate('/', { replace: true });
            }
        } else {
            // No credentials — go home
            navigate('/', { replace: true });
        }
    }, [navigate, params]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-deep)',
            gap: '1rem',
            color: 'var(--text-secondary)',
        }}>
            <Loader2 size={36} color="var(--primary)" style={{ animation: 'spin 0.9s linear infinite' }} />
            <p style={{ fontSize: '1rem' }}>Signing you in with Google…</p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
