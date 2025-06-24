export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          auth_id: string
          name: string | null
          email: string | null
          points: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          auth_id: string
          name?: string | null
          email?: string | null
          points?: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          auth_id?: string
          name?: string | null
          email?: string | null
          points?: number
          created_at?: string
          updated_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          total_price: number
          status: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          customer_id: string
          total_price: number
          status?: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          customer_id?: string
          total_price?: number
          status?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string
          quantity: number
          price_each: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id: string
          quantity: number
          price_each: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          menu_item_id?: string
          quantity?: number
          price_each?: number
          created_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category?: string
          created_at?: string
          updated_at?: string | null
        }
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
  }
}
