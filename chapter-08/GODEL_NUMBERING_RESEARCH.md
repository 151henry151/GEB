# Gödel Numbering — Research Summary for Chapter VIII Companion

This document summarizes authoritative sources so we implement the "Assign Gödel Number" panel accurately. It does **not** prescribe a single "correct" numbering (many exist); it clarifies the **method** and **constraints**.

---

## 1. What Gödel numbering is

- A **function** that assigns to each symbol and each well-formed expression (formula, proof) of a formal language a **unique natural number** (the Gödel number).
- **Purpose:** Syntax becomes arithmetic. "Being a proof of formula X" becomes a relation between numbers, which can then be expressed inside the formal theory (e.g. TNT).
- **Requirement:** The method must be **effective** — computable in both directions: formula ↔ number.

Sources: Stanford Encyclopedia of Philosophy (SEP), Wikipedia "Gödel numbering," MathWorld.

---

## 2. Two-step method (standard textbook presentation)

### Step 1: Symbol numbers

- Assign to each **primitive symbol** of the language a **natural number** (its symbol number).
- The assignment is **arbitrary** but **fixed**. Many choices exist; what matters is consistency.
- **Constraint:** Symbol numbers should be **positive** (≥ 1). Using 0 as a symbol code can complicate the sequence encoding (e.g. in prime-power coding, 2^0 = 1 and uniqueness can be lost depending on formulation). So we use 1, 2, 3, … for our symbols.

**Our TNT fragment (formula builder) has 7 symbols:** `0` `S` `+` `·` `=` `(` `)`.

Example assignment (we can use this or any other fixed map):

| Symbol | Code |
|--------|------|
| 0      | 1    |
| S      | 2    |
| +      | 3    |
| ·      | 4    |
| =      | 5    |
| (      | 6    |
| )      | 7    |

Other sources use different tables (e.g. SEP: 0→1, '→2, +=3, ×→4, =→5, (→6, )→7, ¬→8, →→9, ∀→10, variables 11+i; Nagel & Newman: 0→6, =→5; Wikipedia proof-sketch: digit-concatenation with 666, 123, 111, etc.). So we **state our assignment clearly** in the companion and use it consistently.

### Step 2: Encoding sequences (formula = sequence of symbols)

A formula is a **sequence** of symbols. We encode sequences of (positive) numbers into **one** number. Two common methods:

#### Method A: Prime-power encoding (Gödel’s original; SEP; MathWorld)

- Primes in order: p₁ = 2, p₂ = 3, p₃ = 5, p₄ = 7, …
- Sequence (n₀, n₁, n₂, …, nₖ) → **2^(n₀) × 3^(n₁) × 5^(n₂) × … × p₍ₖ₊₁₎^(nₖ)**.
- So **position** in the formula determines the **prime**; **symbol** determines the **exponent**.
- Uniqueness follows from the **fundamental theorem of arithmetic** (unique prime factorization). Decoding: factor the number, read off exponents in order → sequence of symbol numbers → formula.

**Example (with our table):** Formula `0=0` → symbol sequence (0, =, 0) → code sequence (1, 5, 1) → Gödel number = 2¹ × 3⁵ × 5¹ = 2 × 243 × 5 = **2430**.

**Example (SEP):** Same idea with their table: 0→1, =→5 → (1, 5, 1) → 2¹×3⁵×5¹ = 2430.

#### Method B: Digit concatenation (e.g. Wikipedia proof-sketch, “Hofstadter-style”)

- Each symbol gets a **multi-digit** code (no 0 inside the digit string). Formulas are encoded by **concatenating** symbol codes with a separator (e.g. 0). So the “number” is the decimal string, e.g. 666 0 111 0 666 for “0=0”.
- Also effective and decodable; different look and feel from prime-power.

**For our companion:** The spec says “product of primes raised to symbol-code powers.” So we implement **Method A (prime-power)** and make the animation show: symbol → code, then formula → 2^code₁ × 3^code₂ × … .

---

## 3. What we must get right

1. **Symbol → number:** Fixed table for 0, S, +, ·, =, (, ). Use positive integers (e.g. 1–7). Display this table in the companion (e.g. in “How it works” or in the Gödel panel).
2. **Formula → number:** Treat the formula as the **sequence of symbols** (in order). Compute  
   **Gödel number = 2^(code of 1st symbol) × 3^(code of 2nd symbol) × 5^(code of 3rd) × …**  
   using as many primes as there are symbols. So we use **one prime per position**, **exponent = symbol code**.
3. **Wording:** Say that “each symbol gets a number” and “the formula’s Gödel number is the product of the first primes raised to those symbol numbers (in order).” Optionally: “This is one possible Gödel numbering; the exact assignment varies in the literature, but the idea is the same.”
4. **Decodability:** Our number is uniquely factorable, so the formula can be recovered from the number (we could add a “Decode” step later if desired).

---

## 4. What we are not implementing (for now)

- **Proofs:** Encoding **sequences of formulas** (e.g. a derivation) as numbers. Usually done by encoding the list of formula Gödel numbers with a second layer of encoding (e.g. again prime powers: prime 2 for first formula, 3 for second, etc.). We can mention in the caption that “every proof has a number” without implementing proof encoding in the first version.
- **Full TNT language:** Our builder has no variables, quantifiers, or connectives. So our Gödel numbering is for this **fragment** only. We can label it as “Gödel numbering for this TNT fragment” or “a Gödel numbering of formulas built from 0, S, +, ·, =.”

---

## 5. Spec wording vs accuracy

- Spec example: “0→6, S→7, +→2, etc.” — that’s **one possible** assignment. We are **not** required to use those exact numbers. We should pick **one** consistent table, document it, and use it in both the animation and any decode.
- “Product of primes raised to symbol-code powers” — correct for Method A. Just ensure we say (or show) that the **first** prime is for the **first** symbol, the **second** prime for the **second** symbol, and so on. So: **position → prime; symbol → exponent.**

---

## 6. Suggested companion text (short)

- **Before animation:** “Each symbol gets a number (we use: 0→1, S→2, +→3, ·→4, =→5, (→6, )→7). The formula’s Gödel number is 2^(first symbol’s code) × 3^(second) × 5^(third) × … . This is one standard way to encode formulas as numbers.”
- **After result:** “This formula is also a number. TNT can talk about this number. So TNT can talk about this formula.” (Spec.)
- **Optional:** “Every formula has a number. Every proof has a number. Arithmetic can therefore discuss proofs.” (Spec.)

---

## 7. References

- Stanford Encyclopedia of Philosophy, “Gödel’s Incompleteness Theorems” (Supplement: Gödel Numbering): symbol numbers, prime-power coding, uniqueness, effectiveness.
- Wikipedia, “Gödel numbering”: definition, prime factorization encoding, note on multiple possible numberings.
- Wikipedia, “Proof sketch for Gödel’s first incompleteness theorem”: alternative (Hofstadter-style) concatenation encoding; our implementation follows the prime-power method instead.
- MathWorld, “Gödel Number”: product of successive primes raised to symbol powers.
