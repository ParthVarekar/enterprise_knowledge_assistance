export type SourceSystem = 'confluence' | 'google_drive' | 'zendesk' | 'jira' | 'notion' | 'salesforce' | 'slack';
export type SecurityClassification = 'public' | 'internal' | 'confidential' | 'restricted';
export type VisibilityMode = 'public' | 'tenant_internal' | 'restricted_groups' | 'explicit_users';

export interface UnifiedACL {
  allowed_users: string[];
  allowed_groups: string[];
  denied_users: string[];
  denied_groups: string[];
  visibility: VisibilityMode;
  acl_hash: string;
}

export interface UserEntitlements {
  user_guid: string;
  slack_user_id: string;
  tenant_id: string;
  email: string;
  group_guids: string[];
  roles: string[];
}

export interface DocumentChunk {
  chunk_id: string;
  document_id: string;
  tenant_id: string;
  source_system: SourceSystem;
  source_url: string;
  document_title: string;
  author_id?: string;
  last_updated_at: string;
  security_classification: SecurityClassification;
  acl: UnifiedACL;
  content: string;
  parent_content?: string;
  vector?: number[];
  canonical_tag?: boolean;
}

export interface RetrievalQuery {
  query_id: string;
  raw_text: string;
  expanded_text: string;
  user_entitlements: UserEntitlements;
  domain_filters?: SourceSystem[];
  top_k?: number;
}

export interface ScoredCandidate {
  chunk: DocumentChunk;
  sparse_score: number;
  dense_score: number;
  rrf_score: number;
  rerank_score: number;
  final_score: number;
  live_acl_verified: boolean;
}

export interface ClaimEntailment {
  claim_sentence: string;
  supporting_chunk_ids: string[];
  entailment_score: number;
  is_verified: boolean;
}

export interface GroundedAnswer {
  query_id: string;
  answer_text: string;
  claims: ClaimEntailment[];
  citations: {
    citation_index: number;
    chunk_id: string;
    document_title: string;
    source_system: SourceSystem;
    source_url: string;
    last_updated_at: string;
    excerpt: string;
  }[];
  confidence_score: number;
  is_abstained: boolean;
  abstention_reason?: string;
}
