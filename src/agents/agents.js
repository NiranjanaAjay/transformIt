const AGENT_DELAY_MS = 850;
const SPARSE_BRIEF_WORDS = 18;

function wait(ms = AGENT_DELAY_MS) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function sanitizeSource(sourceDocument) {
  return String(sourceDocument || '')
    .replace(/\r/g, '')
    .trim();
}

function countWords(text) {
  return String(text || '')
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function unique(values) {
  return Array.from(new Set(values));
}

function pickFirst(lines, limit) {
  return lines.slice(0, limit);
}

function detectAudiences(text) {
  const audienceHints = [
    'marketing team',
    'sales team',
    'product team',
    'startup founders',
    'small business owners',
    'enterprise teams',
    'operations teams',
    'customer success teams',
  ];

  const lowerText = text.toLowerCase();
  const matched = audienceHints.filter((hint) => lowerText.includes(hint));

  if (matched.length > 0) {
    return matched;
  }

  return ['cross-functional teams', 'campaign managers'];
}

function extractBullets(lines) {
  const bulletMatches = lines
    .filter((line) => /^\s*[-*•]|^\s*\d+[.)]/.test(line))
    .map((line) => line.replace(/^\s*[-*•]|^\s*\d+[.)]/, '').trim())
    .filter(Boolean);

  if (bulletMatches.length > 0) {
    return bulletMatches;
  }

  return [];
}

function extractNumberFacts(text) {
  return unique(text.match(/\b\d+(?:[.,]\d+)?%?|\$\d+(?:[.,]\d+)?\b/g) || []).slice(0, 6);
}

function extractKeywords(text) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 4);

  const stopWords = new Set([
    'about', 'above', 'after', 'again', 'campaign', 'because', 'before', 'being', 'below',
    'could', 'every', 'first', 'great', 'other', 'their', 'there', 'these', 'those', 'using',
    'where', 'which', 'while', 'would',
  ]);

  const frequency = new Map();
  words.forEach((word) => {
    if (stopWords.has(word)) {
      return;
    }
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
}

function toneFromSource(source) {
  const text = source.toLowerCase();
  if (/fun|cheerful|playful|friendly|lighthearted/.test(text)) {
    return 'playful';
  }

  if (/formal|enterprise|compliance|governance/.test(text)) {
    return 'formal';
  }

  return 'balanced';
}

function inferResearchProfile(source) {
  const text = String(source || '').toLowerCase();

  if (/\b(ai|automation|copilot|agent|workflow)\b/.test(text)) {
    return {
      valueProposition: 'Turn a short brief into channel-ready campaign content with fewer handoff delays.',
      insights: [
        'Teams adopt faster when every channel reuses one core message architecture.',
        'Review checkpoints reduce rework when they happen before publishing.',
      ],
      messages: [
        'Build one source of truth before writing channel variants.',
        'Use editor checks to catch unclear or risky claims early.',
        'Keep marketing, sales, and product aligned on one narrative.',
      ],
      audiences: ['marketing team', 'sales team', 'product team'],
      assumption: 'The campaign emphasizes speed, alignment, and quality control across teams.',
    };
  }

  if (/\b(shop|store|ecommerce|e-commerce|retail|product launch)\b/.test(text)) {
    return {
      valueProposition: 'Launch faster with messaging that ties product value to daily customer outcomes.',
      insights: [
        'Product campaigns convert better when benefits are written in customer language.',
        'Channel consistency improves trust during launch windows.',
      ],
      messages: [
        'Lead with customer outcomes before listing product features.',
        'Keep social copy concise and CTA-focused during launch week.',
        'Mirror the same offer framing in blog, social, and email.',
      ],
      audiences: ['small business owners', 'marketing team'],
      assumption: 'The campaign focus is product positioning plus a clear promotional CTA.',
    };
  }

  return {
    valueProposition: 'Convert a rough idea into a structured campaign narrative that is easy to publish.',
    insights: [
      'Campaign quality improves when teams align on audience, message, and CTA first.',
      'Clear handoffs keep revisions small and publishing cycles predictable.',
    ],
    messages: [
      'Start from one explicit audience and one core promise.',
      'Translate the same promise into blog, social, and email formats.',
      'Validate clarity and accuracy before publishing.',
    ],
    audiences: ['cross-functional teams', 'campaign managers'],
    assumption: 'The brief describes a campaign concept that needs structure for multi-channel execution.',
  };
}

function isSparseBrief(source) {
  const cleaned = sanitizeSource(source);
  if (!cleaned) {
    return true;
  }

  const sentenceCount = splitSentences(cleaned).length;
  return countWords(cleaned) <= SPARSE_BRIEF_WORDS || sentenceCount < 2;
}

function cleanHedgingLanguage(line) {
  return String(line || '')
    .replace(/\b(maybe|possibly|might|could|perhaps)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function readableList(items = []) {
  const cleanItems = unique(
    items
      .map((item) => String(item || '').trim())
      .filter(Boolean),
  );

  if (cleanItems.length === 0) {
    return '';
  }

  if (cleanItems.length === 1) {
    return cleanItems[0];
  }

  if (cleanItems.length === 2) {
    return `${cleanItems[0]} and ${cleanItems[1]}`;
  }

  return `${cleanItems.slice(0, -1).join(', ')}, and ${cleanItems[cleanItems.length - 1]}`;
}

function shorten(text, maxLength = 140) {
  const cleanText = String(text || '').replace(/\s+/g, ' ').trim();
  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  return `${cleanText.slice(0, Math.max(0, maxLength - 1)).trim()}...`;
}

function ensureSentence(text) {
  const cleanText = String(text || '').trim();
  if (!cleanText) {
    return '';
  }

  return /[.!?]$/.test(cleanText) ? cleanText : `${cleanText}.`;
}

function cleanSummary(summary) {
  return String(summary || '')
    .replace(/\s*Research context\s*:\s*.*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizePhrase(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function distinctMessages(messages = [], exclusions = []) {
  const blocked = exclusions.map(normalizePhrase).filter(Boolean);
  const selected = [];

  messages.forEach((message) => {
    const cleanMessage = cleanHedgingLanguage(String(message || '')).trim();
    const normalized = normalizePhrase(cleanMessage);

    if (!normalized) {
      return;
    }

    const duplicatesBlocked = blocked.some(
      (entry) => entry.includes(normalized) || normalized.includes(entry),
    );

    const duplicatesSelected = selected.some(
      (entry) => entry.normalized.includes(normalized) || normalized.includes(entry.normalized),
    );

    if (duplicatesBlocked || duplicatesSelected) {
      return;
    }

    selected.push({ text: cleanMessage, normalized });
  });

  return selected.map((entry) => entry.text);
}

function inferCallToAction(text) {
  const source = String(text || '').toLowerCase();

  if (/\b(book|schedule).{0,18}\bdemo\b|\bdemo\b/.test(source)) {
    return 'Book a demo';
  }

  if (/\bfree trial\b|\bstart trial\b|\btrial\b/.test(source)) {
    return 'Start a free trial';
  }

  if (/\bdownload\b|\bguide\b|\bplaybook\b/.test(source)) {
    return 'Download the guide';
  }

  if (/\bregister\b|\bwebinar\b|\bevent\b/.test(source)) {
    return 'Register now';
  }

  if (/\bcontact\b|\breach out\b|\btalk to\b/.test(source)) {
    return 'Contact our team';
  }

  return 'Reply to get a tailored campaign draft for your channels';
}

function buildBlogTitle(factSheet) {
  const topic = shorten(readableList((factSheet.keywords || []).slice(0, 2)), 40);
  const audience = String((factSheet.targetAudience || [])[0] || '').trim();

  if (topic && audience) {
    return `${topic}: a practical campaign plan for ${audience}`;
  }

  if (topic) {
    return `${topic}: turning one brief into a campaign plan`;
  }

  return 'From brief to campaign: a practical execution plan';
}

export const ResearchAgent = {
  name: 'Research Agent',
  async process(sourceDocument) {
    const cleanedSource = sanitizeSource(sourceDocument);
    await wait();

    if (!cleanedSource) {
      return {
        summary: 'No source brief was provided.',
        valueProposition: 'A clear source brief is required to generate campaign outputs.',
        keyMessages: ['Provide a source brief to continue.'],
        targetAudience: ['campaign managers'],
        supportingFacts: [],
        flaggedAmbiguities: ['The source brief is empty.'],
        keywords: [],
        tone: 'balanced',
        briefingDepth: 'lean',
        researchInsights: [],
        assumptions: ['No source brief was available, so no research expansion could be applied.'],
      };
    }

    const lines = cleanedSource.split('\n').map((line) => line.trim()).filter(Boolean);
    const sentences = splitSentences(cleanedSource);
    const profile = inferResearchProfile(cleanedSource);
    const keyMessages = extractBullets(lines);
    const leadingSentences = pickFirst(sentences, 3);

    const summary = pickFirst(sentences, 2).join(' ') || cleanedSource.slice(0, 220);
    const baseValueProposition = leadingSentences[0] || cleanedSource.slice(0, 120);
    const valueProposition = countWords(baseValueProposition) < 8
      ? profile.valueProposition
      : baseValueProposition;
    const fallbackKeyMessages = distinctMessages([
      ...profile.messages,
      ...leadingSentences,
    ]).slice(0, 5);

    const baseFactSheet = {
      summary,
      valueProposition,
      keyMessages: keyMessages.length > 0 ? keyMessages.slice(0, 5) : fallbackKeyMessages,
      targetAudience: detectAudiences(cleanedSource),
      suggestedCTA: inferCallToAction(cleanedSource),
      supportingFacts: extractNumberFacts(cleanedSource),
      flaggedAmbiguities: lines
        .filter((line) => /\b(maybe|possibly|tbd|to be decided|unclear)\b/i.test(line))
        .slice(0, 4),
      keywords: extractKeywords(cleanedSource),
      tone: toneFromSource(cleanedSource),
      briefingDepth: isSparseBrief(cleanedSource) ? 'lean' : 'full',
      researchInsights: [],
      assumptions: [],
    };

    return baseFactSheet;
  },
  async expandFactSheet(factSheet, sourceDocument) {
    await wait(560);

    const profile = inferResearchProfile(sourceDocument || factSheet.summary);
    const supportingFacts = Array.isArray(factSheet.supportingFacts) ? factSheet.supportingFacts : [];
    const assumptions = [
      ...(factSheet.assumptions || []),
      'Source brief was short, so researcher expanded message angles from the detected campaign intent.',
      profile.assumption,
      supportingFacts.length === 0
        ? 'No numeric proof points were provided. Keep claims qualitative until metrics are confirmed.'
        : null,
    ].filter(Boolean);

    const expandedMessages = unique([
      ...(factSheet.keyMessages || []),
      ...profile.messages,
    ]).map(cleanHedgingLanguage).filter(Boolean).slice(0, 5);

    return {
      ...factSheet,
      summary: `${factSheet.summary} Research context: ${profile.insights[0]}`,
      valueProposition: cleanHedgingLanguage(factSheet.valueProposition) || profile.valueProposition,
      keyMessages: expandedMessages,
      targetAudience: unique([...(factSheet.targetAudience || []), ...profile.audiences]).slice(0, 4),
      researchInsights: unique([...(factSheet.researchInsights || []), ...profile.insights]).slice(0, 4),
      assumptions: unique(assumptions).slice(0, 5),
      briefingDepth: 'lean',
    };
  },
  async prepareDraftGuidance(factSheet) {
    await wait(460);

    const hasNumericFacts = (factSheet.supportingFacts || []).length > 0;
    const guidance = unique([
      ...(factSheet.researchInsights || []),
      hasNumericFacts
        ? 'Use only the numeric facts present in the source brief and keep wording exact.'
        : 'Avoid adding made-up metrics. Keep evidence language qualitative until proof points are confirmed.',
      'Keep one consistent promise across blog, social, and email so the campaign reads as one story.',
    ]).slice(0, 5);

    return {
      ...factSheet,
      keyMessages: (factSheet.keyMessages || []).map(cleanHedgingLanguage).filter(Boolean).slice(0, 5),
      researchInsights: guidance,
    };
  },
  async resolveFeedback(factSheet, feedback = []) {
    await wait(520);

    const feedbackText = (feedback || []).map((note) => String(note?.content || '')).join(' ').toLowerCase();
    const hasAmbiguityFeedback = /ambiguous|unclear/.test(feedbackText);
    const hasClaimFeedback = /unverified numeric claims|unverified/.test(feedbackText);

    const revisedMessages = (factSheet.keyMessages || [])
      .map(cleanHedgingLanguage)
      .filter(Boolean)
      .slice(0, 5);

    const revisedInsights = unique([
      ...(factSheet.researchInsights || []),
      hasClaimFeedback ? 'Use only source-backed numbers and avoid introducing new quantitative claims.' : null,
      hasAmbiguityFeedback ? 'Replace vague wording with direct and verifiable language before publishing.' : null,
    ].filter(Boolean)).slice(0, 5);

    const revisedAssumptions = unique([
      ...(factSheet.assumptions || []),
      hasAmbiguityFeedback ? 'Final offer details and ownership should be confirmed before launch.' : null,
    ].filter(Boolean)).slice(0, 6);

    return {
      ...factSheet,
      keyMessages: revisedMessages,
      researchInsights: revisedInsights,
      assumptions: revisedAssumptions,
    };
  },
};

function lineFromFact(value, fallback) {
  const cleanValue = cleanHedgingLanguage(String(value || '')).replace(/\s+/g, ' ').trim();
  return cleanValue.length > 0 ? cleanValue : fallback;
}

function buildBlog(factSheet) {
  const opening = lineFromFact(factSheet.valueProposition, 'This campaign starts from one clear promise.');
  const summary = lineFromFact(
    cleanSummary(factSheet.summary),
    'The source brief needs one clear narrative before channel execution.',
  );
  const points = distinctMessages((factSheet.keyMessages || []), [opening, summary])
    .slice(0, 3);
  const audience = readableList((factSheet.targetAudience || []).slice(0, 3)) || 'cross-functional teams';
  const facts = (factSheet.supportingFacts || []).slice(0, 3);
  const researchInsights = (factSheet.researchInsights || []).slice(0, 2);
  const cta = lineFromFact(factSheet.suggestedCTA, 'Reply to get a tailored campaign draft for your channels');

  const lines = [
    `# ${buildBlogTitle(factSheet)}`,
    '',
    opening,
    '',
    summary,
    '',
    '## Who this message is for',
    `Primary audience: ${audience}.`,
    '',
    '## Messaging priorities',
  ];

  if (points.length > 0) {
    points.forEach((point, index) => {
      lines.push(`${index + 1}. ${point}`);
    });
  } else {
    lines.push('1. Lead with one clear customer outcome.');
    lines.push('2. Keep wording specific and easy to verify.');
    lines.push('3. End with a direct next step.');
  }

  lines.push('');
  lines.push('## Proof and credibility');
  lines.push(
    facts.length > 0
      ? `Use only source-backed proof points: ${facts.join(', ')}.`
      : 'No numeric proof points were provided. Keep the copy specific, but avoid invented metrics.',
  );

  if (researchInsights.length > 0) {
    lines.push('');
    lines.push('## Research guidance');
    researchInsights.forEach((insight) => {
      lines.push(`- ${insight}`);
    });
  }

  lines.push('');
  lines.push('## Call to action');
  lines.push(ensureSentence(cta));

  return lines.join('\n');
}

function buildSocialThread(factSheet) {
  const headline = lineFromFact(factSheet.valueProposition, 'A clear campaign starts with a clear promise.');
  const summary = shorten(
    lineFromFact(cleanSummary(factSheet.summary), 'Align the message before scaling it across channels.'),
    120,
  );
  const points = distinctMessages((factSheet.keyMessages || []), [headline, summary]).slice(0, 2);
  const audiences = readableList((factSheet.targetAudience || []).slice(0, 2)) || 'campaign teams';
  const insight = (factSheet.researchInsights || [])[0] || 'Keep every channel anchored to one shared narrative.';
  const facts = (factSheet.supportingFacts || []).slice(0, 2);
  const cta = lineFromFact(factSheet.suggestedCTA, 'Reply for a tailored campaign draft');
  const optionalClose = points[1] && !points[1].toLowerCase().includes(cta.toLowerCase())
    ? `${points[1]} `
    : '';

  return [
    `1/ ${headline}`,
    `2/ ${summary}`,
    `3/ Built for ${audiences}. ${points[0] || 'Start with one customer outcome, then map each channel to that message.'}`,
    `4/ ${facts.length > 0 ? `Source-backed proof to keep: ${facts.join(' and ')}.` : insight}`,
    `5/ ${optionalClose}${ensureSentence(cta)}`,
  ];
}

function buildEmail(factSheet) {
  const subjectFromValue = lineFromFact(factSheet.valueProposition, 'Turn one brief into a clear campaign plan');
  const subject = subjectFromValue.length <= 68
    ? subjectFromValue
    : shorten((factSheet.keyMessages || [])[0] || subjectFromValue, 68);
  const preview = shorten(
    (factSheet.keyMessages || [])[0] || factSheet.summary || 'Clear message first, then channel execution.',
    90,
  );
  const audience = readableList((factSheet.targetAudience || []).slice(0, 2)) || 'your team';
  const keyPoint = lineFromFact(
    (factSheet.keyMessages || [])[0],
    'Anchor every channel to one clear value proposition.',
  );
  const insight = (factSheet.researchInsights || [])[0] || '';
  const cta = lineFromFact(factSheet.suggestedCTA, 'Reply and I will tailor this draft for your channel mix');

  return [
    `Subject: ${subject}`,
    `Preview: ${preview}`,
    '',
    'Hi {{first name}},',
    '',
    `${lineFromFact(cleanSummary(factSheet.summary), 'We reviewed your brief and prepared a focused campaign direction.')}`,
    '',
    `This version is shaped for ${audience} and keeps one narrative across blog, social, and email.`,
    '',
    `Top message: ${keyPoint}`,
    insight ? `Research guidance: ${insight}` : null,
    '',
    `${ensureSentence(cta)}`,
    '',
    'Best,',
    'Bloomboard team',
  ].filter(Boolean).join('\n');
}

function compressEmail(email) {
  const lines = String(email || '').split('\n').filter((line) => line.trim().length > 0);
  if (lines.length <= 8) {
    return email;
  }

  const subjectLine = lines[0].startsWith('Subject:') ? lines[0] : 'Subject: Updated campaign summary';
  const bodyLines = lines.slice(1, 6);

  return [
    subjectLine,
    '',
    ...bodyLines,
    '',
    'Let me know if you want a channel-specific version next.',
    '',
    'Best,',
    'Campaign Team',
  ].join('\n');
}

export const CopywriterAgent = {
  name: 'Copywriter Agent',
  async process(factSheet) {
    await wait();

    return {
      blog: buildBlog(factSheet),
      social: buildSocialThread(factSheet),
      email: buildEmail(factSheet),
    };
  },
  async revise(drafts, factSheet, feedback = []) {
    await wait();

    const hasCriticalFeedback = feedback.some((note) => note.type === 'critical');
    const hasLengthFeedback = feedback.some((note) => /longer than recommended/i.test(note.content || ''));

    const regenerated = hasCriticalFeedback
      ? {
        blog: buildBlog(factSheet),
        social: buildSocialThread(factSheet),
        email: buildEmail(factSheet),
      }
      : {
        blog: drafts.blog,
        social: drafts.social,
        email: drafts.email,
      };

    if (hasLengthFeedback) {
      regenerated.email = compressEmail(regenerated.email);
    }

    return regenerated;
  },
};

function findUnbackedNumericClaims(text, allowedFacts) {
  const claims = unique(text.match(/\b\d+(?:[.,]\d+)?%?|\$\d+(?:[.,]\d+)?\b/g) || []);
  const factSet = new Set((allowedFacts || []).map((fact) => String(fact).toLowerCase()));

  return claims.filter((claim) => !factSet.has(claim.toLowerCase()));
}

export const EditorAgent = {
  name: 'Editor Agent',
  async process(drafts, factSheet) {
    await wait();

    const joinedDrafts = [drafts.blog, ...(drafts.social || []), drafts.email].join(' ');
    const unbackedClaims = findUnbackedNumericClaims(joinedDrafts, factSheet.supportingFacts || []);
    const longEmail = (drafts.email || '').length > 700;

    const feedback = [];

    if (unbackedClaims.length > 0) {
      feedback.push({
        type: 'critical',
        content: `Unverified numeric claims found: ${unbackedClaims.join(', ')}.`,
      });
    }

    if (longEmail) {
      feedback.push({
        type: 'minor',
        content: 'Email is longer than recommended. Trim it for better response rates.',
      });
    }

    if ((factSheet.flaggedAmbiguities || []).length > 0) {
      feedback.push({
        type: 'minor',
        content: 'Source brief contains ambiguous terms. Confirm details before publishing.',
      });
    }

    const hasCritical = feedback.some((note) => note.type === 'critical');

    return {
      approved: !hasCritical,
      feedback,
      reviewStatus: {
        blog: hasCritical ? 'review' : 'approved',
        social: hasCritical ? 'review' : 'approved',
        email: hasCritical ? 'review' : 'approved',
      },
    };
  },
};
