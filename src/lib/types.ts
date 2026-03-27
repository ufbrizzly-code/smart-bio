export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  theme_id?: string;
  created_at: string;
}

export interface SmartRule {
  id: string;
  link_id: string;
  rule_type: 'time_based' | 'click_limit' | 'location_based';
  config: {
    start_time?: string;
    end_time?: string;
    max_clicks?: number;
    locations?: string[];
  };
  is_active: boolean;
}

export interface Link {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  position: number;
  is_visible: boolean;
  created_at: string;
  rules?: SmartRule[];
  click_count?: number;
}
