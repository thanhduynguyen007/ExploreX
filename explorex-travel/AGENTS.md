<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Database Guardrail
Use `../docs/crebas5_fixed.sql` and the specs in `../docs/` as the canonical database contract. Do not add or assume extra schema fields such as new role columns, timestamp columns, or foreign keys unless the user explicitly asks for that schema change and the documentation is updated to match first.
