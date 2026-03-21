export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_key: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_key: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_key?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          position: number
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
          position?: number
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          position?: number
          user_id?: string
        }
        Relationships: []
      }
      completions: {
        Row: {
          completed_date: string
          created_at: string
          id: string
          task_id: string
          user_id: string
        }
        Insert: {
          completed_date: string
          created_at?: string
          id?: string
          task_id: string
          user_id: string
        }
        Update: {
          completed_date?: string
          created_at?: string
          id?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "completions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_challenges: {
        Row: {
          challenge_text: string
          completed: boolean
          created_at: string
          date: string
          id: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          challenge_text: string
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          challenge_text?: string
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          user_id?: string
          xp_reward?: number
        }
        Relationships: []
      }
      dopamine_logs: {
        Row: {
          activity: string
          created_at: string
          duration_minutes: number
          id: string
          logged_at: string
          type: string
          user_id: string
        }
        Insert: {
          activity: string
          created_at?: string
          duration_minutes?: number
          id?: string
          logged_at?: string
          type?: string
          user_id: string
        }
        Update: {
          activity?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          logged_at?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      focus_sessions: {
        Row: {
          completed_at: string | null
          duration_seconds: number
          id: string
          started_at: string
          task_id: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          duration_seconds?: number
          id?: string
          started_at?: string
          task_id?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          duration_seconds?: number
          id?: string
          started_at?: string
          task_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "focus_sessions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      future_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          shown: boolean
          trigger_after: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          shown?: boolean
          trigger_after: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          shown?: boolean
          trigger_after?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          current_value: number
          id: string
          target_value: number
          title: string
          unit: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: number
          id?: string
          target_value?: number
          title: string
          unit?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: number
          id?: string
          target_value?: number
          title?: string
          unit?: string
          user_id?: string
        }
        Relationships: []
      }
      life_stats: {
        Row: {
          discipline: number
          focus: number
          health: number
          id: string
          knowledge: number
          updated_at: string
          user_id: string
        }
        Insert: {
          discipline?: number
          focus?: number
          health?: number
          id?: string
          knowledge?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          discipline?: number
          focus?: number
          health?: number
          id?: string
          knowledge?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mood_logs: {
        Row: {
          created_at: string
          energy: string
          id: string
          logged_at: string
          mood: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          energy?: string
          id?: string
          logged_at?: string
          mood?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          energy?: string
          id?: string
          logged_at?: string
          mood?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          hard_mode: boolean
          id: string
          level: number
          start_date: string
          total_xp: number
          weekly_planning_enabled: boolean
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          hard_mode?: boolean
          id: string
          level?: number
          start_date?: string
          total_xp?: number
          weekly_planning_enabled?: boolean
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          hard_mode?: boolean
          id?: string
          level?: number
          start_date?: string
          total_xp?: number
          weekly_planning_enabled?: boolean
        }
        Relationships: []
      }
      proof_of_work: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          note: string
          task_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          note?: string
          task_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          note?: string
          task_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proof_of_work_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      scratchpad_notes: {
        Row: {
          content: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category_id: string
          created_at: string
          difficulty: string
          frequency: string
          id: string
          name: string
          scheduled_days: number[]
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          difficulty?: string
          frequency?: string
          id?: string
          name: string
          scheduled_days?: number[]
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          difficulty?: string
          frequency?: string
          id?: string
          name?: string
          scheduled_days?: number[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      time_blocks: {
        Row: {
          color: string
          created_at: string
          date: string
          end_time: string
          id: string
          start_time: string
          task_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          date: string
          end_time: string
          id?: string
          start_time: string
          task_id?: string | null
          title?: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          start_time?: string
          task_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_blocks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
