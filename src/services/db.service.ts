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
export interface IEvidence { id?: number; checklistItemId: number; documentId: number; notes: string; timestamp: Date; }

class AegisAuditDB extends Dexie {
  public documents!: Table<IAegisDocument, number>;
  public audits!: Table<IAudit, number>;
  public nonConformances!: Table<INonConformance, number>;
  public kpis!: Table<IKpi, number>;
  public checklists!: Table<IChecklist, number>;
  public checklistItems!: Table<IChecklistItem, number>;
  public capaActions!: Table<ICapaAction, number>;
  public evidence!: Table<IEvidence, number>;

  public constructor() {
    super('AegisAuditDB');
    this.version(5).stores({
      documents: '++id, &docNumber, owner, *tags',
      audits: '++id, auditName',
      nonConformances: '++id, &ncrNumber',
      kpis: '++id, name',
      checklists: '++id, auditId',
      checklistItems: '++id, checklistId',
      capaActions: '++id, ncrId',
      evidence: '++id, checklistItemId, documentId',
    });
    // Previous versions for migration are important
    this.version(4).stores({ /* ... */ });
    this.version(3).stores({ /* ... */ });
    this.version(2).stores({ /* ... */ });
  }
}
export const db = new AegisAuditDB();

export async function seedInitialData() {
  const allTables = db.tables;
  await db.transaction('rw', allTables, async () => {
    await Promise.all(allTables.map(table => table.clear()));
    
    const docIds = await db.documents.bulkAdd([
      { title: 'Safety Procedure Manual', docNumber: 'SAF-001', revision: 1, owner: 'System', status: 'Published', nextReviewDate: new Date('2022-01-01'), tags: ['safety', 'procedure'] },
      { title: 'Quality Assurance Manual', docNumber: 'QM-002', revision: 2, owner: 'System', status: 'Published', nextReviewDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), tags: ['quality', 'manual'] }
    ], { allKeys: true });
    
    const auditIds = await db.audits.bulkAdd([
      { auditName: 'Q3 Internal Quality Systems Audit', status: 'Planned', riskLevel: 'High', scheduledDate: new Date('2025-09-15') },
      { auditName: 'Supplier Performance Review', status: 'In Progress', riskLevel: 'Medium', scheduledDate: new Date('2025-08-01') }
    ], { allKeys: true });
    
    const checklistId = await db.checklists.add({ auditId: auditIds[0], name: 'ISO 9001:2015 Core Checklist' });
    
    const checklistItemIds = await db.checklistItems.bulkAdd([
      { checklistId, clause: '4.1 Context', question: 'Has the org determined external/internal issues?', status: 'Pending' },
      { checklistId, clause: '4.2 Parties', question: 'Have interested party needs been determined?', status: 'Pending' },
    ], { allKeys: true });
    
    const ncrIds = await db.nonConformances.bulkAdd([
      { ncrNumber: 'NCR-001', status: 'Open', classification: 'Major', auditId: auditIds[0], processOwner: 'Production' },
      { ncrNumber: 'NCR-002', status: 'Closed', classification: 'Minor', auditId: auditIds[1], processOwner: 'Purchasing' }
    ], { allKeys: true });
    
    // --- THIS IS THE FIX ---
    // The ncrIds variable is now correctly used to link the CAPAs to the NCRs.
    await db.capaActions.bulkAdd([
      { ncrId: ncrIds[0], description: 'Retrain all operators on procedure SOP-123.', assignedTo: 'J. Doe', dueDate: new Date('2025-09-30'), status: 'Open' },
      { ncrId: ncrIds[1], description: 'Verify supplier certification is up to date.', assignedTo: 'S. Smith', dueDate: new Date('2025-08-10'), status: 'Completed' },
    ]);
    
    await db.kpis.bulkAdd([
      { name: 'Reduce Major NCRs', objectiveId: 1, target: 5, value: 2, period: 'Q3 2025' },
      { name: 'Complete All Audits', objectiveId: 2, target: 10, value: 9, period: 'Q3 2025' },
    ]);

    await db.evidence.add({
      checklistItemId: checklistItemIds[0],
      documentId: docIds[1],
      notes: 'The Quality Manual clearly outlines the context.',
      timestamp: new Date(),
    });
  });
}

export async function clearTransactionalData() {
  const allTables = db.tables;
  await db.transaction('rw', allTables, async () => {
    await Promise.all(allTables.map(table => table.clear()));
  });
}

// NOTE: I have omitted the older version definitions for brevity, 
// but they should be present in your final code.