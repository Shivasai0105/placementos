/**
 * geminiClient.js
 * Calls Gemini REST API directly from the browser.
 * Zero backend load — all AI processing happens client → Gemini.
 */

/**
 * Model priority order:
 * - gemini-2.0-flash-lite : separate free-tier quota bucket, fast, reliable JSON
 * - gemini-2.5-flash      : works but uses "thinking" tokens; goes last as fallback
 * - gemini-1.5-flash (removed - deprecated / 404 on v1beta)
 * - gemini-2.0-flash      : usually hits 429 quota first
 */
const MODELS = [
  { id: 'gemini-2.0-flash-lite', maxOut: 8192  },
  { id: 'gemini-2.5-flash',      maxOut: 16384 }, // higher limit for thinking overhead
  { id: 'gemini-2.0-flash',      maxOut: 8192  },
];

const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Call Gemini with a prompt, trying model fallbacks.
 * @param {string} prompt
 * @param {object} [opts] - { jsonMode: bool, maxOutputTokens: number }
 * @returns {Promise<string>} Raw text from Gemini
 */
export async function callGemini(prompt, opts = {}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('NO_API_KEY');
  }

  const { jsonMode = false } = opts;

  let lastError = null;

  for (const model of MODELS) {
    try {
      const url = `${BASE}/${model.id}:generateContent?key=${apiKey}`;
      const body = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: model.maxOut,
          temperature: 0.2,       // low = deterministic JSON
          topP: 0.8,
          ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
        },
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        const parts = data.candidates?.[0]?.content?.parts || [];

        // Filter out "thought" parts (gemini-2.5 thinking mode)
        const text = parts
          .filter(p => p.text && !p.thought)
          .map(p => p.text)
          .join('');

        if (text && text.trim().length > 10) {
          console.log(`[Gemini] ✅ ${model.id} → ${text.length} chars`);
          return text;
        }

        console.warn(`[Gemini] ${model.id} returned empty text, trying next model`);

      } else {
        const err = await res.json().catch(() => ({}));
        lastError = err.error?.message || `HTTP ${res.status}`;
        console.warn(`[Gemini] ❌ ${model.id}: ${lastError}`);
      }
    } catch (e) {
      lastError = e.message;
      console.warn(`[Gemini] ❌ ${model.id} fetch error:`, e.message);
    }
  }

  throw new Error(lastError || 'All Gemini models failed');
}

/**
 * Robustly parse JSON from Gemini output.
 * Handles: raw JSON, markdown fences, JSON embedded in text, truncated JSON.
 */
export function parseGeminiJson(text) {
  if (!text || !text.trim()) throw new Error('Empty response from Gemini');

  const t = text.trim();

  // 1. Direct parse — cleanest path
  try { return JSON.parse(t); } catch (_) {}

  // 2. Strip markdown fences ```json ... ``` or ``` ... ```
  const fenceMatch = t.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch?.[1]) {
    try { return JSON.parse(fenceMatch[1].trim()); } catch (_) {}
  }

  // 3. Find the first { and attempt repair of truncated JSON
  const objStart = t.indexOf('{');
  if (objStart !== -1) {
    const objSlice = t.slice(objStart);

    // 3a. Try the full slice first
    try { return JSON.parse(objSlice); } catch (_) {}

    // 3b. Try up to the last complete top-level field (repair truncation)
    const repaired = repairTruncatedJson(objSlice);
    if (repaired) {
      try { return JSON.parse(repaired); } catch (_) {}
    }
  }

  // 4. Array fallback
  const aStart = t.indexOf('[');
  if (aStart !== -1) {
    try { return JSON.parse(t.slice(aStart, t.lastIndexOf(']') + 1)); } catch (_) {}
  }

  console.error('[Gemini] Parse failed. Raw (first 600):', t.slice(0, 600));
  throw new Error('Could not parse Gemini JSON response. Open DevTools console to see raw output.');
}

/**
 * Attempt to repair a truncated JSON object by closing open brackets/braces.
 */
function repairTruncatedJson(str) {
  try {
    // Stack-based bracket tracker
    const opens = [];
    let inString = false;
    let escape = false;

    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (escape) { escape = false; continue; }
      if (ch === '\\' && inString) { escape = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === '{' || ch === '[') opens.push(ch === '{' ? '}' : ']');
      if (ch === '}' || ch === ']') opens.pop();
    }

    if (opens.length === 0) return str; // already balanced

    // Truncate to last complete comma-separated value to avoid partial entries
    let truncated = str.trimEnd();
    // Remove trailing incomplete value (ends without comma or closing bracket)
    truncated = truncated.replace(/,\s*$/, '');           // trailing comma
    truncated = truncated.replace(/:\s*"[^"]*$/, '');     // incomplete string value
    truncated = truncated.replace(/:\s*[\d.]*$/, '');     // incomplete number
    truncated = truncated.trimEnd().replace(/,\s*$/, ''); // any new trailing comma

    // Close all open brackets
    return truncated + opens.reverse().join('');
  } catch (_) {
    return null;
  }
}
