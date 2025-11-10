export async function searchTracks(query) {
  try {
    // Frontend-only: call iTunes API directly (CORS enabled)
    const term = encodeURIComponent(query);
    const response = await fetch(`https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=20`);
    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status}`);
    }
    const data = await response.json();

    const results = Array.isArray(data.results) ? data.results : [];
    if (results.length === 0) {
      return [];
    }

    // Map to the same structure used across the app
    const tracks = results.map((track) => {
      const artwork100 = track.artworkUrl100 || '';
      const img100 = artwork100;
      const img300 = artwork100 ? artwork100.replace('100x100bb', '300x300bb') : '';
      const img600 = artwork100 ? artwork100.replace('100x100bb', '600x600bb') : '';
      return {
        id: String(track.trackId),
        name: track.trackName,
        artists: [{ name: track.artistName }],
        album: {
          name: track.collectionName,
          // indices [0]=large, [1]=medium, [2]=small to satisfy various UI usages
          images: [
            { url: img600 },
            { url: img300 },
            { url: img100 }
          ]
        },
        duration_ms: track.trackTimeMillis,
        preview_url: track.previewUrl || null,
        external_urls: {
          spotify: track.trackViewUrl
        }
      };
    });

    // Prefer tracks with preview; fall back to all if none have preview
    const tracksWithPreview = tracks.filter(t => !!t.preview_url);
    return tracksWithPreview.length > 0 ? tracksWithPreview : tracks;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}
