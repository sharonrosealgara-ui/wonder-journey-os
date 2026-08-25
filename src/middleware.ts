import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public paths — accessible without authentication
  const isPublicPath =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.match(/\.(.*)$/)

  if (isPublicPath) {
    // If logged in and visiting /login, redirect to their role-based home
    if (user && pathname.startsWith('/login')) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role === 'teacher' || profile?.role === 'family') {
        const url = request.nextUrl.clone()
        url.pathname = profile.role === 'teacher' ? '/teacher' : '/family'
        return NextResponse.redirect(url)
      }
      // If profile missing/invalid, let them stay on login (they can re-authenticate)
    }
    return supabaseResponse
  }

  // Private paths — require authentication
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Fetch role — fail-closed
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  // If profile is missing or role is invalid, deny access
  if (!profile || (profile.role !== 'teacher' && profile.role !== 'family')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('error', 'Account not configured')
    return NextResponse.redirect(url)
  }

  // Route protection: family cannot access teacher-only routes (/teacher, /prep-email)
  const isTeacherOnlyRoute = pathname.startsWith('/teacher') || pathname.startsWith('/prep-email')
  if (isTeacherOnlyRoute && profile.role !== 'teacher') {
    const url = request.nextUrl.clone()
    url.pathname = '/family'
    return NextResponse.redirect(url)
  }

  // Teacher IS allowed to access /family and learner experiences

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
