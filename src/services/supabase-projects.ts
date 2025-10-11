import { supabase } from '../config/supabase';
import { Database } from '../config/supabase';

export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type ProjectExport = Database['public']['Tables']['project_exports']['Row'];
export type ProjectExportInsert = Database['public']['Tables']['project_exports']['Insert'];

export class SupabaseProjectsService {
  static async createProject(
    userId: string,
    type: 'cover',
    title: string
  ): Promise<Project> {
    try {
      const projectData: ProjectInsert = {
        user_id: userId,
        title,
        type,
        status: 'draft',
        settings: {}
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Create project error:', error);
      throw new Error('Failed to create project');
    }
  }

  static async getUserProjects(userId: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error('Get projects error:', error);
      throw new Error('Failed to load projects');
    }
  }

  static async getProject(projectId: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Get project error:', error);
      return null;
    }
  }

  static async updateProject(
    projectId: string,
    updates: ProjectUpdate
  ): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Update project error:', error);
      throw new Error('Failed to update project');
    }
  }

  static async deleteProject(projectId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
    } catch (error: any) {
      console.error('Delete project error:', error);
      throw new Error('Failed to delete project');
    }
  }

  static async duplicateProject(
    projectId: string,
    userId: string
  ): Promise<Project> {
    try {
      const original = await this.getProject(projectId);
      if (!original) throw new Error('Project not found');

      const duplicateData: ProjectInsert = {
        user_id: userId,
        title: `${original.title} (Copy)`,
        type: original.type,
        status: 'draft',
        settings: original.settings
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(duplicateData)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Duplicate project error:', error);
      throw new Error('Failed to duplicate project');
    }
  }

  static async addProjectExport(exportData: ProjectExportInsert): Promise<ProjectExport> {
    try {
      const { data, error } = await supabase
        .from('project_exports')
        .insert(exportData)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Add export error:', error);
      throw new Error('Failed to add export');
    }
  }

  static async getProjectExports(projectId: string): Promise<ProjectExport[]> {
    try {
      const { data, error } = await supabase
        .from('project_exports')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error('Get exports error:', error);
      throw new Error('Failed to load exports');
    }
  }

  static async deleteProjectExport(exportId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('project_exports')
        .delete()
        .eq('id', exportId);

      if (error) throw error;
    } catch (error: any) {
      console.error('Delete export error:', error);
      throw new Error('Failed to delete export');
    }
  }

  static subscribeToProjects(
    userId: string,
    callback: (projects: Project[]) => void
  ) {
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${userId}`
        },
        async () => {
          const projects = await this.getUserProjects(userId);
          callback(projects);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  static async getProjectsByStatus(
    userId: string,
    status: Project['status']
  ): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .eq('status', status)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error('Get projects by status error:', error);
      throw new Error('Failed to load projects');
    }
  }

  static async getProjectsByType(
    userId: string,
    type: Project['type']
  ): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .eq('type', type)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error('Get projects by type error:', error);
      throw new Error('Failed to load projects');
    }
  }
}
