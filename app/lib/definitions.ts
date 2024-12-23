export type ImageS3 = {
  id: string;
  name: string;
  src: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
};

export type SharedAlbum = {
  id: string;
  title: string;
  description?: string;
  shareToken: string;
  user_name: string;
  photos: ImageS3[];
};
