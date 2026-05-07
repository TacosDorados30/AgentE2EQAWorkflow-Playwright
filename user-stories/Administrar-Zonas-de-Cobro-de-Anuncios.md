# Historia de Usuario: HU502 - Administrar Zonas de Cobro de Anuncios (Alta/Edición/Archivado)

## Título de la Historia

Como usuario Administrador de Ingresos, quiero administrar las Zonas de Cobro de Anuncios dentro del municipio para clasificar los anuncios por zona y permitir configuraciones de tarifas basadas en esas zonas.

## Descripción de la Historia

Implementar la funcionalidad de gestión de Zonas de Cobro de Anuncios para permitir a los usuarios crear, editar, buscar, archivar y restaurar zonas de cobro utilizadas dentro del municipio.

Las zonas de cobro se utilizarán para clasificar anuncios y posteriormente serán referenciadas en las configuraciones de tarifas de anuncios y en los módulos de registro de anuncios.

La funcionalidad debe validar reglas de unicidad, aplicar normalización automática de claves, restringir modificaciones de campos críticos y evitar acciones de archivado cuando existan dependencias.

## URL de la Aplicación

`https://grpmassoauth.qaenv.dev/login/`

## Credenciales de Prueba

**Usuario:** mquiroz  
**Contraseña:** 123tamarindo123

## Criterios de Aceptación

### AC1: Creación de Zona

DADO que el Administrador de Ingresos accede al módulo de Zonas de Cobro
CUANDO crea una nueva zona de cobro
ENTONCES el sistema debe permitir los siguientes campos:

- Clave única dentro del municipio
- Nombre de la zona
- Descripción opcional

### AC2: Normalización de la Clave

DADO que el usuario ingresa una clave de zona
CUANDO crea o edita la zona
ENTONCES el sistema debe convertir automáticamente la clave a mayúsculas

Y eliminar espacios dobles

Y evitar caracteres inválidos

Y la clave solo debe permitir:

- letras
- números
- guion bajo, si aplica

### AC3: Validación de Unicidad

DADO que ya existe una zona de cobro dentro del municipio
CUANDO el usuario intenta crear otra zona usando la misma clave
ENTONCES el sistema debe impedir el registro

Y mostrar el mensaje:
"Ya existe una zona de cobro con la misma clave."

DADO que ya existe una zona de cobro con el mismo nombre dentro del municipio
CUANDO el usuario intenta crear otra zona con el mismo nombre
ENTONCES el sistema debe mostrar un mensaje de validación por duplicado

### AC4: Edición de Zona

DADO que existe una zona de cobro
CUANDO el usuario edita la información de la zona
ENTONCES el sistema solo debe permitir la modificación de:

- Nombre de la zona
- Descripción

Y la clave de la zona no debe ser editable después de su creación

### AC5: Archivado de Zona

DADO que existe una zona de cobro activa
CUANDO el usuario selecciona la opción de archivar
ENTONCES el sistema debe realizar una operación de borrado lógico

Y las zonas archivadas no deben aparecer por defecto en:

- listados
- selectores desplegables
- búsquedas estándar

Y el sistema debe proporcionar una opción de:
"Mostrar archivados"

Y el sistema debe permitir restaurar zonas archivadas

### AC6: Restricción de Archivado por Uso

DADO que una zona de cobro está siendo utilizada actualmente por:

- configuraciones de tarifas de anuncios
- registros del padrón de anuncios

CUANDO el usuario intenta archivar la zona
ENTONCES el sistema debe bloquear la operación de archivado

Y mostrar el mensaje:
"No es posible archivar la zona porque actualmente está en uso."

### AC7: Listado y Búsqueda de Zonas

DADO que el usuario accede al listado de zonas de cobro
CUANDO realiza una búsqueda
ENTONCES el sistema debe permitir:

- búsqueda por clave
- búsqueda por nombre de la zona

Y debe proporcionar filtros de estado para:

- Activo
- Archivado
- Todos

### AC8: Uso del Selector de Zona en Otros Módulos

DADO que otra funcionalidad requiere seleccionar una zona de cobro
CUANDO el sistema muestra el selector de zona
ENTONCES solo deben mostrarse las zonas activas del municipio

## Reglas de Negocio

- Las claves de las zonas de cobro deben ser únicas dentro del municipio
- Los nombres de las zonas no deben duplicarse dentro del municipio
- Las claves de las zonas deben almacenarse siempre en formato de mayúsculas
- No se permiten caracteres inválidos en la clave de la zona
- Las claves de las zonas no pueden editarse después de su creación
- El archivado debe usar comportamiento de borrado lógico
- Las zonas archivadas no deben aparecer por defecto
- Solo las zonas activas pueden usarse en otros módulos
- Las zonas que estén actualmente en uso no pueden archivarse
- El sistema debe proporcionar controles de visibilidad para zonas archivadas
- Las zonas archivadas deben poder restaurarse

## Notas Técnicas

- Usar Playwright para pruebas automatizadas E2E
- Validar el comportamiento de normalización durante las operaciones de creación y edición
- Validar escenarios de clave duplicada y nombre duplicado
- Verificar el comportamiento no editable del campo clave de zona
- Validar la implementación de borrado lógico
- Verificar los flujos de archivado y restauración
- Validar restricciones por dependencias antes de las operaciones de archivado
- Probar los selectores para asegurar que solo se muestren zonas activas
- Validar filtros para registros Activos / Archivados / Todos
- Validar comportamiento de búsqueda por clave y nombre
- Probar el comportamiento de integración con los módulos de tarifas de anuncios y padrón de anuncios
- Validar compatibilidad entre navegadores y comportamiento responsivo

## Definición de Hecho

- [ ] Todos los criterios de aceptación tienen casos de prueba asociados
- [ ] Validaciones funcionales completadas
- [ ] Escenarios negativos validados
- [ ] Pruebas exploratorias completadas
- [ ] Flujos de archivado y restauración probados
- [ ] Validaciones de integración completadas
- [ ] Scripts de pruebas automatizadas creados y pasando
- [ ] Evidencia de pruebas documentada
- [ ] Bugs registrados para escenarios fallidos
- [ ] Aprobación de QA completada