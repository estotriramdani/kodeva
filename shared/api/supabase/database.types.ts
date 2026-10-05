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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      article_products: {
        Row: {
          article_id: string
          product_id: string
          rank: number
        }
        Insert: {
          article_id: string
          product_id: string
          rank?: number
        }
        Update: {
          article_id?: string
          product_id?: string
          rank?: number
        }
        Relationships: [
          {
            foreignKeyName: "article_products_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_name: string | null
          category_id: string | null
          content_html: string
          cover_alt: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          market_code: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["article_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          category_id?: string | null
          content_html?: string
          cover_alt?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          market_code?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["article_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          category_id?: string | null
          content_html?: string
          cover_alt?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          market_code?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["article_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          type: Database["public"]["Enums"]["category_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          type: Database["public"]["Enums"]["category_type"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          type?: Database["public"]["Enums"]["category_type"]
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          is_published: boolean
          market_code: string
          question: string
          rank: number
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          is_published?: boolean
          market_code?: string
          question: string
          rank?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          is_published?: boolean
          market_code?: string
          question?: string
          rank?: number
          updated_at?: string
        }
        Relationships: []
      }
      landing_hero: {
        Row: {
          campaign_name: string
          cta_href: string
          cta_label: string
          image_alt: string | null
          image_url: string | null
          market_code: string
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          campaign_name?: string
          cta_href?: string
          cta_label?: string
          image_alt?: string | null
          image_url?: string | null
          market_code?: string
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          campaign_name?: string
          cta_href?: string
          cta_label?: string
          image_alt?: string | null
          image_url?: string | null
          market_code?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          ip_hash: string
          landing_path: string | null
          name: string
          referrer: string | null
          source_cta: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          ip_hash: string
          landing_path?: string | null
          name: string
          referrer?: string | null
          source_cta?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          ip_hash?: string
          landing_path?: string | null
          name?: string
          referrer?: string | null
          source_cta?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      product_plans: {
        Row: {
          features: Json
          id: string
          max_qty: number
          min_qty: number
          price: number
          product_id: string
          promo_price: number | null
          tier: Database["public"]["Enums"]["plan_tier"]
          unit: Database["public"]["Enums"]["plan_unit"]
        }
        Insert: {
          features?: Json
          id?: string
          max_qty?: number
          min_qty?: number
          price: number
          product_id: string
          promo_price?: number | null
          tier: Database["public"]["Enums"]["plan_tier"]
          unit?: Database["public"]["Enums"]["plan_unit"]
        }
        Update: {
          features?: Json
          id?: string
          max_qty?: number
          min_qty?: number
          price?: number
          product_id?: string
          promo_price?: number | null
          tier?: Database["public"]["Enums"]["plan_tier"]
          unit?: Database["public"]["Enums"]["plan_unit"]
        }
        Relationships: [
          {
            foreignKeyName: "product_plans_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string
          featured_rank: number | null
          features: Json
          id: string
          is_active: boolean
          market_code: string
          name: string
          promo_ends_at: string | null
          promo_quota_remaining: number
          promo_starts_at: string | null
          screenshots: Json
          slug: string
          tagline: string | null
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string
          featured_rank?: number | null
          features?: Json
          id?: string
          is_active?: boolean
          market_code?: string
          name: string
          promo_ends_at?: string | null
          promo_quota_remaining?: number
          promo_starts_at?: string | null
          screenshots?: Json
          slug: string
          tagline?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string
          featured_rank?: number | null
          features?: Json
          id?: string
          is_active?: boolean
          market_code?: string
          name?: string
          promo_ends_at?: string | null
          promo_quota_remaining?: number
          promo_starts_at?: string | null
          screenshots?: Json
          slug?: string
          tagline?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          is_public: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          is_public?: boolean
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          is_public?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          id: string
          is_published: boolean
          market_code: string
          name: string
          quote: string
          rank: number
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          market_code?: string
          name: string
          quote: string
          rank?: number
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          market_code?: string
          name?: string
          quote?: string
          rank?: number
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_editor: { Args: never; Returns: boolean }
      claim_product_promo_quota: {
        Args: {
          p_product_id: string
          p_qty?: number
        }
        Returns: {
          success: boolean
          remaining?: number
          error?: string
        }
      }
    }
    Enums: {
      article_status: "draft" | "published"
      category_type: "product" | "article"
      plan_tier: "basic" | "pro" | "business"
      plan_unit: "user" | "outlet"
      user_role: "admin" | "editor"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      article_status: ["draft", "published"],
      category_type: ["product", "article"],
      plan_tier: ["basic", "pro", "business"],
      plan_unit: ["user", "outlet"],
      user_role: ["admin", "editor"],
    },
  },
} as const
