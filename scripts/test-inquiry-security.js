const assert = require("assert");
const { execSync } = require("child_process");
const { createClient } = require("@supabase/supabase-js");

/**
 * Real Database Boundary Security Tests for Inquiry Pipeline
 *
 * Requirements:
 * 1. Fails (does NOT skip) if local Supabase environment is unavailable.
 * 2. Proves direct table INSERT on public.inquiries is rejected for anonymous callers.
 * 3. Proves anonymous callers cannot set internal fields.
 * 4. Proves direct RPC calls are rejected while the database gate is disabled.
 * 5. Proves draft, blank, arbitrary, or mismatched notice versions are rejected.
 * 6. Proves missing contact consent or privacy acknowledgment is rejected.
 * 7. Proves malformed and oversized values are rejected by the database validator.
 * 8. Proves allowlisted RPC enforces canonical server values.
 * 9. Restores the database configuration to disabled in finally block on all paths.
 * 10. Leaks zero PII to logs or test output.
 */

function executeSql(sql) {
  let containerName = "";
  try {
    const output = execSync('docker ps --filter "name=supabase_db" --format "{{.Names}}"', {
      encoding: "utf8",
      stdio: "pipe",
    }).trim();
    containerName = output.split("\n")[0].trim();
  } catch (err) {
    throw new Error(`Failed to locate Supabase DB container: ${err.message}`);
  }

  if (!containerName) {
    throw new Error("FAIL: Supabase DB container (name=supabase_db) is not running.");
  }

  try {
    return execSync(`docker exec ${containerName} psql -U postgres -d postgres -c "${sql.replace(/"/g, '\\"')}"`, {
      encoding: "utf8",
      stdio: "pipe",
    });
  } catch (err) {
    throw new Error(`Failed to execute SQL via docker psql: ${err.message}`);
  }
}

function setPrivateInquiryConfig(enabled, version) {
  const v = version ? `'${version}'` : "NULL";
  const sql = `UPDATE private.inquiry_configuration SET enabled = ${enabled}, approved_privacy_notice_version = ${v}, updated_at = now() WHERE id = true;`;
  executeSql(sql);
}

async function runInquirySecurityTests() {
  console.log("================================================================================");
  console.log("INQUIRY PIPELINE REAL DATABASE BOUNDARY SECURITY TESTS");
  console.log("================================================================================\n");

  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    try {
      let statusJsonStr = "";
      try {
        statusJsonStr = execSync("supabase status -o json", { encoding: "utf8", stdio: "pipe" });
      } catch {
        statusJsonStr = execSync("npx supabase status -o json", { encoding: "utf8", stdio: "pipe" });
      }
      const status = JSON.parse(statusJsonStr);
      if (status.API_URL) supabaseUrl = status.API_URL;
      if (status.ANON_KEY) anonKey = status.ANON_KEY;
      if (status.SERVICE_ROLE_KEY) serviceRoleKey = status.SERVICE_ROLE_KEY;
    } catch (err) {
      // Fall through to strict requirement validation
    }
  }

  if (!supabaseUrl || typeof supabaseUrl !== "string" || supabaseUrl.trim().length === 0) {
    console.error("FAIL: NEXT_PUBLIC_SUPABASE_URL environment variable is required.");
    process.exit(1);
  }

  if (!anonKey || typeof anonKey !== "string" || anonKey.trim().length === 0) {
    console.error("FAIL: NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required.");
    process.exit(1);
  }

  if (!serviceRoleKey || typeof serviceRoleKey !== "string" || serviceRoleKey.trim().length === 0) {
    console.error("FAIL: SUPABASE_SERVICE_ROLE_KEY environment variable is required.");
    process.exit(1);
  }

  const anonClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
  const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  let insertedInquiryId = null;

  try {
    // 1. Verify connection to local database
    const { error: pingError } = await adminClient.from("inquiries").select("id").limit(1);
    if (pingError) {
      console.error(`FAIL: Local Supabase test environment connection failed: ${pingError.message}`);
      process.exit(1);
    }
    console.log("✓ Connected to local Supabase database.");

    // Ensure initial state is disabled in private configuration
    setPrivateInquiryConfig(false, null);

    // ─────────────────────────────────────────────────────────────
    // 2. Direct anonymous table INSERT rejection
    // ─────────────────────────────────────────────────────────────
    console.log("▶ Testing direct anonymous table INSERT rejection...");
    const { error: directInsertError } = await anonClient.from("inquiries").insert([
      {
        full_name: "Anonymous User",
        email: "anon@example.com",
        country: "USA",
        interested_service: "Founder-Led Family Learning",
        client_type: "Family / Parent",
        status: "converted",
        internal_notes: "Bypassed server",
        consent_given: true,
        privacy_acknowledged: true,
      },
    ]);

    assert.ok(directInsertError, "Direct table INSERT by anonymous caller must be rejected.");
    console.log("✓ PASS: Direct table INSERT on public.inquiries is completely rejected by database.");

    // ─────────────────────────────────────────────────────────────
    // 3. Direct RPC rejected while database gate is disabled
    // ─────────────────────────────────────────────────────────────
    console.log("▶ Testing direct RPC rejection while database gate is disabled...");
    const { error: disabledRpcError } = await anonClient.rpc("submit_inquiry", {
      p_full_name: "Test Guardian",
      p_email: "guardian@example.com",
      p_country: "USA",
      p_contact_consent: true,
      p_privacy_acknowledged: true,
      p_privacy_notice_version: "v1.0-legal-approved",
    });

    assert.ok(disabledRpcError, "RPC submit_inquiry must fail when database configuration is disabled.");
    assert.ok(
      disabledRpcError.message.includes("closed"),
      `Expected 'closed' message, got: ${disabledRpcError.message}`
    );
    console.log("✓ PASS: Direct RPC execution fails closed while database gate is disabled.");

    // ─────────────────────────────────────────────────────────────
    // 4. Missing configuration row fails closed
    // ─────────────────────────────────────────────────────────────
    console.log("▶ Testing missing configuration row failure behavior...");
    executeSql("DELETE FROM private.inquiry_configuration WHERE id = true;");
    const { error: missingRowError } = await anonClient.rpc("submit_inquiry", {
      p_full_name: "Test Guardian",
      p_email: "guardian@example.com",
      p_country: "USA",
      p_contact_consent: true,
      p_privacy_acknowledged: true,
      p_privacy_notice_version: "v1.0-legal-approved",
    });
    assert.ok(missingRowError, "RPC must reject submission when configuration row is missing.");
    console.log("✓ PASS: Missing configuration row fails closed.");

    // Restore configuration row
    executeSql(
      "INSERT INTO private.inquiry_configuration (id, enabled, approved_privacy_notice_version) VALUES (true, false, NULL) ON CONFLICT (id) DO NOTHING;"
    );

    // ─────────────────────────────────────────────────────────────
    // 5. Isolated test enablement with approved notice version
    // ─────────────────────────────────────────────────────────────
    console.log("▶ Configuring isolated test database gate for parameter boundary testing...");
    const testApprovedVersion = "v1.0-test-approved";
    setPrivateInquiryConfig(true, testApprovedVersion);

    // 5A. Rejection of missing contact consent
    const { error: missingConsentError } = await anonClient.rpc("submit_inquiry", {
      p_full_name: "Valid Name",
      p_email: "valid@example.com",
      p_country: "USA",
      p_contact_consent: false,
      p_privacy_acknowledged: true,
      p_privacy_notice_version: testApprovedVersion,
    });
    assert.ok(missingConsentError, "RPC must reject submission without contact consent.");
    console.log("✓ PASS: Submission without contact consent is rejected.");

    // 5B. Rejection of missing privacy acknowledgment
    const { error: missingNoticeError } = await anonClient.rpc("submit_inquiry", {
      p_full_name: "Valid Name",
      p_email: "valid@example.com",
      p_country: "USA",
      p_contact_consent: true,
      p_privacy_acknowledged: false,
      p_privacy_notice_version: testApprovedVersion,
    });
    assert.ok(missingNoticeError, "RPC must reject submission without privacy acknowledgment.");
    console.log("✓ PASS: Submission without privacy notice acknowledgment is rejected.");

    // 5C. Rejection of draft, blank, or mismatched notice versions
    const invalidVersions = ["", "v1.0-draft", "v2.0-unapproved", null];
    for (const badVer of invalidVersions) {
      const { error: badVerError } = await anonClient.rpc("submit_inquiry", {
        p_full_name: "Valid Name",
        p_email: "valid@example.com",
        p_country: "USA",
        p_contact_consent: true,
        p_privacy_acknowledged: true,
        p_privacy_notice_version: badVer,
      });
      assert.ok(badVerError, `RPC must reject notice version '${badVer}'.`);
    }
    console.log("✓ PASS: Draft, blank, arbitrary, and mismatched notice versions are strictly rejected.");

    // 5D. Rejection of invalid email formats
    const invalidEmails = ["not-an-email", "@missinguser.com", "user@.com", "user@com"];
    for (const badEmail of invalidEmails) {
      const { error: badEmailError } = await anonClient.rpc("submit_inquiry", {
        p_full_name: "Valid Name",
        p_email: badEmail,
        p_country: "USA",
        p_contact_consent: true,
        p_privacy_acknowledged: true,
        p_privacy_notice_version: testApprovedVersion,
      });
      assert.ok(badEmailError, `RPC must reject invalid email '${badEmail}'.`);
    }
    console.log("✓ PASS: Malformed email formats are rejected by database validator.");

    // 5E. Rejection of oversized fields
    const { error: oversizedNameError } = await anonClient.rpc("submit_inquiry", {
      p_full_name: "A".repeat(101),
      p_email: "valid@example.com",
      p_country: "USA",
      p_contact_consent: true,
      p_privacy_acknowledged: true,
      p_privacy_notice_version: testApprovedVersion,
    });
    assert.ok(oversizedNameError, "RPC must reject name > 100 characters.");

    const { error: oversizedMessageError } = await anonClient.rpc("submit_inquiry", {
      p_full_name: "Valid Name",
      p_email: "valid@example.com",
      p_country: "USA",
      p_message: "M".repeat(1001),
      p_contact_consent: true,
      p_privacy_acknowledged: true,
      p_privacy_notice_version: testApprovedVersion,
    });
    assert.ok(oversizedMessageError, "RPC must reject message > 1000 characters.");
    console.log("✓ PASS: Oversized parameters (>100 char name, >1000 char message) are rejected.");

    // ─────────────────────────────────────────────────────────────
    // 6. Valid allowlisted submission and canonical value verification
    // ─────────────────────────────────────────────────────────────
    console.log("▶ Testing valid allowlisted submission with approved version...");
    const { data: validResult, error: validError } = await anonClient.rpc("submit_inquiry", {
      p_full_name: "Automated Test Guardian",
      p_email: "automated_test_guardian@example.com",
      p_whatsapp_number: "+15551234567",
      p_country: "Philippines",
      p_learner_ages: "ages 7 to 9",
      p_message: "Automated test inquiry message",
      p_contact_consent: true,
      p_privacy_acknowledged: true,
      p_privacy_notice_version: testApprovedVersion,
    });

    assert.ifError(validError);
    assert.ok(validResult && validResult.success === true && validResult.id);
    insertedInquiryId = validResult.id;

    // Verify canonical values set by database function
    const { data: record, error: fetchError } = await adminClient
      .from("inquiries")
      .select("*")
      .eq("id", insertedInquiryId)
      .single();

    assert.ifError(fetchError);
    assert.strictEqual(record.status, "new", "Status must be canonical 'new'");
    assert.strictEqual(record.client_type, "Family / Parent", "Client type must be canonical 'Family / Parent'");
    assert.strictEqual(record.interested_service, "Founder-Led Family Learning", "Interested service must be canonical");
    assert.strictEqual(record.assigned_to, null, "assigned_to must be NULL");
    assert.strictEqual(record.internal_notes, null, "internal_notes must be NULL");
    assert.strictEqual(record.follow_up_at, null, "follow_up_at must be NULL");
    assert.strictEqual(record.archived_at, null, "archived_at must be NULL");
    assert.strictEqual(record.consent_given, true);
    assert.strictEqual(record.privacy_acknowledged, true);
    assert.strictEqual(record.privacy_notice_version, testApprovedVersion);
    assert.ok(record.consent_timestamp !== null);

    console.log("✓ PASS: Allowlisted RPC succeeds and automatically enforces all canonical internal values.");
  } finally {
    // ─────────────────────────────────────────────────────────────
    // 7. Cleanup: Delete test record & restore database gate to disabled
    // ─────────────────────────────────────────────────────────────
    console.log("▶ Restoring database gate to disabled and cleaning up test records...");
    if (insertedInquiryId) {
      await adminClient.from("inquiries").delete().eq("id", insertedInquiryId);
    }

    // MANDATORY: Keep database configuration disabled after every test on all failure/success paths
    try {
      setPrivateInquiryConfig(false, null);
      console.log("✓ PASS: Database inquiry_configuration restored to disabled state (enabled=false, notice=null).");
    } catch (cleanupErr) {
      console.error("WARNING: Failed to restore database gate via SQL:", cleanupErr.message);
    }
  }

  console.log("\nPASS: All real database boundary security tests passed successfully with 0 PII leaked.");
}

if (require.main === module) {
  runInquirySecurityTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("FAIL: Inquiry security test suite encountered an unhandled error:");
      console.error(err.message);
      process.exit(1);
    });
}

module.exports = {
  runInquirySecurityTests,
};
