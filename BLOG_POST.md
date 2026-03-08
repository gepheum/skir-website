# I Spent 15 Years with Protobuf. Then I Built Skir.

If a team does not use a schema language, the same pattern shows up everywhere: data contracts are copied by hand, one model per codebase, one interpretation per language.

The frontend defines `User` one way, the backend defines it another way, a worker has a third version, and services exchange free-form JSON that _usually_ matches until one day it doesn't. Then an innocent field rename, shape change, or enum tweak breaks an API path that no one expected.

Over time, teams discover tools like Protobuf and gRPC for a reason: shared contracts, generated code, and safer cross-service communication are a massive upgrade over hand-maintained JSON conventions.

For ~15 years, Protocol Buffers has been a big part of my day job. It's a great piece of engineering, and I still respect it deeply. In those exact environments where Protobuf shines—polyglot teams and long-lived systems—I kept noticing recurring friction around ergonomics, tooling, safety and overall design.

Three years ago, I started building an alternative on nights and weekends.

That project is [**Skir**](https://skir.build/).

## The pain that never really goes away

Even with solid schema tooling, real-world teams still struggle with:

- Boilerplate and glue code around serialization + RPC
- API contracts drifting between frontend and backend
- Accidental schema evolution mistakes that violate compatibility rules and can cause serious data loss
- Repositories copying common schema files instead of sharing them properly

None of this is dramatic. It's just the daily tax that slows teams down.

Skir was built to remove that tax.

## What Skir is

Skir is a declarative schema language for defining data types, constants, and RPC method signatures.

You define your schema once in `.skir`, then generate idiomatic code across major languages.

The goal is simple: one source of truth for your data contracts, everywhere.

## Why use a schema system (Skir or Protobuf) instead of plain JSON?

Most of the core value is shared by both Skir and Protobuf.

You get:

- a single source of truth for data contracts
- generated, strongly-typed models instead of hand-written parsing glue
- safer cross-language communication in polyglot systems
- built-in insurance for long-term compatibility of persisted data
- fewer integration bugs between frontend, backend, and workers

In other words: this first step is about moving from _best-effort conventions_ to _enforced contracts_.

If your system is growing, that shift alone usually pays for itself quickly.

## If you already want typed contracts, why choose Skir over Protobuf?

Skir is heavily inspired by Protobuf, but it intentionally makes different tradeoffs where I felt teams were repeatedly getting hurt.

### 1. Dense JSON: a practical middle ground between binary format and JSON

Protobuf gives you binary and JSON serialization.

Binary is compact and evolution-safe, but difficult to inspect when you're debugging data in Redis, SQ, logs, or ad-hoc scripts.

Protobuf JSON is human-readable, but because it is name-based, renaming fields can [break compatibility](https://protobuf.dev/programming-guides/json/#json-wire-safety) for persisted payloads. It is also much less compact than the binary format. In practice, that often pushes teams toward binary-by-default even when readability would help.

Skir keeps binary support, but adds **dense JSON** as the default persistence-friendly JSON format. It stays compact and compatibility-safe by using numeric identities under the hood, while still being JSON (easy to store, route, and inspect with standard tooling).

```skir
struct User {
	id: int64;
	name: string;
}

const ADA: User = { id = 1, name = "Ada" };
```

Dense JSON represents structs as arrays: `[1,"Ada"]`.
This keeps payloads compact, still allows fields to be renamed safely in the schema, and is far easier to debug than a binary blob when inspecting data with standard tools.

### 2. Compatibility checks are enforced, not just documented

Both Protobuf and Skir are designed with backward compatibility in mind.

The difference is how much the toolchain helps you stay safe.

With Protobuf, you get guidelines. They are easy guidelines, but if a team accidentally breaks one, the failure is discovered later, usually when deserialization fails somewhere painful.

With Skir, compatibility rules are actively checked by tooling (`npx skir snapshot`) so breaking changes are flagged early and can fail CI before they ship.

### 3. Adding fields to a type: should you have to update all call sites?

Answer: probably.

This is a philosophical difference in generated code behavior.

With Protobuf, adding a new field does not break existing construction code. By design. If call sites are not updated, the new field quietly takes its default value.

With Skir, generated constructors are intentionally stricter: when you add a field, missing updates at construction sites are surfaced early by type checkers/compilers.

```python
# Protobuf style (often keeps compiling after adding a new field)
user = User()
user.id = 123
user.name = "Alice"
```

```python
# Skir style: if schema adds a required field, stale construction sites are flagged
user = User(
    id=123,
    name="Alice",
)
```

This catches _forgot to populate the new field_ bugs before runtime, while still preserving compatibility during deserialization of older data.

### 4. Polymorphism done right

In Protobuf, you usually choose between two different constructs:

- `enum` for one-of-many stateless options
- `oneof` for one-of-many stateful options

When you need one-of-many options where some variants are stateless and others carry data, Protobuf often pushes you toward clunky designs with contract rules defined in comments.

```protobuf
// payment_status.proto

message PaymentStatus {
	enum Status {
		UNKNOWN = 0;
		PENDING = 1;
		PAID = 2;
		FAILED = 3;
	}
	Status status = 1;

	message Paid {
		string transaction_id = 1;
		int64 paid_at_timestamp_millis = 2;
	}
	// Must be set only when status == PAID
	Paid paid = 2;
}
```

Skir unifies stateless and stateful variants into a single Rust-style enum model.

In Skir, enums can be constant or carry payloads (Rust-style), in one construct.

```skir
// payment_status.skir

enum PaymentStatus {
	PENDING;
	paid: struct {
		transaction_id: string;
		paid_at: timestamp;
	};
	FAILED;
}
```

One concept, one pattern, less friction.

### 5. Keyed arrays instead of problematic map patterns

Protobuf introduced `map<K, V>` to avoid repeated manual iteration over lists when doing lookups. That goal is valid, but in many real schemas it creates a subtle design problem: the key is often already present inside `V`.

```protobuf
message User {
  string id = 1;
  string name = 2;
}

message UserRegistry {
  // Redundant: id is stored in the map key and again in User.id
  map<string, User> users = 1;
}
```

Now the application has an implicit contract to keep `map` keys and `User.id` values perfectly aligned. If they diverge, bugs are easy to introduce and hard to notice.

Skir introduces keyed arrays (`[Item|key_field]`) to keep one canonical source of identity while preserving fast lookup behavior in generated code.

```skir
struct User {
	id: int64;
	name: string;
}

struct UserRegistry {
	// Serialized as a plain list, indexed by id in generated code
	users: [User|id];
}
```

On the wire, this remains a normal list of `User` values (compact and portable). In generated code, Skir builds index helpers so lookups are still efficient (O(1) after index construction), without storing the identifier twice.

### 6. Constants can live in the schema and ship in generated code

Skir lets you define complex constants directly in schema files, and those constants become native generated values in every target language.

That makes frontend/backend constant sharing straightforward without extra config files or duplicated definitions.

```skir
struct Config {
	timeout_ms: int32;
	retries: int32;
	supported_locales: [string];
}

const DEFAULT_CONFIG: Config = {
	timeout_ms = 5000,
	retries = 3,
	supported_locales = ["en-US", "ja-JP", "fr-FR"],
};
```

For many teams, this is a surprisingly big quality-of-life improvement, and it is something Protobuf does not provide in the same way.

### 7. Type-safe RPC over regular HTTP

Skir services use shared method signatures and generated clients/servers, but still run on normal HTTP and plug into frameworks you already use.

gRPC is excellent for service-to-service communication, but browser-facing flows often need extra layers (like gRPC-Web or a proxy). Skir services are designed to work well in both worlds: microservice-to-microservice and backend-to-frontend communication.

No massive infrastructure migration required.

```skir
method GetUser(struct {
	user_id: int64;
}): struct {
	user: User?;
} = 1001;
```

### 8. Built-in API studio and agent-ready instructions

Skir ships with a built-in API UI for debugging: [RPC Studio](https://skir.build/docs/services#rpc-studio). Open your endpoint with `?studio` and you can immediately inspect methods and run calls.

You can also try it immediately:

```bash
npx skir-studio-demo
```

For AI-assisted workflows, Skir also exposes a lightweight instruction file so an agent can call your API with schema-aware expectations.

In Protobuf ecosystems, teams typically rely on separate external tools for interactive API exploration and agent-oriented integrations, which often means more setup and moving parts.

### 9. Better day-to-day DevX

Protobuf setup often involves extra installation steps, per-language configuration, and less-than-ideal feedback loops when iterating quickly.

Skir is intentionally optimized for daily iteration:

- `npx skir init` for fast setup
- `npx skir gen --watch` for continuous regeneration
- all your config lives in one single `skir.yml` file
- the [Skir VS Code extension](https://marketplace.visualstudio.com/items?itemName=TylerFibonacci.skir-language) with rich language tooling

The Skir extension includes syntax highlighting, inline diagnostics (including breaking-change warnings), go to definition, hover docs, find references, rename symbol, context-aware auto-completion, automatic imports, format on save, and import updates when files are moved.

### 10. Built-in dependency model via GitHub

You can import schemas from versioned GitHub repos directly, instead of copying files around or inventing your own package discipline.

```yaml
dependencies:
	"@my-org/common-schemas": v1.4.0
```

```skir
import { User } from "@my-org/common-schemas/user.skir";
```

Protobuf does not provide a comparable built-in dependency workflow. Teams usually rely on manual file sharing, git submodules, or external tooling.

Tools like [buf.build](https://buf.build) help address this gap, but they are external services and typically paid.

## Built with AI in mind

One surprising thing I noticed: AI coding assistants work better when your contracts are explicit, centralized, and strict.

That idea is now showing up in broader industry data too. This write-up — [TypeScript Tops GitHub Octoverse as AI Era Reshapes Language Choices](https://visualstudiomagazine.com/articles/2025/10/31/typescript-tops-github-octoverse-as-ai-era-reshapes-language-choices.aspx) — highlights how typed systems reduce ambiguity and catch LLM mistakes earlier.

Skir applies that same principle to cross-service and cross-language contracts.

That means better generated integrations, fewer hallucinated field names, and less _almost correct_ glue code reaching production.

## Should you switch from Protobuf?

Protobuf is battle-tested and excellent. If your team already runs on Protobuf and has large amounts of persisted protobuf data in databases or on disk, a full migration is often a major effort: you have to migrate both application code and stored data safely. In many cases, that cost is not worth it.

For new projects, though, the choice is open. That is where Skir can offer a meaningful long-term advantage on developer experience, schema evolution guardrails, and day-to-day ergonomics.

## Try it in 2 minutes

If this resonates, here's the fastest path:

1. Run `npx skir init`
2. Open the generated `.skir` file
3. Add one struct + one method
4. Run `npx skir gen --watch`
5. Use generated code from your language of choice

Website: https://skir.build/

GitHub: https://github.com/gepheum/skir

Examples:
https://skir.build/docs/examples


## Final thought

Most engineering pain doesn't come from spectacular failures.

It comes from thousands of tiny contract mismatches, awkward migrations, and “we'll fix it later” schema decisions.

Skir is my attempt to make those problems rarer.

If you give it a try, I'd genuinely love your feedback—especially from teams running mixed-language stacks at scale.
