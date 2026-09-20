export type Tag = {
  id: string;
  name: string;
  values: string[];
};

export type TagMap = Record<string, string[]>;

export type Category = {
  id: string;
  display_name?: string;
  cover_image?: number;
  tags: Tag[];
  position?: number;
};

export type Image = {
  id: number;
  source_id: number;
  relative_path: string;
  file_hash?: string;
  local_path?: string;
  external_url?: string;
  category_override?: string | null;
  author_override?: string | null;
  author_url_override?: string | null;
  tags_override?: TagMap | null;
  effective_category_id?: string;
  effective_author?: string;
  effective_author_url?: string;
  effective_tags?: TagMap;
};

export type ImageList = Image[];

export type TimingData = {
  timingType: string;
  staticTime: string;
  classLength: string;
};

export type Source = {
  id?: number;
  name: string;
  source_type: string;
  root_path: string;
  enabled: boolean;
  last_scanned_at?: string;
};

export type PathMetadata = {
  id?: number;
  source_id: number;
  relative_path: string;
  category_id?: string;
  author?: string;
  author_url?: string;
  tags: TagMap;
  tag_mode: string;
};
