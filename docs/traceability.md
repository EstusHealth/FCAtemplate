# Traceability: source clause → enforcement

Every governance rule in `index.html` traces to a clause in one of three source documents. This table
is the audit trail: if a rule is questioned, this is where you find why it exists, and if a source
document changes, this is where you find what has to change with it.

Sources:

- **SOP** — `ESTUS-SOP-FCA-001`, *Standard Operating Procedure: Functional Capacity Assessment*
- **Constitution** — *A Constitution for the Generation of NDIS Functional Capacity Assessments*
- **Template** — the Estus Health master FCA template

Legend for how a rule is enforced:

- **Blocker** — export and print are refused until it is resolved
- **Advisory** — surfaced in the pre-export check, acknowledgeable by the clinician
- **Structural** — built into the form or the generated document, so it cannot be omitted
- **Guidance** — presented to the clinician at the point of work

---

## Constitution — foundational mandates

| Clause | Requirement | Enforcement | Where |
|---|---|---|---|
| Mandate 1 | The Golden Thread: diagnosis → functional impairment → assessment evidence → observable impact → specific recommendation | **Blocker** ×5. `threadState()` computes the five links per row and renders them as a live trace; the validator raises a separate blocker for each missing link on any row rated at supervision level or above | `threadState`, `rowCard`, `validate` §5 |
| Mandate 1 | Descriptors must link diagnosis and score to domain-level impairment | **Blocker.** `dxCited()` requires a named diagnosis (full name or parenthesised abbreviation); `scoreCited()` requires a numeric value alongside an instrument or score keyword | `validate` §5 |
| Mandate 2 | Neuro-affirming, non-judgemental language | **Blocker.** 12 pejorative and agency-blaming patterns, each reported with the affirming alternative | `PEJORATIVE`, `validate` §8 |
| Mandate 2 | Behaviour presented as the functional consequence of impairment, not a choice | **Blocker** on `chooses to` / `won't` / `refuses`; **Guidance** in the Psychosocial domain reference card and in the AI pack mandates | `PEJORATIVE`, `DOMAINS.psych.ref`, `aiPackText` |
| Mandate 3 | Data-first synthesis; no invention | **Structural.** Every auto-draft is assembled only from entered data. **Blocker** on unresolved `{tokens}`, square-bracket placeholders and `TODO` markers. The AI pack instructs `[CLINICIAN TO CONFIRM]` in place of invention | `AUTOTEXT`, `validate` §8, `aiPackText` |

## Constitution — Articles I–XVIII

| Clause | Requirement | Enforcement | Where |
|---|---|---|---|
| I / Directives 1.1–1.3 | Client information, assessor and AHPRA number, assessment and report dates | **Structural** header table; **Blocker** on each required field | `buildReport`, `REQ_FIELDS` |
| II / 2.1 | Reason for referral, linking diagnoses to the domains of concern and stating the purpose | **Structural.** `reasonReferral()` composes referrer, purpose, diagnoses, the impaired domains and the carer-burden factor | `reasonReferral` |
| II / 2.2 | Standardised assessments, clinical observations, interviews, documentation reviewed | **Structural** four-part Assessment Information section; **Blocker** if no interview, observation or standardised tool is recorded | `buildReport`, `validate` §2 and §4 |
| II / 2.3 | Participant goals transcribed as stated in the plan | **Structural** short/long term plus a separate list for goals identified at assessment; **Blocker** if none recorded | `buildReport`, `validate` §2 |
| II / 2.4 | Four background narratives, each following the Golden Thread | **Blocker** on all four; medical history and social context additionally require a verification tick | `REQ_FIELDS`, `validate` §7 |
| II / 2.4 | Social context to introduce carer burden and report the Zarit score and classification | **Structural** in the `bgSocial` auto-draft; **Blocker** if a carer is named and no burden score exists | `AUTOTEXT.bgSocial`, `validate` §4 |
| III / 3.1 | A 1–2 paragraph Domain Descriptor before each domain table | **Blocker** under 25 words; **Advisory** under 60 | `validate` §5 |
| III / Directive 3.1 | Descriptor formula: capacity linked to diagnoses → relevant scores → summary of functional impact | **Structural.** `domainDescriptor()` generates in exactly that order from the linked diagnoses, cited evidence and rated rows | `domainDescriptor` |
| IV–XIII | Ten functional domains as two-column Description / Recommendations tables | **Structural.** `DOMAINS` carries all ten with the template's own subdomain rows and guidance | `DOMAINS`, `buildReport` |
| Mandate 4.1 | Description column synthesises all sources for each subdomain | **Blocker** under 20 words per rated row | `validate` §5 |
| Mandate 4.1 | Direct Solution: the recommendation answers the exact problem in that row | **Structural.** Recommendation and budget live in the same row as the description; `REC_LIB` suggestions are attached per subdomain and carry their budget category. **Blocker** if a row rated at supervision level or above has no recommendation | `DOMAINS[].rows[].recs`, `useRec`, `validate` §5 |
| XIV / 14.1 | First-person carer statement, 1–2 pages, thematic sections, authentic tone | **Structural** scaffold with the Constitution's five themes; **Advisory** under 400 words | `AUTOTEXT.carerStatement`, `validate` §7 |
| XIV / 14.2 | Carer Burden Scale section: score, classification, then 1–2 paragraphs of interpretation justifying formal supports | **Structural** separate report section with automatic banding; **Blocker** if a score is entered with no interpretation | `zbiBand`, `AUTOTEXT.zbiInterp`, `validate` §4 |
| XV / 15.1 | Each assessment reported as: name → what it measures → summary of results → score table → interpretation | **Structural.** Every tool renders in exactly that order, with the description supplied and the summary and interpretation auto-drafted and editable | `TOOLS`, `toolSummaryText`, `toolInterpText`, `buildReport` |
| XVI / 16.1 | Summary formula: client and diagnoses → key impairments with scores → functional impact → external risk factors and carer sustainability → reasonable-and-necessary conclusion | **Structural.** `autoSummary()` assembles the five steps in order; **Blocker** if the summary is missing, unverified or still the untouched draft; **Advisory** under 150 words | `autoSummary`, `validate` §6 and §7 |
| XVII / 17.1 | Migrate all body recommendations into a 3-column table, categorised Core / Capacity Building / Capital, with a justification and quantified supports | **Structural.** The final table is derived from the domain rows — nothing can appear in it that was not recommended in the body. **Blocker** on any uncategorised recommendation and if no categorised recommendation exists; **Advisory** on any recommendation without a quantity | `allRecs`, `recsByBudget`, `budgetJustification`, `validate` §6 |
| XVIII / 18.1–18.2 | Standard disclaimer and formatted sign-off block | **Structural** — printed on every report | `buildReport`, `signoffBlock` |

## SOP — core principles (§2.0)

| Clause | Requirement | Enforcement | Where |
|---|---|---|---|
| Deficit-based language | Report the functional deficit plainly | **Advisory** on 7 capacity-inflating patterns (`manages well`, `no issues`, bare `independent`, `on a good day`, `normal`, vague qualifiers) | `INFLATING`, `validate` §8 |
| Worst-case scenario | Capture function on the most challenging days | **Structural.** Every subdomain asks for "what happens on a difficult day, and who does what"; the routines grid asks for the escalation scenario; **Advisory** where a whole domain is rated fully independent | `rowCard`, `validate` §5 |
| Link to disability | Every deficit tied to the diagnosis | **Blocker** — the diagnosis link is strand 1 of the Golden Thread | `validate` §5 |
| Justify all recommendations, integrated per domain | Recommendations sit with the domain, not saved for the end | **Structural** — the recommendation field is inside the subdomain row | `rowCard` |
| Formal assessment integration | Quote relevant scores within the corresponding sections | **Structural** evidence chips per row, drawn live from entered scores; **Blocker** if no standardised assessment is recorded at all, and if a descriptor cites no score where the domain is impaired | `allScoreRefs`, `linkRef`, `validate` §4 and §5 |
| Highlight caregiver burden | Care statement plus a formal burden measure | **Blocker** ×3: burden score required where a carer is named; statement must be confirmed with the carer; statement must be verified against the transcript | `validate` §4 |
| Client transparency | Explain the deficit-based framing at the outset | **Blocker.** Dedicated section, a tick, and a free-text record of the family's response | Stage 1 §0.1, `validate` §1 |

## SOP — procedure (§3.0–§5.5)

| Clause | Requirement | Enforcement | Where |
|---|---|---|---|
| §3.0 | Access the master template; update the footer with the client's name | **Structural.** The running footer carries participant name, NDIS number, report reference and date on every page and in the Word export; the checklist item records that it was done | `footerID`, `docFooter`, `exportWord`, `PREFLIGHT.p5` |
| §4.0 | Build rapport first; 15–60 minutes of open discussion before structured questions | **Structural.** The run sheet opens with the participant's own account before any domain; the stage lead states the rule | Stage 2 `openStory`, `RUNSHEET` |
| §4.0 | Use the chat pointers as a flexible guide, not a script | **Guidance** — prompts and probes per domain, openable at the point of asking | `RUNSHEET`, `buildRunsheet` |
| §4.0 | Begin structured inquiry with medical, disability and developmental history | **Structural** — first run sheet domain | `RUNSHEET.medical` |
| §5.1 | Assessment Date is the latest formal assessment date | **Guidance** on the field label | Stage 2 §1 |
| §5.1 | Reason for referral justifies the assessment hours | **Guidance** in Stage 1; **Blocker** on referrer name and role | Stage 1 §0, `REQ_FIELDS` |
| §5.1 | Specify proxy or self-administered for each tool | **Blocker** — every tool's metadata fields, including respondent, must be completed | `validate` §4 |
| §5.1 | Add or update goals where aspirations have changed | **Structural** — a separate "goals identified at this assessment" field, printed under its own heading | Stage 2 §2, `buildReport` |
| §5.2 | Note cultural, spiritual and therapist-preference factors | **Structural** access-needs field in Stage 1, printed in the checklist | Stage 1 §0.1 |
| §5.2 | Support Network table is for SIL FCAs; delete if not relevant | **Structural** — switched off by default and omitted entirely from the report when off | `supportNetOn`, `buildReport` |
| §5.2 | Routines table used flexibly; show different scenarios | **Structural** scenario field, 7×3 grid, and a worst-case/escalation note | Stage 2 §5 |
| §5.3 | Domain-specific considerations — trip hazards, scam and manipulation risk, road safety and stranger danger, functional transfers only, auditory processing reframing, insight/planning/memory/attention, internalising vs externalising | **Guidance** — reference card per domain, quoting the SOP consideration | `DOMAINS[].ref` |
| §5.3 | Detail on technology proportional to whether a recommendation follows | **Guidance** on the Technology domain card | `DOMAINS.tech.ref` |
| §5.3 | Justify Psychology and Behaviour Support distinctly | **Guidance** on the Psychosocial card; separate budget categories so each carries its own justification | `DOMAINS.psych.ref`, `BUDGETS` |
| §5.4 | Present the care statement to the carer for confirmation before inclusion | **Blocker** — a tick that the statement was read back and confirmed | `validate` §4 |
| §5.4 | Administer a standardised care burden scale | **Blocker** where a carer is named; three Zarit variants with automatic banding | `zbiBand`, `validate` §4 |
| §5.5 | Summary paragraph justifying Core, Capacity Building and Capital | **Structural** — recommendations intro, auto-drafted from the categories actually used | `AUTOTEXT.recIntro` |
| §5.5 | Collate support work hours; transport level; STA in 14-day blocks linked to carer burden | **Structural** quantity fields printed as "Quantified supports"; **Advisory** if burden is severe and no respite or support worker hours are recommended | Stage 5 §12, `validate` §6 |
| §5.5 | Consumables with an estimated annual cost | **Structural** annual consumables field | Stage 5 §12 |
| §5.5 | Advocate flexible funding | **Structural** — a switch that prints the flexible-funding statement | `flexFunding`, `buildReport` |
| §5.5 | Break therapy hours into direct and non-face-to-face | **Structural** — per-service direct and non-F2F hours table, printed per annum | `THERAPIES`, `buildTherapy` |
| §5.5 | Conclude with the standard disclaimer | **Structural** | `buildReport` |

## Beyond the source documents

Medicolegal defensibility requirements that the source documents imply but do not spell out. These are
the builder's own additions.

| Rule | Rationale | Enforcement |
|---|---|---|
| Contemporaneous field record, locked before drafting | A finding with no record made at the time is the weakest point of any report under scrutiny | **Blocker** — record must be locked; minimum note counts per phase; post-lock entries flagged as addenda and disclosed in the report |
| Verification bars bound to a content hash | A confirmation must refer to the words that were actually checked | **Blocker** on the summary, medical history, social context, carer statement and all ten descriptors |
| Untouched auto-draft detection | Generated scaffolding must not be issued as clinical reasoning | **Blocker** on the summary, medical history and carer statement |
| AI-use declaration printed in the report | Disclosure of tooling, and a hard line that AI may refine wording but not supply findings | **Structural** methodology statement; four declared levels of use |
| Basis of opinion, limitations, qualifications, declaration, distribution | Standard requirements of an expert report | **Blocker** on each; limitations auto-draft names any document requested but not received |
| Final self-review confirmation | The clinician states they read the report against their notes | **Blocker** |
| Consistency checks | A report that contradicts itself fails on its own terms | **Advisory** — severe findings absent from the summary, goals not connected to recommendations, quantified supports with no matching body recommendation |
| Writing-quality checks | Contractions, 45-word sentences, double spaces and unterminated fields read as unfinished in a document a delegate will rely on | **Advisory** |
