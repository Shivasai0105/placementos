const express = require('express');
const auth = require('../middleware/authMiddleware');
const Application = require('../models/Application');

const router = express.Router();
router.use(auth);

// GET /api/applications — list all for user
router.get('/', async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error('Get applications error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/applications — create new
router.post('/', async (req, res) => {
  try {
    const { company, role, status, link, notes, salary, appliedDate } = req.body;
    if (!company) return res.status(400).json({ message: 'Company name is required.' });

    const app = await Application.create({
      userId: req.userId,
      company, role, status, link, notes, salary,
      appliedDate: appliedDate ? new Date(appliedDate) : null,
    });
    res.status(201).json(app);
  } catch (err) {
    console.error('Create application error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/applications/scrape — Scrapes a job URL for metadata
router.post('/scrape', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'URL is required.' });

    // Ensure URL has protocol
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    let company = '';
    let role = 'Software Engineer';
    let notes = '';

    // Step 1: Guess company from domain as primary/fallback
    try {
      const urlObj = new URL(targetUrl);
      let host = urlObj.hostname.replace('www.', '');
      
      if (host.includes('linkedin')) company = 'LinkedIn';
      else if (host.includes('indeed')) company = 'Indeed';
      else if (host.includes('glassdoor')) company = 'Glassdoor';
      else if (host.includes('wellfound') || host.includes('angel.co')) company = 'Wellfound';
      else if (host.includes('google')) company = 'Google';
      else if (host.includes('amazon')) company = 'Amazon';
      else if (host.includes('microsoft')) company = 'Microsoft';
      else if (host.includes('meta') || host.includes('facebook')) company = 'Meta';
      else if (host.includes('netflix')) company = 'Netflix';
      else if (host.includes('apple')) company = 'Apple';
      else {
        const parts = host.split('.');
        if (parts.length >= 2) {
          const name = parts[parts.length - 2];
          company = name.charAt(0).toUpperCase() + name.slice(1);
        } else {
          company = host;
        }
      }
    } catch (urlErr) {
      console.warn('URL parsing error:', urlErr.message);
    }

    // Step 2: Fetch webpage to extract HTML metadata
    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(5000), // 5 seconds timeout
      });

      if (response.ok) {
        const html = await response.text();

        // Extract <title>
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          const pageTitle = titleMatch[1].trim();
          
          // Try to clean job title
          let cleaned = pageTitle;
          const dividers = [' - ', ' | ', ' : ', ' – ', ' · ', ' • '];
          for (const div of dividers) {
            if (cleaned.includes(div)) {
              cleaned = cleaned.split(div)[0].trim();
              break;
            }
          }
          cleaned = cleaned.replace(/Job Application for/i, '');
          cleaned = cleaned.replace(/Careers? at/i, '');
          cleaned = cleaned.replace(/Job Details/i, '');
          cleaned = cleaned.replace(/Hiring/i, '');
          
          role = cleaned.trim() || 'Software Engineer';
        }

        // Extract meta description for notes
        const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i) ||
                           html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i);
        if (descMatch && descMatch[1]) {
          notes = descMatch[1].trim();
        }

        // Refine company name if og:site_name exists
        const siteNameMatch = html.match(/<meta[^>]*property="og:site_name"[^>]*content="([^"]+)"/i);
        if (siteNameMatch && siteNameMatch[1]) {
          const siteName = siteNameMatch[1].trim();
          if (siteName && !['linkedin', 'indeed', 'glassdoor', 'greenhouse', 'lever', 'workday'].some(x => siteName.toLowerCase().includes(x))) {
            company = siteName;
          }
        }
      }
    } catch (fetchErr) {
      console.warn('Scraping page failed, using URL fallbacks:', fetchErr.message);
    }

    res.json({
      company: company || 'Company',
      role: role || 'Software Engineer',
      link: targetUrl,
      notes: notes ? (notes.length > 200 ? notes.substring(0, 197) + '...' : notes) : '',
    });
  } catch (err) {
    console.error('URL Scraper Error:', err);
    res.status(500).json({ message: 'Failed to extract job details.' });
  }
});

// PATCH /api/applications/:id — update (status, notes, etc.)
router.patch('/:id', async (req, res) => {
  try {
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found.' });
    res.json(app);
  } catch (err) {
    console.error('Update application error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/applications/:id
router.delete('/:id', async (req, res) => {
  try {
    const app = await Application.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!app) return res.status(404).json({ message: 'Application not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) {
    console.error('Delete application error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
