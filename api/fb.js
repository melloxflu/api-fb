const fbdl = require('fbdl-core');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL kosong' });

    try {
        const info = await fbdl.getInfo(url);
        return res.status(200).json({ success: true, data: info });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
