
 export interface Database {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
      }
      accounts: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          provider_account_id: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          provider_account_id: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          provider_account_id?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          user_id?: string
        }
      }
      avatar_mock_data: {
        Row: {
          backstory: string | null
          created_at: string | null
          dialect: string | null
          id: number
          image_url: string | null
          name: string | null
          role: number | null
          vocabulary: string[] | null
        }
        Insert: {
          backstory?: string | null
          created_at?: string | null
          dialect?: string | null
          id?: number
          image_url?: string | null
          name?: string | null
          role?: number | null
          vocabulary?: string[] | null
        }
        Update: {
          backstory?: string | null
          created_at?: string | null
          dialect?: string | null
          id?: number
          image_url?: string | null
          name?: string | null
          role?: number | null
          vocabulary?: string[] | null
        }
      }
      avatar_role_type: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: number
          role_description: string | null
          role_type: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          role_description?: string | null
          role_type?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          role_description?: string | null
          role_type?: string | null
        }
      }
      avatar_roles: {
        Row: {
          description: string | null
          id: number
          name: string | null
          role_type: number | null
        }
        Insert: {
          description?: string | null
          id: number
          name?: string | null
          role_type?: number | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string | null
          role_type?: number | null
        }
      }
      Chat_Embeddings: {
        Row: {
          avatar_message_embedding: unknown | null
          chat_id: number | null
          created_at: string | null
          id: number
          user_message_embedding: unknown | null
        }
        Insert: {
          avatar_message_embedding?: unknown | null
          chat_id?: number | null
          created_at?: string | null
          id?: number
          user_message_embedding?: unknown | null
        }
        Update: {
          avatar_message_embedding?: unknown | null
          chat_id?: number | null
          created_at?: string | null
          id?: number
          user_message_embedding?: unknown | null
        }
      }
      Chat_History: {
        Row: {
          agent_message: string | null
          avatarId: number | null
          created_at: string | null
          id: number
          user_message: string | null
          userId: string | null
        }
        Insert: {
          agent_message?: string | null
          avatarId?: number | null
          created_at?: string | null
          id?: number
          user_message?: string | null
          userId?: string | null
        }
        Update: {
          agent_message?: string | null
          avatarId?: number | null
          created_at?: string | null
          id?: number
          user_message?: string | null
          userId?: string | null
        }
      }
      documents: {
        Row: {
          content: string | null
          embedding: unknown | null
          id: number
        }
        Insert: {
          content?: string | null
          embedding?: unknown | null
          id?: number
        }
        Update: {
          content?: string | null
          embedding?: unknown | null
          id?: number
        }
      }
      payments: {
        Row: {
          createdAt: string
          id: string
          projectId: string | null
          status: string
          stripeSessionId: string
          type: string
        }
        Insert: {
          createdAt?: string
          id: string
          projectId?: string | null
          status: string
          stripeSessionId: string
          type: string
        }
        Update: {
          createdAt?: string
          id?: string
          projectId?: string | null
          status?: string
          stripeSessionId?: string
          type?: string
        }
      }
      Project: {
        Row: {
          createdAt: string
          credits: number
          dialect: string | null
          id: string
          imageUrls: string[] | null
          instanceClass: string
          instanceName: string
          modelStatus: string | null
          modelVersionId: string | null
          name: string
          promptWizardCredits: number
          replicateModelId: string | null
          role: string | null
          stripePaymentId: string | null
          updatedAt: string
          userId: string | null
          zipImageUrl: string | null
        }
        Insert: {
          createdAt?: string
          credits?: number
          dialect?: string | null
          id: string
          imageUrls?: string[] | null
          instanceClass: string
          instanceName: string
          modelStatus?: string | null
          modelVersionId?: string | null
          name: string
          promptWizardCredits?: number
          replicateModelId?: string | null
          role?: string | null
          stripePaymentId?: string | null
          updatedAt: string
          userId?: string | null
          zipImageUrl?: string | null
        }
        Update: {
          createdAt?: string
          credits?: number
          dialect?: string | null
          id?: string
          imageUrls?: string[] | null
          instanceClass?: string
          instanceName?: string
          modelStatus?: string | null
          modelVersionId?: string | null
          name?: string
          promptWizardCredits?: number
          replicateModelId?: string | null
          role?: string | null
          stripePaymentId?: string | null
          updatedAt?: string
          userId?: string | null
          zipImageUrl?: string | null
        }
      }
      sessions: {
        Row: {
          expires: string
          id: string
          session_token: string
          user_id: string
        }
        Insert: {
          expires: string
          id: string
          session_token: string
          user_id: string
        }
        Update: {
          expires?: string
          id?: string
          session_token?: string
          user_id?: string
        }
      }
      Shot: {
        Row: {
          blurhash: string | null
          bookmarked: boolean | null
          createdAt: string
          hdOutputUrl: string | null
          hdPredictionId: string | null
          hdStatus: Database["public"]["Enums"]["HdStatus"]
          id: string
          outputUrl: string | null
          projectId: string | null
          prompt: string
          replicateId: string
          seed: number | null
          status: string
          updatedAt: string
        }
        Insert: {
          blurhash?: string | null
          bookmarked?: boolean | null
          createdAt?: string
          hdOutputUrl?: string | null
          hdPredictionId?: string | null
          hdStatus?: Database["public"]["Enums"]["HdStatus"]
          id: string
          outputUrl?: string | null
          projectId?: string | null
          prompt: string
          replicateId: string
          seed?: number | null
          status: string
          updatedAt: string
        }
        Update: {
          blurhash?: string | null
          bookmarked?: boolean | null
          createdAt?: string
          hdOutputUrl?: string | null
          hdPredictionId?: string | null
          hdStatus?: Database["public"]["Enums"]["HdStatus"]
          id?: string
          outputUrl?: string | null
          projectId?: string | null
          prompt?: string
          replicateId?: string
          seed?: number | null
          status?: string
          updatedAt?: string
        }
      }
      SubTasks: {
        Row: {
          avatarId: number | null
          completed: boolean | null
          created_at: string | null
          description: string | null
          id: number
          name: string | null
          userId: string | null
        }
        Insert: {
          avatarId?: number | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string | null
          userId?: string | null
        }
        Update: {
          avatarId?: number | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string | null
          userId?: string | null
        }
      }
      Tasks: {
        Row: {
          avatarId: number | null
          completed: boolean | null
          created_at: string | null
          id: number
          name: string | null
          subTaskId: number | null
          userId: string | null
        }
        Insert: {
          avatarId?: number | null
          completed?: boolean | null
          created_at?: string | null
          id?: number
          name?: string | null
          subTaskId?: number | null
          userId?: string | null
        }
        Update: {
          avatarId?: number | null
          completed?: boolean | null
          created_at?: string | null
          id?: number
          name?: string | null
          subTaskId?: number | null
          userId?: string | null
        }
      }
      users: {
        Row: {
          email: string | null
          email_verified: string | null
          id: string
          image: string | null
          name: string | null
        }
        Insert: {
          email?: string | null
          email_verified?: string | null
          id: string
          image?: string | null
          name?: string | null
        }
        Update: {
          email?: string | null
          email_verified?: string | null
          id?: string
          image?: string | null
          name?: string | null
        }
      }
      verification_tokens: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      hello: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      match_chat_messages: {
        Args: {
          query_embedding: unknown
          match_threshold: number
          match_count: number
          session_user_id: string
          session_avatar_id: number
        }
        Returns: {
          chat_id: number
          user_message: string
          avatar_message: string
          user_similarity: number
          avatar_similarity: number
        }[]
      }
      match_documents: {
        Args: {
          query_embedding: unknown
          similarity_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          content: string
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      vector_dims: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      HdStatus: "NO" | "PENDING" | "PROCESSED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
