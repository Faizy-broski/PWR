// Hand-written to match supabase/migrations/*.sql. Once the Supabase CLI is
// linked to the project, regenerate with:
//   pnpm dlx supabase gen types typescript --project-id <id> > lib/supabase/types.ts

export type CompetitionStatusRow = "draft" | "live" | "closed" | "drawn";
export type CompetitionCategoryRow = "free" | "gold" | "platinum" | "vip";
export type TransactionStatusRow = "pending" | "paid" | "failed" | "refunded";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      competitions: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          category: CompetitionCategoryRow;
          prize_value: number;
          ticket_price: number;
          total_tickets: number;
          tickets_sold: number;
          status: CompetitionStatusRow;
          images: string[];
          starts_at: string;
          closes_at: string;
          drawn_at: string | null;
          winner_entry_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string;
          category?: CompetitionCategoryRow;
          prize_value: number;
          ticket_price: number;
          total_tickets: number;
          tickets_sold?: number;
          status?: CompetitionStatusRow;
          images?: string[];
          starts_at: string;
          closes_at: string;
          drawn_at?: string | null;
          winner_entry_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string;
          category?: CompetitionCategoryRow;
          prize_value?: number;
          ticket_price?: number;
          total_tickets?: number;
          tickets_sold?: number;
          status?: CompetitionStatusRow;
          images?: string[];
          starts_at?: string;
          closes_at?: string;
          drawn_at?: string | null;
          winner_entry_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "competitions_winner_entry_id_fkey";
            columns: ["winner_entry_id"];
            isOneToOne: false;
            referencedRelation: "entries";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          competition_id: string;
          amount: number;
          currency: string;
          status: TransactionStatusRow;
          stripe_payment_intent_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          competition_id: string;
          amount: number;
          currency?: string;
          status?: TransactionStatusRow;
          stripe_payment_intent_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          competition_id?: string;
          amount?: number;
          currency?: string;
          status?: TransactionStatusRow;
          stripe_payment_intent_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_competition_id_fkey";
            columns: ["competition_id"];
            isOneToOne: false;
            referencedRelation: "competitions";
            referencedColumns: ["id"];
          },
        ];
      };
      entries: {
        Row: {
          id: string;
          competition_id: string;
          user_id: string;
          ticket_numbers: number[];
          answer_correct: boolean;
          transaction_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          competition_id: string;
          user_id: string;
          ticket_numbers?: number[];
          answer_correct?: boolean;
          transaction_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          competition_id?: string;
          user_id?: string;
          ticket_numbers?: number[];
          answer_correct?: boolean;
          transaction_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "entries_competition_id_fkey";
            columns: ["competition_id"];
            isOneToOne: false;
            referencedRelation: "competitions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "entries_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "entries_transaction_id_fkey";
            columns: ["transaction_id"];
            isOneToOne: false;
            referencedRelation: "transactions";
            referencedColumns: ["id"];
          },
        ];
      };
      tickets: {
        Row: {
          id: string;
          competition_id: string;
          number: number;
          entry_id: string | null;
        };
        Insert: {
          id?: string;
          competition_id: string;
          number: number;
          entry_id?: string | null;
        };
        Update: {
          id?: string;
          competition_id?: string;
          number?: number;
          entry_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tickets_competition_id_fkey";
            columns: ["competition_id"];
            isOneToOne: false;
            referencedRelation: "competitions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_entry_id_fkey";
            columns: ["entry_id"];
            isOneToOne: false;
            referencedRelation: "entries";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      purchase_entry: {
        Args: {
          p_competition_id: string;
          p_transaction_id: string;
          p_quantity: number;
          p_answer_correct: boolean;
        };
        Returns: {
          entry_id: string;
          ticket_numbers: number[];
        }[];
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      competition_status: CompetitionStatusRow;
      competition_category: CompetitionCategoryRow;
      transaction_status: TransactionStatusRow;
    };
    CompositeTypes: Record<string, never>;
  };
}
