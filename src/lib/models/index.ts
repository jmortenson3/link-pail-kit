export type UserProfile = {
  id: string,
  username: string,
  avatar_url: string,
  created_at: string,
}

export type Collection = {
  id: string,
  name: string,
  is_private: boolean,
  created_at: string,
  updated_at: string,
  collection_links?: CollectionLink[],
  collection_links_count: {count: number}[],
}

export type CollectionLink = {
  id: string,
  collection_id: string,
  url: string,
  description: string,
  created_at: string,
  updated_at: string,
  ogTags?: OGTags,
}

export type UserCollection = {
  user_id: string,
  collection_id: string,
  is_owner: boolean,
  can_edit: boolean,
  created_at: string,
}

export type OGTags = {
	originalUrl: string;
	title: string;
	type: string;
	image: string;
	url: string;
	description: string;
	site_name: string;
	icon: string;
	keywords: string;
};