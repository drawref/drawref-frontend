export type Tag = {
  id: string;
  name: string;
  values: string[];
};

export type Category = {
  id: string;
  name: string;
  tags: Tag[];
  cover?: number;
};
