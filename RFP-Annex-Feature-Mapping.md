# RFP/Annex Feature Mapping

## Current Implementation Coverage
- Audit Management: Basic (plan, list, select audits)
- Checklist Management: Basic (fetch, update status)
- NCR/CAPA: Basic modal/forms, list, add, select
- Evidence/Document: Add, link, list, search, filter
- Reporting/Analytics: Charts, export (PDF/Excel)
- Rule Engine: Document review rule (json-rules-engine)
- ML/NLP/OCR: Service stubs, some entity extraction, OCR via Tesseract
- PWA/Offline: Service worker, manifest, Dexie
- Security: EncryptionService, encrypted DB wrappers
- UI/UX: MUI, modals, dark mode, responsive
- CI/CD, Lint, Docker: Present

## Gaps/To-Do
- [ ] Full audit lifecycle (execution, closure, status transitions)
- [ ] Checklist auto-generation per audit type
- [ ] NCR/CAPA workflow (linking, status, escalation)
- [ ] Evidence upload/preview, document versioning
- [ ] Management review module (records, actions)
- [ ] User roles/permissions, login (if required)
- [ ] Notifications/reminders (overdue, scheduled)
- [ ] Advanced analytics (KPI trends, risk heatmap)
- [ ] ML/NLP/OCR: deeper integration, auto-tagging, suggestions
- [ ] Accessibility, a11y polish
- [ ] More robust error handling, edge cases

---
This file will be updated as features are implemented.
