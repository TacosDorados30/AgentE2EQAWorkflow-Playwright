# HU502 - Administrar Zonas de Cobro de Anuncios - Test Plan

## Application Overview
**Module**: Zonas de Cobro de Anuncios
**URL**: https://grpmassoauth.qaenv.dev/ingresos/anuncios/zonas-cobro
**Role**: Administrador de Ingresos

## 42 Test Scenarios

### Happy Path (10 tests)
- TC-HU502-001: Create Zone with Valid Data (Full Fields)
- TC-HU502-002: Create Zone with Only Required Fields
- TC-HU502-003: Edit Zone Name and Description
- TC-HU502-004: Archive an Active Zone
- TC-HU502-005: Restore an Archived Zone
- TC-HU502-006: Search Zone by Key
- TC-HU502-007: Search Zone by Name
- TC-HU502-008: Filter by Active Status Only
- TC-HU502-009: Filter by Archived Status Only
- TC-HU502-010: Filter by All Statuses

### Negative Scenarios (9 tests)
- TC-HU502-101: Create Zone with Empty Clave
- TC-HU502-102: Create Zone with Empty Nombre
- TC-HU502-103: Create Zone with Both Fields Empty
- TC-HU502-104: Create Duplicate Key
- TC-HU502-105: Create Duplicate Name
- TC-HU502-106: Key with Invalid Special Characters
- TC-HU502-107: Archive Zone Used by Rate Configurations
- TC-HU502-108: Edit Zone with Empty Nombre
- TC-HU502-109: Attempt to Edit Clave Field

### Edge Cases (10 tests)
- TC-HU502-201 to 210: Normalization, length limits, special chars, double submit, pagination

### Navigation and UI Validation (7 tests)
- TC-HU502-301 to 307: Sidebar nav, filter toggle, modals, pagination, table columns

### Integration Scenarios AC8 (6 tests)
- TC-HU502-401 to 406: Zone selector in other modules, parameter configuration