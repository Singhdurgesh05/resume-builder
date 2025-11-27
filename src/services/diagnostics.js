import { supabase } from './supabaseClient';

/**
 * Test Supabase connection and permissions
 */
export const testSupabaseConnection = async () => {
  console.log('=== SUPABASE DIAGNOSTICS ===');

  try {
    // 1. Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('❌ Auth Error:', authError);
      return { success: false, error: 'Not authenticated' };
    }

    console.log('✅ User authenticated:', user.id);

    // 2. Test SELECT permission
    console.log('\n--- Testing SELECT permission ---');
    const { data: selectData, error: selectError } = await supabase
      .from('Resumes')
      .select('id, user_id, title')
      .eq('user_id', user.id)
      .limit(1);

    if (selectError) {
      console.error('❌ SELECT Error:', selectError);
    } else {
      console.log('✅ SELECT works:', selectData?.length || 0, 'resumes found');
    }

    // 3. Test if we have any resumes
    if (selectData && selectData.length > 0) {
      const testResume = selectData[0];
      console.log('\n--- Testing UPDATE permission ---');
      console.log('Test resume ID:', testResume.id);

      // Try to update
      const { error: updateError } = await supabase
        .from('Resumes')
        .update({ title: testResume.title }) // Update with same value
        .eq('id', testResume.id)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('❌ UPDATE Error:', updateError);
        return {
          success: false,
          error: 'UPDATE permission denied',
          details: updateError
        };
      } else {
        console.log('✅ UPDATE works');
      }
    } else {
      console.log('⚠️ No resumes found to test UPDATE');
    }

    // 4. Test INSERT permission
    console.log('\n--- Testing INSERT permission ---');
    const { data: insertData, error: insertError } = await supabase
      .from('Resumes')
      .insert({
        user_id: user.id,
        title: 'Test Resume (Delete Me)',
        template_name: 'classic',
        font_family: 'inter',
        color_scheme: 'emerald',
        resume_data: { test: true }
      })
      .select();

    if (insertError) {
      console.error('❌ INSERT Error:', insertError);
    } else {
      console.log('✅ INSERT works');

      // Clean up test resume
      if (insertData && insertData[0]) {
        await supabase
          .from('Resumes')
          .delete()
          .eq('id', insertData[0].id);
        console.log('✅ Test resume cleaned up');
      }
    }

    console.log('\n=== DIAGNOSTICS COMPLETE ===');
    return { success: true };

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check RLS policies
 */
export const checkRLSPolicies = async () => {
  console.log('=== CHECKING RLS POLICIES ===');

  try {
    const { data, error } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'Resumes');

    if (error) {
      console.error('❌ Cannot read policies (this is normal):', error.message);
    } else {
      console.log('Policies:', data);
    }
  } catch (error) {
    console.error('❌ Error checking policies:', error);
  }
};
