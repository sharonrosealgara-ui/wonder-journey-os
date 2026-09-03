-- 0007_harden_inquiries_schema_and_rls.sql
-- Hardens public inquiries table and establishes database-level submission gate

-- 1. Add consent evidence columns to public.inquiries (nullable for historical records)
ALTER TABLE public.inquiries 
    ADD COLUMN IF NOT EXISTS privacy_acknowledged boolean DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS privacy_notice_version text DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS consent_timestamp timestamp with time zone DEFAULT NULL;

-- 2. Drop legacy unrestricted table insertion policy
DROP POLICY IF EXISTS "Public can submit inquiries" ON public.inquiries;

-- 3. Revoke direct table INSERT permissions completely from anon, authenticated, and public
REVOKE INSERT ON TABLE public.inquiries FROM anon, authenticated, public;

-- 4. Create protected configuration table in private schema
CREATE SCHEMA IF NOT EXISTS private;

CREATE TABLE IF NOT EXISTS private.inquiry_configuration (
    id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
    enabled boolean NOT NULL DEFAULT false,
    approved_privacy_notice_version text DEFAULT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Initial production state must remain disabled
INSERT INTO private.inquiry_configuration (id, enabled, approved_privacy_notice_version)
VALUES (true, false, NULL)
ON CONFLICT (id) DO NOTHING;

-- Revoke all permissions on configuration table
REVOKE ALL ON TABLE private.inquiry_configuration FROM PUBLIC, anon, authenticated;

-- 5. Create secure allowlisted submission RPC
CREATE OR REPLACE FUNCTION public.submit_inquiry(
    p_full_name text,
    p_email text,
    p_whatsapp_number text DEFAULT NULL,
    p_country text DEFAULT NULL,
    p_learner_ages text DEFAULT NULL,
    p_message text DEFAULT NULL,
    p_contact_consent boolean DEFAULT false,
    p_privacy_acknowledged boolean DEFAULT false,
    p_privacy_notice_version text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'pg_catalog'
AS $$
DECLARE
    v_cfg record;
    v_inquiry_id uuid;
    v_email_clean text;
BEGIN
    -- 1. Database-level submission gate check
    SELECT enabled, approved_privacy_notice_version INTO v_cfg
    FROM private.inquiry_configuration
    WHERE id = true;

    -- Fail closed immediately if configuration record is missing or disabled
    IF NOT FOUND OR v_cfg.enabled IS NOT TRUE THEN
        RAISE EXCEPTION 'Inquiry submissions are currently closed.';
    END IF;

    -- Reject if approved privacy notice version is missing or is draft
    IF v_cfg.approved_privacy_notice_version IS NULL 
       OR length(trim(v_cfg.approved_privacy_notice_version)) = 0
       OR lower(v_cfg.approved_privacy_notice_version) LIKE '%draft%' THEN
        RAISE EXCEPTION 'Inquiry submissions are currently closed.';
    END IF;

    -- Require submitted notice version to match database approved version exactly
    IF p_privacy_notice_version IS NULL 
       OR p_privacy_notice_version <> v_cfg.approved_privacy_notice_version THEN
        RAISE EXCEPTION 'Inquiry submissions are currently closed.';
    END IF;

    -- 2. Validate consents
    IF p_contact_consent IS NOT TRUE THEN
        RAISE EXCEPTION 'Contact consent is required.';
    END IF;

    IF p_privacy_acknowledged IS NOT TRUE THEN
        RAISE EXCEPTION 'Privacy notice acknowledgment is required.';
    END IF;

    -- 3. Explicit NULL checks and input validation before string functions
    IF p_full_name IS NULL OR length(trim(p_full_name)) < 1 OR length(p_full_name) > 100 THEN
        RAISE EXCEPTION 'Full name must be between 1 and 100 characters.';
    END IF;

    IF p_email IS NULL THEN
        RAISE EXCEPTION 'A valid email address is required.';
    END IF;

    v_email_clean := trim(lower(p_email));
    IF length(v_email_clean) < 5 OR length(v_email_clean) > 120 
       OR v_email_clean !~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
        RAISE EXCEPTION 'A valid email address is required.';
    END IF;

    IF p_country IS NULL OR length(trim(p_country)) < 1 OR length(p_country) > 80 THEN
        RAISE EXCEPTION 'Country or timezone must be between 1 and 80 characters.';
    END IF;

    IF p_whatsapp_number IS NOT NULL AND length(p_whatsapp_number) > 30 THEN
        RAISE EXCEPTION 'WhatsApp number cannot exceed 30 characters.';
    END IF;

    IF p_learner_ages IS NOT NULL AND length(p_learner_ages) > 60 THEN
        RAISE EXCEPTION 'Learner age range cannot exceed 60 characters.';
    END IF;

    IF p_message IS NOT NULL AND length(p_message) > 1000 THEN
        RAISE EXCEPTION 'Message cannot exceed 1000 characters.';
    END IF;

    -- 4. Atomic insert enforcing server-controlled canonical values
    INSERT INTO public.inquiries (
        full_name,
        email,
        whatsapp_number,
        country,
        learner_ages,
        message,
        interested_service,
        client_type,
        status,
        consent_given,
        privacy_acknowledged,
        privacy_notice_version,
        consent_timestamp,
        assigned_to,
        internal_notes,
        follow_up_at,
        archived_at,
        created_at,
        updated_at
    ) VALUES (
        trim(p_full_name),
        v_email_clean,
        trim(p_whatsapp_number),
        trim(p_country),
        trim(p_learner_ages),
        trim(p_message),
        'Founder-Led Family Learning',
        'Family / Parent',
        'new',
        true,
        true,
        v_cfg.approved_privacy_notice_version,
        timezone('utc'::text, now()),
        NULL,
        NULL,
        NULL,
        NULL,
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    ) RETURNING id INTO v_inquiry_id;

    RETURN pg_catalog.jsonb_build_object('success', true, 'id', v_inquiry_id);
END;
$$;

-- 6. Grant least privilege: Revoke from PUBLIC, grant EXECUTE only to anon
REVOKE ALL ON FUNCTION public.submit_inquiry(text, text, text, text, text, text, boolean, boolean, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_inquiry(text, text, text, text, text, text, boolean, boolean, text) TO anon;
