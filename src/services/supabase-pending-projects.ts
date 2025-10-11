import { supabase } from '../config/supabase';
import { OnboardingData, GeneratedImage } from '../contexts/OnboardingContext';

export interface PendingProject {
  id: string;
  session_id: string;
  project_type: 'single';
  song_title: string;
  artist_name: string;
  featuring?: string;
  producer?: string;
  release_year?: string;
  genre: string;
  mood: string;
  lyrics: string;
  visual_style: string;
  additional_prompt?: string;
  generated_images: any;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  is_explicit: boolean;
  claimed_by_user_id?: string;
  created_at: string;
  updated_at: string;
}

export class SupabasePendingProjectsService {
  static async createPendingProject(
    sessionId: string,
    data: OnboardingData
  ): Promise<PendingProject> {
    try {
      const projectData = {
        session_id: sessionId,
        project_type: data.projectType,
        song_title: data.songTitle,
        artist_name: data.artistName,
        album_title: null,
        featuring: data.featuring || null,
        producer: data.producer || null,
        release_year: data.releaseYear || null,
        genre: data.genre,
        mood: data.mood,
        lyrics: data.lyrics,
        visual_style: data.visualStyle,
        additional_prompt: data.additionalPrompt || null,
        tracklist: null,
        generated_images: [],
        status: 'pending' as const,
        is_explicit: data.isExplicit
      };

      const { data: created, error } = await supabase
        .from('pending_projects')
        .insert(projectData)
        .select()
        .single();

      if (error) throw error;

      return created;
    } catch (error: any) {
      console.error('Create pending project error:', error);
      throw new Error('Failed to create pending project');
    }
  }

  static async updatePendingProject(
    projectId: string,
    updates: Partial<{
      status: PendingProject['status'];
      generated_images: GeneratedImage[];
      song_title: string;
      artist_name: string;
      genre: string;
      mood: string;
      lyrics: string;
      visual_style: string;
      additional_prompt: string;
    }>
  ): Promise<PendingProject> {
    try {
      const { data, error } = await supabase
        .from('pending_projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Update pending project error:', error);
      throw new Error('Failed to update pending project');
    }
  }

  static async getPendingProjectBySession(
    sessionId: string
  ): Promise<PendingProject | null> {
    try {
      const { data, error } = await supabase
        .from('pending_projects')
        .select('*')
        .eq('session_id', sessionId)
        .is('claimed_by_user_id', null)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      return data && data.length > 0 ? data[0] : null;
    } catch (error: any) {
      console.error('Get pending project error:', error);
      return null;
    }
  }

  static async getPendingProject(projectId: string): Promise<PendingProject | null> {
    try {
      const { data, error } = await supabase
        .from('pending_projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Get pending project error:', error);
      return null;
    }
  }

  static async claimPendingProject(
    projectId: string,
    userId: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('pending_projects')
        .update({ claimed_by_user_id: userId })
        .eq('id', projectId);

      if (error) throw error;
    } catch (error: any) {
      console.error('Claim pending project error:', error);
      throw new Error('Failed to claim pending project');
    }
  }

  static async deletePendingProject(projectId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('pending_projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
    } catch (error: any) {
      console.error('Delete pending project error:', error);
      throw new Error('Failed to delete pending project');
    }
  }

  static convertToOnboardingData(project: PendingProject): OnboardingData {
    return {
      projectType: project.project_type,
      songTitle: project.song_title,
      artistName: project.artist_name,
      featuring: project.featuring || '',
      producer: project.producer || '',
      releaseYear: project.release_year || new Date().getFullYear().toString(),
      genre: project.genre,
      mood: project.mood,
      lyrics: project.lyrics,
      visualStyle: project.visual_style,
      additionalPrompt: project.additional_prompt || '',
      isExplicit: project.is_explicit
    };
  }
}
