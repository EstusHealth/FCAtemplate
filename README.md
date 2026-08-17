# Functional Capacity Assessment Builder

A single-file, offline builder for NDIS Functional Capacity Assessments at medicolegal standard.

It replaces the Google Docs master template with a staged workspace that follows the assessment
itself: the pre-flight checklist you work through before the participant arrives, the interview run
sheet you take in on a clipboard, and the report builder that writes the assessment up — all from one
dataset, so nothing is ever re-typed and no two documents can contradict each other.

`index.html` is the whole application. Open it in a browser. There is no build step, no server, no
install, and no network call: everything is held in the page and saved to that browser's local
storage.

---

## What it produces

Six documents, generated from the same data and switched with the tabs above the preview. Each one
prints to PDF and exports to Word independently.

| Document | Reader | When |
|---|---|---|
| **Pre-Assessment Checklist** | You | Before the visit — print it, work through it, file it as the record of what was prepared |
| **Interview Run Sheet** | You | In the room — every prompt with ruled writing space and a blank field-note grid |
| **Functional Capacity Assessment** | NDIA delegate / planner | The report |
| **Carer Statement for Confirmation** | The carer | Before the statement enters the report, so they can read and sign it off |
| **NDIS Planner Summary** | Planner / LAC | One page: impairments, evidence, carer burden, supports sought |
| **AI Drafting Pack** | Your AI tool | The Constitution's mandates plus your structured data, assembled as one prompt |

## The five stages

1. **Pre-Flight** — referral scope and stream, consent and the deficit-framing conversation,
   documents to obtain, the assessment kit checklist, and the field record opened.
2. **Interview** — participant and plan details, goals, the run sheet (prompts and probes per domain),
   the four background narratives, routines grid, support network.
3. **Assessments** — score entry for WHODAS 2.0, Vineland-3, Sensory Profile 2, Brown EF/A, LSP-16,
   CANS, PEDI-CAT and a school participation measure, plus a generic tool builder for anything else;
   the carer statement workspace and the Zarit Burden Interview.
4. **Domains** — the ten functional domains, each with a Domain Descriptor and subdomain rows
   carrying description, capacity rating, evidence, recommendation and budget category.
5. **Report** — the functional summary, the recommendations table by NDIS budget category, quantified
   supports and therapy hours, sign-off, and the AI drafting pack.

## The Golden Thread

Every recommendation in the report is an object with five links, and the builder shows you which are
missing on each row:

```
1 diagnosis  →  2 evidence  →  3 functional impact  →  4 recommendation  →  5 NDIS budget
```

A recommendation with a broken chain cannot be exported. A recommendation that never reached a budget
category cannot reach the final table. This is the mechanism that makes the report defensible rather
than merely well formatted.

## How the report is kept honest

- **Contemporaneous field record.** Log notes as they happen from any stage, then lock the record
  before drafting. Locked entries cannot be deleted; anything added afterwards is flagged as a
  post-assessment addendum and identified as such in the report's methodology statement.
- **Verification bars.** Confirming a narrative block binds the tick to a hash of the text. Edit the
  text afterwards and the tick clears, so a confirmation always refers to the words that were checked.
- **Auto-draft detection.** Generated text is a skeleton assembled from your data. The validator
  blocks export while a critical block is still the untouched draft.
- **Language guard.** Pejorative and agency-blaming language (`refuses`, `poor`, `non-compliant`,
  `chooses to`, `attention-seeking` …) is a blocker with the neuro-affirming alternative suggested.
  Capacity-inflating hedges (`manages well`, `no issues`, bare `independent`, `on a good day`) raise
  an advisory, because the report is written to the participant's difficult day.
- **Pre-export check.** Click the badge in the toolbar for every blocker and advisory, each linking
  straight to the field that needs attention. Export and print are gated on it.

## Using it

- **Load example** fills in a complete, de-identified worked example that passes validation. It is
  both the demo and the standard the builder is asking for.
- **Save draft / Open draft** writes a `.json` file — that is how you move a draft between machines
  or hand it to a colleague. The browser also autosaves continuously.
- **Export Word** produces a `.doc` of whichever document tab is active, with an A4 page set-up and a
  running footer carrying the participant's name, NDIS number and report reference.
- **Print / PDF** prints the active document.
- **Practice Profile & Branding** (Stage 1) sets the letterhead, colours, logo and confidentiality
  banner. It is stored per browser, reused for every report, and exportable as a `.json` profile to
  share with the practice.

Nothing leaves the browser. There is no telemetry, no upload, and no server — which is also why the
draft lives in that browser until you save it to a file.

## Extending it

The data tables sit at the top of the script and are the only place most changes are needed:

| Table | Controls |
|---|---|
| `PREFLIGHT` | Checklist groups and items |
| `RUNSHEET` | Interview domains, prompts and probes |
| `DOMAINS` | The ten domains, their subdomain rows, guidance and suggested recommendations |
| `TOOLS` | Standardised assessments: metadata fields, score columns, rows, flag bands and wording |
| `BUDGETS` | NDIS budget categories and their standard descriptions |
| `REQ_FIELDS`, `PEJORATIVE`, `INFLATING` | What the validator requires and what it flags |

Adding an assessment means adding one entry to `TOOLS`; adding a subdomain means adding one row to a
`DOMAINS` entry. Both flow through to the form, the report, the AI pack and the validator without
further change. A tool used once does not need code at all — use the generic tool builder in Stage 3.

## Provenance

The rules encoded here come from three source documents, and
[`docs/traceability.md`](docs/traceability.md) maps each rule to the clause it enforces:

- `ESTUS-SOP-FCA-001` — Standard Operating Procedure: Functional Capacity Assessment
- *A Constitution for the Generation of NDIS Functional Capacity Assessments* (Mandates 1–3,
  Articles I–XVIII)
- The Estus Health master FCA template

## Browser support

Any current Chrome, Edge, Firefox or Safari, on desktop or tablet. The layout collapses to a single
column with the form and report on a toggle, and touch targets grow, so it is usable on an iPad in
the field. Word export and print use the browser's own facilities.
