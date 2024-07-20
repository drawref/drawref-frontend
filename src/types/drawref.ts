export type Tag = {
  id: string;
  name: string;
  values: string[];
};

export type TagMap = Record<string, string[]>;

export type Category = {
  id: string;
  name: string;
  cover?: string;
  cover_id?: number;
  tags: Tag[];
};

export type Image = {
  id: number;
  path: string;
  author: string;
  author_url: string;
  tags?: TagMap;
};

export type ImageList = Image[];

export type TimingData = {
  timingType: string;
  staticTime: string;
  classLength: string;
};
