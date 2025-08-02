// src/services/db.service.ts
import Dexie from 'dexie';
import type { Table } from 'dexie';

export interface IAegisDocument { id?: number; title: string; docNumber: string; revision: number; owner: string; status: 'Draft' | 'Published' | 'Archived'; nextReviewDate: Date; tags?: string[]; }
export interface IAudit { id?: number; auditName: string; status: 'Planned' | 'In Progress' | 'Completed'; riskLevel: 'Low' | 'Medium' | 'High'; scheduledDate: Date; teamMemberIds?: number[]; }
export interface INonConformance { id?: number; ncrNumber: string; status: 'Open' | 'Closed'; classification: 'Minor' | 'Major'; auditId: number; processOwner: string; linkedClauses?: string[]; }
export interface IKpi { id?: number; name: string; objectiveId: number; target: number; value: number; period: string; }

class AegisAuditDB extends Dexie {
  public documents!: Table<IAegisDocument, number>;
  public audits!: Table<IAudit, number>;
  public nonConformances!: Table<INonConformance, number>;
  public kpis!: Table<IKpi, number>;

  public constructor() {
    super('AegisAuditDB');
    this.version(2).stores({
      // --- THE FIX IS HERE ---
      // We've added 'owner' to the list of indexed fields for the documents table.
      documents: '++id, &docNumber, owner, *tags', 
      audits: '++id, auditName',
      nonConformances: '++id, &ncrNumber',
      kpis: '++id, name',
    });
  }
}
export const db = new AegisAuditDB();

// The rest of the file remains unchanged.
export async function seedInitialData() {
  await db.transaction('rw', db.documents, db.audits, db.nonConformances, db.kpis, async () => {
    console.log("Seeding initial sample data...");
    await db.documents.bulkAdd([
        { title: 'Old Safety Procedure', docNumber: 'SAF-001', revision: 1, owner: 'System', status: 'Published', nextReviewDate: new Date('2022-01-01'), tags: ['safety', 'procedure', 'operations'] },
        { title: 'Current Quality Manual', docNumber: 'QM-002', revision: 2, owner: 'System', status: 'Published', nextReviewDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), tags: ['quality', 'manual', 'iso9001'] }
    ]);
    await db.audits.bulkAdd([
        { auditName: 'Q3 Internal Quality Systems Audit', status: 'Planned', riskLevel: 'High', scheduledDate: new Date('2025-09-15') },
        { auditName: 'Supplier Performance Review', status: 'In Progress', riskLevel: 'Medium', scheduledDate: new Date('2025-08-01') }
    ]);
    await db.nonConformances.bulkAdd([
        { ncrNumber: 'NCR-001', status: 'Open', classification: 'Major', auditId: 1, processOwner: 'Production Dept' },
        { ncrNumber: 'NCR-002', status: 'Closed', classification: 'Minor', auditId: 2, processOwner: 'Purchasing Dept' }
    ]);
    await db.kpis.bulkAdd([
        { name: 'Reduce Major Non-Conformances', objectiveId: 1, target: 5, value: 2, period: 'Q3 2025' },
        { name: 'Complete All Scheduled Audits', objectiveId: 2, target: 10, value: 9, period: 'Q3 2025' },
        { name: 'On-Time Document Review Rate', objectiveId: 1, target: 100, value: 75, period: 'Q3 2025' }
    ]);
  });
}

export async function clearTransactionalData() {
  await db.transaction('rw', db.documents, db.audits, db.nonConformances, db.kpis, async () => {
    await db.documents.clear();
    await db.audits.clear();
    await db.nonConformances.clear();
    await db.kpis.clear();
  });
  console.log("All transactional tables cleared.");
}