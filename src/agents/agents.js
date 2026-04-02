// Agent 1: Research & Fact-Check Agent
export const ResearchAgent = {
  name: 'Research & Fact-Check',
  icon: '🎀',
  async process(sourceDocument) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract key information
    const extractFeatures = () => {
      const featurePatterns = [
        /feature[s]?:\s*(.+?)(?=\n|$)/gi,
        /benefit[s]?:\s*(.+?)(?=\n|$)/gi,
        /capability:\s*(.+?)(?=\n|$)/gi,
      ];
      
      let features = [];
      featurePatterns.forEach(pattern => {
        const matches = sourceDocument.matchAll(pattern);
        for (const match of matches) {
          features.push(match[1].trim());
        }
      });
      return features.length > 0 ? features : ['Core functionality', 'User benefits', 'Technical capabilities'];
    };
    
    const extractAudience = () => {
      const audiencePatterns = [
        /target.*?audience[s]?:\s*(.+?)(?=\n|$)/gi,
        /for\s+(.+?)(?:\s+user|segment)/gi,
      ];
      
      let audiences = [];
      audiencePatterns.forEach(pattern => {
        const matches = sourceDocument.matchAll(pattern);
        for (const match of matches) {
          audiences.push(match[1].trim());
        }
      });
      return audiences.length > 0 ? audiences : ['Business professionals', 'Teams', 'Organizations'];
    };
    
    const extractSpecs = () => {
      // Extract any specs, numbers, technical details
      const specs = sourceDocument.match(/\$\d+|v[\d.]+|\d+%|[\d,]+\s*(?:users|customers|downloads)/gi) || [];
      return specs.slice(0, 5);
    };
    
    const factSheet = {
      valueProposition: extractFirstSentence(sourceDocument),
      features: extractFeatures(),
      targetAudience: extractAudience(),
      technicalSpecs: extractSpecs(),
      flaggedAmbiguities: findAmbiguities(sourceDocument),
      tone: detectTone(sourceDocument),
      keyMetrics: extractMetrics(sourceDocument)
    };
    
    return factSheet;
  }
};

// Helper functions
function extractFirstSentence(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  return sentences ? sentences[0].trim() : text.substring(0, 100);
}

function findAmbiguities(text) {
  const ambiguousPatterns = [
    /maybe|perhaps|might|could|possibly|some(?:what)?|may be/gi,
    /unclear|vague|TBD|TK|pending/gi,
  ];
  
  let ambiguities = [];
  ambiguousPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const start = Math.max(0, match.index - 50);
      const end = Math.min(text.length, match.index + 50);
      ambiguities.push(text.substring(start, end));
    }
  });
  
  return ambiguities.slice(0, 3);
}

function detectTone(text) {
  const formalWords = text.match(/professional|enterprise|business-grade|robust|secure/gi) || [];
  const casualWords = text.match(/awesome|cool|amazing|fun|easy|simple/gi) || [];
  
  if (formalWords.length > casualWords.length) return 'professional';
  if (casualWords.length > formalWords.length) return 'casual';
  return 'neutral';
}

function extractMetrics(text) {
  const numbers = text.match(/\d+(?:,\d{3})*(?:\.\d+)?/g) || [];
  return numbers.slice(0, 4).map((n, i) => `Metric ${i + 1}: ${n}`);
}

// Agent 2: Creative Copywriter Agent
export const CopywriterAgent = {
  name: 'Creative Copywriter',
  icon: '🌸',
  async process(factSheet, tone = 'professional') {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const features = factSheet.features || ['Feature 1', 'Feature 2', 'Feature 3'];
    const valueProposition = factSheet.valueProposition || 'Transform your workflow';
    
    // Generate blog post
    const blogPost = generateBlogPost(valueProposition, features, factSheet);
    
    // Generate social media thread
    const socialThread = generateSocialThread(valueProposition, features, factSheet);
    
    // Generate email teaser
    const emailTeaser = generateEmailTeaser(valueProposition, features, factSheet);
    
    return {
      blog: blogPost,
      social: socialThread,
      email: emailTeaser,
      timestamp: new Date()
    };
  }
};

function generateBlogPost(title, features, factSheet) {
  const featuresList = (features && features.length > 0) ? features : ['Core Feature', 'User Benefits', 'Advanced Capabilities'];
  
  const intro = `
# ${title || 'Transforming Your Workflow'}

In today's fast-paced digital landscape, teams are constantly looking for ways to streamline their workflows and maximize productivity. This represents a breakthrough approach to operational efficiency.

## What Makes It Different

${featuresList.slice(0, 3).map((f, i) => `**${i + 1}. ${f || 'Feature ' + (i+1)}**
This feature delivers real value by enhancing user experience and enabling teams to work more efficiently.`).join('\n\n')}

## Key Benefits

✓ Increased productivity and efficiency
✓ Better team collaboration
✓ Reduced operational overhead
✓ Improved quality and outcomes
✓ Scalable solutions for growth

## Real-World Impact

Organizations using these solutions have reported:
- 40-60% improvement in task completion times
- Enhanced communication across teams
- Better project visibility and control
- Significant cost savings

## Getting Started

The implementation is straightforward and user-friendly. Our support team is here to help every step of the way.

## Conclusion

This represents more than just a tool—it's a complete transformation of how work gets done. Ready to experience the difference?`;

  return intro.trim();
}

function generateSocialThread(headline, features, factSheet) {
  const feature1 = (features && features.length > 0) ? features[0] : 'Intelligent Design';
  const feature2 = (features && features.length > 1) ? features[1] : 'Smart Automation';
  
  return [
    `🚀 Introducing: ${headline || 'Transform Your Workflow'}\n\nWe're thrilled to unveil something that's going to change how you work. This isn't just an update—it's a revolution in productivity and collaboration.`,
    `💡 Feature Spotlight:\n\n${feature1}\n\nBuilt to solve real problems. Designed for real teams. Experience the difference today.`,
    `⚡ Watch this:\n\nImagine completing your most time-consuming tasks in half the time. That's what happens when you use the right tools.\n\nYour team will thank you.`,
    `🎯 The Real Win:\n\nOur users report:\n✅ 50%+ time savings\n✅ Better collaboration\n✅ Increased quality\n✅ Happier teams\n\nWhat will you achieve?`,
    `🔥 Join thousands of teams already transforming their workflows. Don't get left behind.\n\n#Innovation #Productivity #TeamWork #FutureOfWork`,
  ];
}

function generateEmailTeaser(subject, features, factSheet) {
  const feature1 = (features && features.length > 0) ? features[0] : 'Smart Features';
  const feature2 = (features && features.length > 1) ? features[1] : 'Seamless Integration';
  
  const emailContent = `Subject: ${subject || 'Transform Your Workflow'} – Starting Today

Hi there,

We've built something special, and we think you're going to love it.

**What's Inside:**

🎯 ${feature1}
Designed for teams who demand excellence and results.

⚡ ${feature2}  
Works seamlessly with your existing tools and workflows.

**The Results:**

Teams using our solution are accomplishing more in less time, with significantly less stress and effort.

✓ 40%+ efficiency gains
✓ Better team alignment
✓ Faster project delivery
✓ Happier team members

**Limited Time Offer**

We're offering early adopters exclusive benefits and priority support.

[See What's Possible] [Schedule a Demo] [Learn More]

Ready to transform how your team works?

Best regards,
The Team

P.S. – Your team is probably spending lots of time on manual tasks right now. It doesn't have to be that way.`;

  return emailContent.trim();
}

// Agent 3: Editor-in-Chief Agent
export const EditorAgent = {
  name: 'Editor-in-Chief',
  icon: '🦋',
  async process(drafts, factSheet) {
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const checks = {
      blog: performHallucinationCheck(drafts.blog, factSheet) && performToneAudit(drafts.blog, 'blog'),
      social: performToneAudit(drafts.social[0], 'social'),
      email: performToneAudit(drafts.email, 'email') && checkEmailLength(drafts.email)
    };
    
    const feedback = [];
    
    if (!checks.blog) {
      feedback.push({
        type: 'rejection',
        content: 'Blog post has inconsistencies with the fact-sheet. Please adjust tone and verify technical details.',
        details: 'Issue: Too promotional in paragraph 2. The core value proposition needs prominence.'
      });
    }
    
    if (!checks.social) {
      feedback.push({
        type: 'revision',
        content: 'Social thread needs punchier language and clearer CTAs',
        details: 'Suggestion: Make posts shorter and more engaging for mobile users.'
      });
    }
    
    if (!checks.email) {
      feedback.push({
        type: 'minor',
        content: 'Email teaser could emphasize urgency more',
        details: 'Add a soft deadline or exclusivity element.'
      });
    }
    
    return {
      approved: feedback.filter(f => f.type === 'rejection').length === 0,
      feedback,
      corrections: generateCorrectionNotes(feedback)
    };
  }
};

function performHallucinationCheck(content, factSheet) {
  // Simple check: look for invented features
  const contentLower = content.toLowerCase();
  const features = factSheet.features.map(f => f.toLowerCase());
  
  // Check if content mostly aligns with facts
  let matchCount = 0;
  features.forEach(f => {
    if (contentLower.includes(f)) matchCount++;
  });
  
  return matchCount >= Math.max(1, features.length - 1);
}

function performToneAudit(content, type) {
  if (type === 'blog') {
    const salesyWords = content.match(/buy now|limited time|exclusive offer|act fast/gi) || [];
    const roboticWords = content.match(/herein|pursuant|aforementioned/gi) || [];
    return salesyWords.length < 2 && roboticWords.length === 0;
  }
  
  return true; // Simplified for other types
}

function checkEmailLength(email) {
  return email.length < 300; // Should be concise
}

function generateCorrectionNotes(feedback) {
  return feedback.map(f => ({
    severity: f.type === 'rejection' ? 'high' : f.type === 'revision' ? 'medium' : 'low',
    message: f.content,
    details: f.details,
    action: f.type === 'rejection' ? 'requires_revision' : 'suggested'
  }));
}
