export type Tag = {
  id: string;
  name: string;
  values: string[];
};

export type Category = {
  id: string;
  name: string;
  cover?: string;
  cover_id?: number;
  tags: Tag[];
};
