import { supabase } from './supabaseClient';



// Helper function to ensure user profile exists
const ensureUserProfile = async (userId) => {
  try {
    // Check if user profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single();

    // If profile doesn't exist, create it
    if (checkError && checkError.code === 'PGRST116') {
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert([{ id: userId, full_name: 'User' }]);

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        throw insertError;
      }
    } else if (checkError) {
      throw checkError;
    }

    return true;
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    throw error;
  }
};

// Get all resumes for the current user
export const getUserResumes = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('Resumes')
      .select('id, title, template_name, font_family, color_scheme, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return data.map(resume => ({
      id: resume.id,
      title: resume.title || 'Untitled Resume',
      template: resume.template_name || 'classic',
      font: resume.font_family || 'inter',
      color: resume.color_scheme || 'purple',
      createdAt: resume.created_at,
      updatedAt: resume.updated_at
    }));
  } catch (error) {
    console.error('Error fetching resumes:', error);
    throw error;
  }
};

// Get a single resume by ID
export const getResumeById = async (resumeId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('Resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title || 'Untitled Resume',
      content: data.resume_data || null,
      template: data.template_name || 'classic',
      font: data.font_family || 'inter',
      color: data.color_scheme || 'purple',
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error fetching resume:', error);
    throw error;
  }
};

// Create a new resume
export const createResume = async (resumeData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Ensure user profile exists before creating resume
    await ensureUserProfile(user.id);

    const { data, error } = await supabase
      .from('Resumes')
      .insert([
        {
          user_id: user.id,
          title: resumeData.title || 'Untitled Resume',
          template_name: resumeData.template || 'classic',
          font_family: resumeData.font || 'inter',
          color_scheme: resumeData.color || 'purple',
          resume_data: resumeData.content || null
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      template: data.template_name,
      font: data.font_family,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error creating resume:', error);
    throw error;
  }
};

// Update an existing resume
export const updateResume = async (resumeId, updates) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const updateData = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.template !== undefined) updateData.template_name = updates.template;
    if (updates.font !== undefined) updateData.font_family = updates.font;
    if (updates.color !== undefined) updateData.color_scheme = updates.color;

    // Ensure content is properly serialized as JSON
    if (updates.content !== undefined) {
      try {
        // Supabase expects JSONB, ensure it's a proper object
        updateData.resume_data = typeof updates.content === 'string'
          ? JSON.parse(updates.content)
          : updates.content;
      } catch (jsonError) {
        console.error('Error serializing resume content:', jsonError);
        updateData.resume_data = updates.content;
      }
    }

    console.log('Updating resume with data:', { resumeId, userId: user.id, updateData });

    // First check if the resume exists
    const { data: existingResume, error: checkError } = await supabase
      .from('Resumes')
      .select('id, user_id')
      .eq('id', resumeId)
      .single();

    if (checkError) {
      console.error('Error checking resume existence:', checkError);
      throw new Error('Resume not found or access denied');
    }

    console.log('Existing resume:', existingResume);

    if (existingResume.user_id !== user.id) {
      throw new Error('You do not have permission to update this resume');
    }

    // Now update the resume
    const { error } = await supabase
      .from('Resumes')
      .update(updateData)
      .eq('id', resumeId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }

    console.log('Resume updated successfully');

    // Return basic info since select might be blocked by RLS
    return {
      id: resumeId,
      title: updates.title,
      template: updates.template,
      font: updates.font,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error updating resume:', error);
    throw error;
  }
};

// Delete a resume
export const deleteResume = async (resumeId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('Resumes')
      .delete()
      .eq('id', resumeId)
      .eq('user_id', user.id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
};
