export type AuditAction = 'query' | 'acl_deny' | 'retrieval' | 'grounding' | 'answer_generation' | 'answer_served' | 'answer_abstained' | 'mutation_test' | 'invariant_check' | 'fuzz_test';

export interface AuditRecord {
  timestamp: string;
  action: AuditAction;
  actor: string;
  tenant_id: string;
  details: Record<string, unknown>;
  trace_id?: string;
}

export class AuditLedger {
  private records: AuditRecord[] = [];
  private maxRecords: number;

  constructor(maxRecords: number = 10000) {
    this.maxRecords = maxRecords;
  }

  public log(record: AuditRecord): void {
    if (this.records.length >= this.maxRecords) {
      this.records = this.records.slice(-Math.floor(this.maxRecords / 2));
    }
    this.records.push(record);
  }

  public query(filters: { action?: AuditAction; actor?: string; tenant_id?: string; since?: Date; limit?: number }): AuditRecord[] {
    let filtered = this.records;
    if (filters.action) filtered = filtered.filter(r => r.action === filters.action);
    if (filters.actor) filtered = filtered.filter(r => r.actor === filters.actor);
    if (filters.tenant_id) filtered = filtered.filter(r => r.tenant_id === filters.tenant_id);
    if (filters.since) {
      const sinceMs = filters.since.getTime();
      filtered = filtered.filter(r => new Date(r.timestamp).getTime() >= sinceMs);
    }
    return filtered.slice(-(filters.limit ?? 100));
  }

  public getRecordCount(): number {
    return this.records.length;
  }

  public getRecords(): AuditRecord[] {
    return this.query({});
  }

  public clear(): void {
    this.records = [];
  }
}
