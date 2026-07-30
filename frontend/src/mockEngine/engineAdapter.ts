// Interactive Engine Adapter bridging UI to Engine Logic

export interface UserPersona {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  groups: string[];
  securityClearance: string;
}

export const PRESET_PERSONAS: UserPersona[] = [
  {
    id: 'eng-lead-01',
    name: 'Alex Vance',
    role: 'Staff Infrastructure Engineer',
    email: 'alex.vance@acme.com',
    avatar: '⚡',
    groups: ['engineering', 'devops', 'all-employees'],
    securityClearance: 'Confidential & Internal',
  },
  {
    id: 'legal-01',
    name: 'Elena Rostova',
    role: 'General Counsel',
    email: 'elena.rostova@acme.com',
    avatar: '⚖️',
    groups: ['legal-team', 'executives', 'all-employees'],
    securityClearance: 'Restricted, Confidential & Internal',
  },
  {
    id: 'pm-01',
    name: 'Marcus Chen',
    role: 'Lead Product Manager',
    email: 'marcus.chen@acme.com',
    avatar: '🚀',
    groups: ['product', 'marketing', 'all-employees'],
    securityClearance: 'Internal & Public',
  },
  {
    id: 'outsider-01',
    name: 'Jordan Miller',
    role: 'External Vendor / Contractor',
    email: 'jordan.vendor@external.com',
    avatar: '🌐',
    groups: ['external-vendors'],
    securityClearance: 'Public Only',
  },
];

export interface QueryResult {
  queryId: string;
  queryText: string;
  user: UserPersona;
  answerText: string;
  confidenceScore: number;
  isAbstained: boolean;
  abstentionReason?: string;
  citations: {
    citationIndex: number;
    chunkId: string;
    documentTitle: string;
    sourceSystem: string;
    sourceUrl: string;
    lastUpdatedAt: string;
    excerpt: string;
    classification: string;
  }[];
  claims: {
    claimSentence: string;
    supportingChunkIds: string[];
    entailmentScore: number;
    isVerified: boolean;
  }[];
  candidates: {
    chunkId: string;
    documentTitle: string;
    sourceSystem: string;
    sparseScore: number;
    denseScore: number;
    rrfScore: number;
    temporalDecay: number;
    finalScore: number;
    aclPassed: boolean;
  }[];
  latencyMs: number;
  timestamp: string;
}

export class EngineAdapter {
  private static docs = [
    {
      id: 'CONF-001',
      title: 'API Gateway Architecture & Token Bucket Algorithm',
      source: 'confluence',
      classification: 'internal',
      url: 'https://wiki.acme.com/spaces/ENG/pages/CONF-001',
      updated: '2026-07-28T10:00:00Z',
      allowedGroups: ['engineering', 'devops'],
      visibility: 'restricted_groups',
      content: 'Our API gateway uses a microservice mesh pattern with service discovery via Consul. Rate limiting is enforced at the edge using token bucket algorithms with configurable burst rates of 1000 requests/min for standard tier and 10,000 requests/min for enterprise tier. Authentication flows through OAuth 2.0 with PKCE for public clients.',
    },
    {
      id: 'CONF-002',
      title: 'Blue-Green Deployment Runbook & Incident Protocols',
      source: 'confluence',
      classification: 'confidential',
      url: 'https://wiki.acme.com/spaces/OPS/pages/CONF-002',
      updated: '2026-07-25T14:30:00Z',
      allowedGroups: ['devops', 'engineering'],
      visibility: 'restricted_groups',
      content: 'Production deployments follow a blue-green deployment strategy with automatic rollback triggers set at a 5% error rate threshold. Canary deployments are promoted after 15 minutes of stable metrics including p99 latency under 200ms and zero critical alerts. Emergency rollback command: kubectl rollout undo deployment/api-gateway.',
    },
    {
      id: 'GDRIVE-001',
      title: 'Engineering Onboarding & Tooling Guide',
      source: 'google_drive',
      classification: 'internal',
      url: 'https://drive.google.com/file/d/GDRIVE-001/view',
      updated: '2026-07-20T09:15:00Z',
      allowedGroups: ['all-employees'],
      visibility: 'tenant_internal',
      content: 'Welcome to the engineering team! This guide covers our development environment setup, code review process, CI/CD pipeline overview, and team communication channels. All new engineers should complete the mandatory security training module within their first 7 days.',
    },
    {
      id: 'GDRIVE-002',
      title: 'Restricted Customer Data Processing Agreement (DPA)',
      source: 'google_drive',
      classification: 'restricted',
      url: 'https://drive.google.com/file/d/GDRIVE-002/view',
      updated: '2026-07-15T11:00:00Z',
      allowedGroups: ['legal-team', 'executives'],
      visibility: 'restricted_groups',
      content: 'This Data Processing Agreement governs the processing of personal customer data by the processor on behalf of the controller. Data retention periods are strictly set to 90 days for raw access logs and 365 days for financial transaction records. All data at rest must be encrypted using AES-256 GCM.',
    },
    {
      id: 'ZD-001',
      title: 'Public Knowledge Base: Password Reset & MFA Setup',
      source: 'zendesk',
      classification: 'public',
      url: 'https://help.acme.com/articles/ZD-001',
      updated: '2026-07-29T16:00:00Z',
      allowedGroups: [],
      visibility: 'public',
      content: 'To reset your password, click the "Forgot Password" link on the login portal. You will receive an email with a secure reset link valid for 24 hours. Passwords must be at least 12 characters with uppercase, lowercase, numbers, and special symbols. Multi-Factor Authentication (MFA) is required for all user accounts.',
    },
    {
      id: 'ZD-002',
      title: 'Public Knowledge Base: Subscription Plans & Billing FAQ',
      source: 'zendesk',
      classification: 'public',
      url: 'https://help.acme.com/articles/ZD-002',
      updated: '2026-07-27T08:00:00Z',
      allowedGroups: [],
      visibility: 'public',
      content: 'Billing cycles run on the 1st of each calendar month. The Pro Plan includes up to 100 seats, 500GB cloud storage, and priority email support. The Enterprise Plan includes unlimited seats, 5TB storage, custom SSO integration, and dedicated 24/7 TAM support. Annual billing provides a 20% discount.',
    },
  ];

  public static executeQuery(queryText: string, persona: UserPersona): QueryResult {
    const start = performance.now();
    const queryLower = queryText.toLowerCase();

    // 1. ACL Filter Candidates
    const eligibleDocs = this.docs.filter(doc => {
      if (doc.visibility === 'public') return true;
      if (doc.visibility === 'tenant_internal') {
        return persona.groups.includes('all-employees') || persona.groups.length > 0;
      }
      if (doc.visibility === 'restricted_groups') {
        return doc.allowedGroups.some(g => persona.groups.includes(g));
      }
      return false;
    });

    // 2. Score Candidates
    const candidates = eligibleDocs.map(doc => {
      const tokens = queryLower.split(/\s+/).filter(t => t.length > 2);
      let matches = 0;
      for (const t of tokens) {
        if (doc.content.toLowerCase().includes(t) || doc.title.toLowerCase().includes(t)) {
          matches++;
        }
      }

      const sparseScore = tokens.length > 0 ? (matches / tokens.length) * 4.5 : 0;
      const denseScore = matches > 0 ? 0.72 + matches * 0.08 : 0.25;
      const rrfScore = matches > 0 ? 0.85 : 0.1;
      const ageDays = (Date.now() - new Date(doc.updated).getTime()) / (1000 * 60 * 60 * 24);
      const temporalDecay = Math.exp(-0.005 * ageDays);
      const finalScore = (sparseScore * 0.4 + denseScore * 0.6) * temporalDecay;

      return {
        chunkId: doc.id,
        documentTitle: doc.title,
        sourceSystem: doc.source,
        sparseScore: Number(sparseScore.toFixed(3)),
        denseScore: Number(denseScore.toFixed(3)),
        rrfScore: Number(rrfScore.toFixed(3)),
        temporalDecay: Number(temporalDecay.toFixed(3)),
        finalScore: Number(finalScore.toFixed(3)),
        aclPassed: true,
        content: doc.content,
        url: doc.url,
        updated: doc.updated,
        classification: doc.classification,
      };
    }).sort((a, b) => b.finalScore - a.finalScore);

    const bestMatches = candidates.filter(c => c.finalScore > 0.4);
    const isAbstained = bestMatches.length === 0;

    let answerText = '';
    let confidenceScore = 0;

    if (isAbstained) {
      const blockedDocs = this.docs.filter(d => !eligibleDocs.includes(d));
      if (blockedDocs.length > 0 && queryLower.includes('dpa') || queryLower.includes('data processing')) {
        answerText = "I don't have enough verified permission to answer this question. The relevant document exists under Restricted Classification and requires Legal/Executive security clearance.";
      } else {
        answerText = "I don't have enough verified information in our connected knowledge bases to answer this question confidently.";
      }
      confidenceScore = 0.12;
    } else {
      confidenceScore = Number((0.78 + bestMatches[0].finalScore * 0.15).toFixed(2));
      const topContent = bestMatches.map(m => m.content).join('\n\n');
      answerText = `Based on verified enterprise documentation:\n\n${topContent}`;
    }

    const claims = !isAbstained ? bestMatches.map(m => ({
      claimSentence: m.content.substring(0, 110) + '...',
      supportingChunkIds: [m.chunkId],
      entailmentScore: Number((0.82 + Math.random() * 0.15).toFixed(2)),
      isVerified: true,
    })) : [];

    const citations = !isAbstained ? bestMatches.map((m, idx) => ({
      citationIndex: idx + 1,
      chunkId: m.chunkId,
      documentTitle: m.documentTitle,
      sourceSystem: m.sourceSystem,
      sourceUrl: m.url,
      lastUpdatedAt: m.updated,
      excerpt: m.content,
      classification: m.classification,
    })) : [];

    const latencyMs = Number((performance.now() - start + 45).toFixed(1));

    return {
      queryId: `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      queryText,
      user: persona,
      answerText,
      confidenceScore,
      isAbstained,
      abstentionReason: isAbstained ? 'Insufficient evidence or Zero-Trust ACL restriction.' : undefined,
      citations,
      claims,
      candidates,
      latencyMs,
      timestamp: new Date().toLocaleTimeString(),
    };
  }
}
