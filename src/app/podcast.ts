import { Identifiers } from '@angular/compiler';

export interface Podcast {
  took: number;
  count: number;
  total: number;
  results: Array<Answer>;
  next_offset: number;
}

export interface Answer {
  id: String;
  rss: String;
  link: String;
  audio: String;
  image: String;
  genre_ids: Array<any>;
  itunes_id: number;
  thumbnail: String;
  podcast_id: String;
  pub_date_ms: number;
  title_original: String;
  listennotes_url: String;
  audio_length_sec: number;
  explicit_content: boolean;
  title_highlighted: String;
  publisher_original: String;
  description_original: String;
  publisher_highlighted: String;
  podcast_title_original: String;
  description_highlighted: String;
  podcast_listennotes_url: String;
  transcripts_highlighted: Array<any>;
  podcast_title_highlighted: String;
}
