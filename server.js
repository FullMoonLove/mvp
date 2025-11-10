import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.set('trust proxy', 1);

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

app.use(express.static(path.join(__dirname, 'dist'), {
  etag: false,
  maxAge: 0
}));

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    console.log(`\n🔍 iTunes 검색어: "${q}"`);
    
    const query = encodeURIComponent(q);
    const response = await fetch(`https://itunes.apple.com/search?term=${query}&media=music&entity=song&limit=20`);
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      console.log('❌ 검색 결과 없음');
      return res.json({ tracks: [] });
    }

    const tracks = data.results.map(track => ({
      id: track.trackId.toString(),
      name: track.trackName,
      artists: [{ name: track.artistName }],
      album: {
        name: track.collectionName,
        images: [{ url: track.artworkUrl100.replace('100x100bb', '600x600bb') }]
      },
      duration_ms: track.trackTimeMillis,
      preview_url: track.previewUrl || null,
      external_urls: {
        spotify: track.trackViewUrl
      }
    }));

    const tracksWithPreview = tracks.filter(track => track.preview_url);
    console.log(`📊 총 ${tracks.length}곡 검색됨, ${tracksWithPreview.length}곡에 미리듣기 있음\n`);

    res.json({ tracks: tracksWithPreview.length > 0 ? tracksWithPreview : tracks });
  } catch (error) {
    console.error('iTunes search error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Music Shorts API server running on port ${PORT}`);
  console.log(`🎵 iTunes API 전용 - 로그인 불필요`);
});
