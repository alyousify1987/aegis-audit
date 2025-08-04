// src/services/reporting.service.ts

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { IAegisDocument } from './db.service';

class ReportingService {
  public generatePdfReport(documents: IAegisDocument[]) {
    const doc = new jsPDF();
    
    doc.text("Aegis Audit - Document Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 14, 26);

    autoTable(doc, {
      startY: 35,
      head: [['Doc #', 'Title', 'Revision', 'Owner', 'Status', 'Review Date']],
      body: documents.map(d => [
        d.docNumber,
        d.title,
        d.revision,
        d.owner,
        d.status,
        new Date(d.nextReviewDate).toLocaleDateString()
      ]),
    });

    doc.save('aegis_audit_document_report.pdf');
  }

  public generateExcelReport(documents: IAegisDocument[]) {
    const worksheet = XLSX.utils.json_to_sheet(documents.map(d => ({
      'Document Number': d.docNumber,
      'Title': d.title,
      'Revision': d.revision,
      'Owner': d.owner,
      'Status': d.status,
      'Next Review Date': new Date(d.nextReviewDate).toLocaleDateString(),
      'Tags': d.tags?.join(', ')
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Documents');

    worksheet['!cols'] = [
      { wch: 20 }, { wch: 40 }, { wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 30 }
    ];

    XLSX.writeFile(workbook, 'aegis_audit_document_report.xlsx');
  }
}

export const reportingService = new ReportingService();