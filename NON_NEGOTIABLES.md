# Non-Negotiables

These four rules override every other instruction in this repo, every prompt to Antigravity, and
any suggestion an AI coding tool makes. If a generated suggestion conflicts with one of these,
the suggestion is wrong — fix it before merging, don't merge it "for now."

## a. Prototype → Full Product, No Rework Conflicts

We are building a prototype, but every piece of it must be written knowing it will be extended
to the real, full-scale requirement later. Concretely:
- Don't hardcode "1 admin" or "1 model" where the real system needs many — use a list/config even
  if the prototype only ever populates it with one or two entries.
- Don't inline business logic that should be configuration (model names, file paths, thresholds).
- Don't build a page or agent in a way that only works because of a prototype-only shortcut
  (e.g. assuming a single fixed document set) unless that shortcut is clearly commented as such
  and easy to remove.
- When in doubt, ask: "if MRPL asked us to scale this to 500 real users and real documents next
  month, would this code survive, or would we rewrite it?" If the answer is rewrite, fix it now.

## b. Clean, Efficient, Real Code

- No fake/stubbed complexity dressed up to look sophisticated. If a piece isn't built yet, it's a
  clearly marked `# TODO` and a simple placeholder — not obfuscated fake logic pretending to work.
- Every function has a short comment explaining *why*, not just restating *what* the code does.
- No dead code, no commented-out blocks left in "just in case," no copy-pasted near-duplicates —
  extract a shared function instead.
- Structure over cleverness: a junior engineer joining next month should be able to read any file
  in this repo and understand it without asking the original author.

## c. Completely Offline — No Exceptions, Even on Failure

**First, the distinction that makes this rule precise: LAN ≠ Internet.**

- Employees' laptops connecting over the office WiFi/LAN to reach the AI server's local IP is
  **required and always allowed** — that's simply how anyone uses the product at all, exactly
  like connecting to a printer or an internal tool.
- What must be **zero** is any packet leaving that local network out to the public internet —
  no cloud AI API, no external website, no cloud DNS lookup, nothing outside the local subnet.
- "Air-gapped" in this project means *the application never talks to the internet*, not *no
  network exists*. Don't confuse blocking LAN traffic (wrong — breaks the whole product) with
  blocking internet traffic (correct — this is the actual claim being proven).

**One stricter exception inside this rule:** the sandbox execution container
(`phases/03-devops-infra`, `network_mode="none"`) gets **zero network access of any kind** —
not LAN, not internet, nothing. That's a tighter rule than the rest of the system and applies
only to that one container, because it's running untrusted AI-generated code. Don't apply this
stricter "no network at all" rule anywhere else in the system, and don't loosen it for the
sandbox itself.

- No call to any external API, ever, for any reason — not as a fallback when a local model
  fails, not "just for testing," not commented as temporary. If a local model can't handle
  something, the correct behavior is to fail gracefully and say so, never to silently reach
  outside.
- This applies to every phase, including development conveniences — don't wire in an external
  API key "just to unblock progress" and plan to remove it later. It doesn't get removed later.
- The one accepted exception, stated explicitly in `README.md` Section 7: downloading models and
  sample documents **during setup**, before the system is running. Once it's running, zero
  outbound-to-internet calls, no exceptions.

## d. Always Grounded in Our Own Documents — Never Outside Info Presented as Fact

- Every knowledge-grounded agent (General Knowledge, Math/Calculation where it references SOPs,
  Blueprint/Schematic) must answer *only* from the local knowledge base, with a citation back to
  the specific document, page, and subtopic/line it came from.
- If the local knowledge base doesn't contain an answer, the agent says so plainly — it does not
  fall back on the underlying model's general training knowledge and present that as if it came
  from an MRPL document.
- The "thinking" trace shown to the user should make it possible to see *which* document was
  consulted before an answer was given — this is what makes the citation trustworthy, not decorative.
