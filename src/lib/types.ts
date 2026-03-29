export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  
  // Header
  profile_layout?: 'classic' | 'hero';
  title_style?: 'text' | 'logo';
  title_size?: 'small' | 'large';
  alt_font?: boolean;
  
  // Design & Theme
  theme?: string;
  wallpaper?: string;
  wallpaper_style?: 'fill' | 'gradient' | 'blur' | 'pattern' | 'image' | 'video';
  custom_bg?: string;
  accent_color?: string;
  title_color?: string;
  bio_color?: string;
  page_text_color?: string;
  page_font?: string;
  
  // Buttons
  button_style?: 'solid' | 'glass' | 'outline';
  button_roundness?: 'square' | 'round' | 'rounder' | 'full';
  button_shadow?: 'none' | 'soft' | 'strong' | 'hard';
  button_color?: string;
  button_text_color?: string;
  
  show_footer?: boolean;
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
