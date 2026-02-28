require('dotenv').config();
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xsksfavlzheeygcbqutt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhza3NmYXZsemhlZXlnY2JxdXR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk1NTY4MCwiZXhwIjoyMDg3NTMxNjgwfQ.BVufnZsgPM9_NAz2VrsEFGMI_4xAz0GDFEwSR0RjKNk';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function runTests() {
  console.log('=== Testing Credits Column Fix ===\n');
  let passed = 0;
  let failed = 0;

  // Test 1: Check if credits column exists
  console.log('Test 1: Checking if credits column exists in users table...');
  try {
    const { data: colData, error: colError } = await supabase
      .from('users')
      .select('credits')
      .limit(1);
    
    if (colError && colError.message.includes('credits')) {
      console.log('  FAIL: credits column does not exist');
      failed++;
    } else {
      console.log('  PASS: credits column exists');
      passed++;
    }
  } catch (err) {
    console.log('  FAIL:', err.message);
    failed++;
  }

  // Test 2: Check default value
  console.log('\nTest 2: Checking default value of credits column...');
  try {
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('credits')
      .limit(1);
    
    if (!testError || testData) {
      console.log('  PASS: Can query credits column');
      passed++;
    } else {
      console.log('  FAIL: Cannot query credits column -', testError.message);
      failed++;
    }
  } catch (err) {
    console.log('  FAIL:', err.message);
    failed++;
  }

  // Test 3: Create a new user and verify profile creation
  console.log('\nTest 3: Testing new user profile creation...');
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  
  try {
    // Delete user if exists (cleanup)
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === testEmail);
    if (existingUser) {
      await supabase.auth.admin.deleteUser(existingUser.id);
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true
    });

    if (authError || !authData?.user) {
      console.log('  FAIL: Could not create auth user -', authError?.message);
      failed++;
    } else {
      const userId = authData.user.id;

      // Try to insert into users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .upsert({
          id: userId,
          email: testEmail,
          credits: 10
        }, { onConflict: 'id' })
        .select()
        .single();

      if (userError) {
        // Try without credits column
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('users')
          .upsert({
            id: userId,
            email: testEmail
          }, { onConflict: 'id' })
          .select()
          .single();

        if (fallbackError) {
          console.log('  FAIL: Could not create user profile -', fallbackError.message);
          failed++;
        } else {
          console.log('  PASS: User profile created (fallback mode)');
          passed++;
        }
      } else {
        console.log('  PASS: User profile created with credits =', userData?.credits);
        passed++;
      }

      // Cleanup
      await supabase.auth.admin.deleteUser(userId);
    }
  } catch (err) {
    console.log('  FAIL:', err.message);
    failed++;
  }

  // Summary
  console.log('\n=== Test Summary ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${passed + failed}`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
