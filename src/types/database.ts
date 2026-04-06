export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          email?: string;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      company_members: {
        Row: {
          id: string;
          company_id: string;
          user_id: string;
          role: MemberRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          user_id: string;
          role?: MemberRole;
          created_at?: string;
        };
        Update: {
          role?: MemberRole;
        };
      };
      properties: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          address_line_1: string;
          address_line_2: string | null;
          city: string;
          state: string;
          postal_code: string;
          notes: string | null;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          address_line_1: string;
          address_line_2?: string | null;
          city: string;
          state: string;
          postal_code: string;
          notes?: string | null;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          address_line_1?: string;
          address_line_2?: string | null;
          city?: string;
          state?: string;
          postal_code?: string;
          notes?: string | null;
          is_archived?: boolean;
          updated_at?: string;
        };
      };
      units: {
        Row: {
          id: string;
          company_id: string;
          property_id: string;
          unit_number: string;
          bedrooms: number | null;
          bathrooms: number | null;
          square_feet: number | null;
          market_rent: number | null;
          notes: string | null;
          status: UnitStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          property_id: string;
          unit_number: string;
          bedrooms?: number | null;
          bathrooms?: number | null;
          square_feet?: number | null;
          market_rent?: number | null;
          notes?: string | null;
          status?: UnitStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          unit_number?: string;
          bedrooms?: number | null;
          bathrooms?: number | null;
          square_feet?: number | null;
          market_rent?: number | null;
          notes?: string | null;
          status?: UnitStatus;
          updated_at?: string;
        };
      };
      turnovers: {
        Row: {
          id: string;
          company_id: string;
          property_id: string;
          unit_id: string;
          move_out_date: string;
          target_ready_date: string;
          actual_ready_date: string | null;
          status: TurnoverStatus;
          priority: TurnoverPriority;
          notes: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          property_id: string;
          unit_id: string;
          move_out_date: string;
          target_ready_date: string;
          actual_ready_date?: string | null;
          status?: TurnoverStatus;
          priority?: TurnoverPriority;
          notes?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          move_out_date?: string;
          target_ready_date?: string;
          actual_ready_date?: string | null;
          status?: TurnoverStatus;
          priority?: TurnoverPriority;
          notes?: string | null;
          updated_at?: string;
        };
      };
      turnover_tasks: {
        Row: {
          id: string;
          company_id: string;
          turnover_id: string;
          title: string;
          description: string | null;
          assigned_to_name: string | null;
          due_date: string | null;
          status: TaskStatus;
          priority: TaskPriority;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          turnover_id: string;
          title: string;
          description?: string | null;
          assigned_to_name?: string | null;
          due_date?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          assigned_to_name?: string | null;
          due_date?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          sort_order?: number;
          updated_at?: string;
        };
      };
      turnover_photos: {
        Row: {
          id: string;
          company_id: string;
          turnover_id: string;
          image_path: string;
          caption: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          turnover_id: string;
          image_path: string;
          caption?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          caption?: string | null;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          company_id: string;
          user_id: string | null;
          entity_type: string;
          entity_id: string;
          action_type: string;
          message: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          user_id?: string | null;
          entity_type: string;
          entity_id: string;
          action_type: string;
          message: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: never;
      };
    };
  };
};

// Enums
export type MemberRole = "owner" | "admin" | "member" | "viewer";
export type UnitStatus = "occupied" | "vacant" | "make_ready" | "ready";
export type TurnoverStatus = "not_started" | "in_progress" | "blocked" | "ready";
export type TurnoverPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "not_started" | "in_progress" | "done" | "blocked";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

// Row type shortcuts
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type CompanyMember = Database["public"]["Tables"]["company_members"]["Row"];
export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type Unit = Database["public"]["Tables"]["units"]["Row"];
export type Turnover = Database["public"]["Tables"]["turnovers"]["Row"];
export type TurnoverTask = Database["public"]["Tables"]["turnover_tasks"]["Row"];
export type TurnoverPhoto = Database["public"]["Tables"]["turnover_photos"]["Row"];
export type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"];

// Extended types with joins
export type TurnoverWithDetails = Turnover & {
  property: Pick<Property, "id" | "name" | "city" | "state">;
  unit: Pick<Unit, "id" | "unit_number" | "bedrooms" | "bathrooms">;
  tasks?: TurnoverTask[];
  photos?: TurnoverPhoto[];
  activity?: ActivityLog[];
};

export type UnitWithProperty = Unit & {
  property: Pick<Property, "id" | "name" | "city" | "state">;
};
