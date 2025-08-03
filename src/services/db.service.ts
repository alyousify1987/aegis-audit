// src/services/db.service.ts
import Dexie from 'dexie';
import type { Table } from 'dexie';

export interface IAegisDocument { id?: number; title: string; docNumber: string; revision: number; owner: string; status: 'Draft' | 'Published' | 'Archived'; nextReviewDate: Date; tags?: string[]; }
export interface IAudit { id?: number; auditName: string; status: 'Planned' | 'In Progress' | 'Completed'; riskLevel: 'Low' | 'Medium' | 'High'; scheduledDate: Date; teamMemberIds?: number[]; }
export interface INonConformance { id?: number; ncrNumber: string; status: 'Open' | 'Closed'; classification: 'Minor' | 'Major'; auditId: number; processOwner: string; linkedClauses?: string[]; }
export interface IKpi { id?: number; name: string; objectiveId: number; target: number; value: number; period: string; }
export interface IChecklist { id?: number; auditId: number; name: string; }
export interface IChecklistItem { id?: number; checklistId: number; clause: string; question: string; status: 'Pending' | 'Conforming' | 'Non-Conforming' | 'N/A'; }
export interface ICapaAction { id?: number; ncrId: number; description: string; assignedTo: string; dueDate: Date; status: 'Open' | 'Completed'; }

class AegisAuditDB extends Dexie {
  public documents!: Table<IAegisDocument, number>;
  public audits!: Table<IAudit, number>;
  public nonConformances!: Table<INonConformance, number>;
  public kpis!: Table<IKpi, number>;
  public checklists!: Table<IChecklist, number>;
  public checklistItems!: Table<IChecklistItem, number>;
  public capaActions!: Table<ICapaAction, number>;

  public constructor() {
    super('AegisAuditDB');
    this.version(4).stores({
      documents: '++id, &docNumber, owner, *tags',
      audits: '++id, auditName',
      nonConformances: '++id, &ncrNumber',
      kpis: '++id, name',
      checklists: '++id, auditId',
      checklistItems: '++id, checklistId',
      capaActions: '++id, ncrId',
    });
    this.version(3).stores({
      documents: '++id, &docNumber, owner, *tags',
      audits: '++id, auditName',
      nonConformances: '++id, &ncrNumber',
      kpis: '++id, name',
      checklists: '++id, auditId',
      checklistItems: '++id, checklistId',
    });
    this.version(2).stores({
      documents: '++id, &docNumber, owner, *tags',
      audits: '++id, auditName',
      nonConformances: '++id, &ncrNumber',
      kpis: '++id, name',
    });
  }
}
export const db = new AegisAuditDB();

export async function seedInitialData() {
  const allTables = [db.documents, db.audits, db.nonConformances, db.kpis, db.checklists, db.checklistItems, db.capaActions];
  await db.transaction('rw', allTables, async () => {
    await Promise.all(db.tables.map(table => table.clear()));
    await db.documents.bulkAdd([
        { title: 'Safety Procedure Manual', docNumber: 'SAF-001', revision: 1, owner: 'System', status: 'Published', nextReviewDate: new Date('2022-01-01'), tags: ['safety', 'procedure'] },
        { title: 'Quality Assurance Manual', docNumber: 'QM-002', revision: 2, owner: 'System', status: 'Published', nextReviewDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), tags: ['quality', 'manual'] }
    ]);
    const auditIds = await db.audits.bulkAdd([
        { auditName: 'Q3 Internal Quality Systems Audit', status: 'Planned', riskLevel: 'High', scheduledDate: new Date('2025-09-15') },
        { auditName: 'Supplier Performance Review', status: 'In Progress', riskLevel: 'Medium', scheduledDate: new Date('2025-08-01') }
    ], { allKeys: true });
    const checklistId = await db.checklists.add({ auditId: auditIds[0], name: 'ISO 9001:2015 Core Checklist' });
    await db.checklistItems.bulkAdd([
      { checklistId, clause: '4.1 Context of the Organization', question: 'Has the organization determined external and internal issues relevant to its purpose?', status: 'Pending' },
      { checklistId, clause: '4.2 Interested Parties', question: 'Have the needs and expectations of interested parties been determined?', status: 'Pending' },
    ]);
    const ncrIds = await db.nonConformances.bulkAdd([
        { ncrNumber: 'NCR-001', status: 'Open', classification: 'Major', auditId: 1, processOwner: 'Production' },
        { ncrNumber: 'NCR-002', status: 'Closed', classification: 'Minor', auditId: 2, processOwner: 'Purchasing' }
    ], { allKeys: true });
    await db.capaActions.bulkAdd([
      { ncrId: ncrIds[0], description: 'Retrain operators on procedure SOP-123.', assignedTo: 'J. Doe', dueDate: new Date('2025-09-30'), status: 'Open' },
      { ncrId: ncrIds[1], description: 'Verify supplier certification.', assignedTo: 'S. Smith', dueDate: new Date('2025-08-10'), status: 'Completed' },
    ]);
    await db.kpis.bulkAdd([
        { name: 'Reduce Major NCRs by 10%', objectiveId: 1, target: 5, value: 2, period: 'Q3 2025' },
        { name: 'Complete 100% of Scheduled Audits', objectiveId: 2, target: 10, value: 9, period: 'Q3 2025' },
    ]);
  });
}

export async function clearTransactionalData() {
  const allTables = [db.documents, db.audits, db.nonConformances, db.kpis, db.checklists, db.checklistItems, db.capaActions];
  await db.transaction('rw', allTables, async () => {
    await Promise.all(db.tables.map(table => table.clear()));
  });
}