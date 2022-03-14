import type { OGTags } from "$lib/models";

export default class OGTagsCache {
  static cache: OGTags[] = [];

  static add(ogTags: OGTags) {
    if (!this.get(ogTags.originalUrl)) {
      this.cache.push(ogTags);
    }
  }

  static get(url): OGTags {
    return this.cache.find(ogTags => ogTags.originalUrl === url);
  }
}