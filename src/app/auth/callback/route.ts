import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAppUrl } from '@/lib/url';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  // Do not trust an arbitrary `next` query parameter.
  // We only allow explicitly approved internal paths.
  const rawNext = searchParams.get('next') || '/';
  
  // Allowlist of approved redirect destinations
  const allowedNextPaths = ['/reset-password'];
  
  // Reject absolute URLs, protocol-relative, javascript, etc.
  const isSafePath = rawNext.startsWith('/') && !rawNext.startsWith('//') && allowedNextPaths.includes(rawNext);
  const next = isSafePath ? rawNext : '/reset-password';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch (error) {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing user sessions.
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const response = NextResponse.redirect(new URL(next, getAppUrl()));
      
      // If they are heading to reset-password, establish a short-lived secure recovery state.
      if (next === '/reset-password') {
        response.cookies.set('recovery_marker', 'true', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 15 * 60, // 15 minutes
          path: '/',
        });
      }
      
      return response;
    }
    
    // If the exchange failed (e.g., code expired or already used)
    return NextResponse.redirect(new URL('/login?error=recovery_link_invalid', getAppUrl()));
  }

  // Missing code
  return NextResponse.redirect(new URL('/login?error=recovery_code_missing', getAppUrl()));
}
