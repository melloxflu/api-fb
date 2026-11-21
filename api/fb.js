export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL kosong' });

    try {
        // Kita nembak fdown.net dari server Vercel (bebas CORS)
        const targetUrl = `https://fdown.net/download.php?URLz=${encodeURIComponent(url)}`;
        
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        const htmlText = await response.text();
        
        // Ekstrak link MP4 dari HTML fdown
        const hdMatch = htmlText.match(/href="(https:\/\/[^"]+\.mp4[^"]*)"/g);
        
        let videoUrl = null;
        if (hdMatch && hdMatch.length > 0) {
            // Ambil link pertama yang ketemu
            videoUrl = hdMatch[0].replace('href="', '').replace('"', '');
        }

        if (videoUrl) {
            return res.status(200).json({ 
                success: true, 
                data: {
                    title: 'Video Facebook',
                    media: {
                        hd: videoUrl,
                        sd: videoUrl
                    }
                } 
            });
        } else {
            return res.status(400).json({ success: false, error: 'Video tidak ditemukan. Pastikan link publik.' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
