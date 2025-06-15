// hooks/useTopVideos.ts
import { useEffect, useState } from 'react';
import { YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } from '../config/youtube';

export type Video = { id: string; thumbnail: string; title: string };

export function useTopVideos(maxResults = 10) {
  const [videos, setVideos]   = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchVideos() {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?` +
            `key=${YOUTUBE_API_KEY}` +
            `&channelId=${YOUTUBE_CHANNEL_ID}` +
            `&part=snippet&order=viewCount&maxResults=${maxResults}&type=video`
        );
        const data = await res.json();
        if (!isMounted) return;
        const items = Array.isArray(data.items)
          ? data.items.map((it: any) => ({
              id: it.id.videoId,
              thumbnail: it.snippet.thumbnails.medium.url,
              title: it.snippet.title,
            }))
          : [];
        setVideos(items);
      } catch (err) {
        console.error('youtube fetch error', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchVideos();
    return () => { isMounted = false; };
  }, [maxResults]);

  return { videos, loading };
}
