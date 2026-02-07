import { HoverVideo } from '@/components/hover-video'
import { NextPageLink } from '@/components/next-page-link'
import { CodeBlock, Note, Prose } from '@/components/prose'

export const metadata = {
  title: 'Schema Evolution & Compatibility - Skir',
  description: 'Guidelines for evolving your Skir schema without breaking backward compatibility.',
}

export default function SchemaEvolutionPage() {
  return (
    <Prose>
      <h1>Schema evolution & compatibility</h1>
      <p>
        Skir is designed for long-term data persistence and distributed systems. It ensures that
        your application can evolve its data structures while maintaining compatibility with older
        data (backward compatibility) and older clients (forward compatibility).
      </p>

      <h2>Core concepts</h2>
      <ul>
        <li>
          <strong>Backward compatibility</strong>: New code can read old data. This is essential for
          reading records stored in a database created with an older schema.
        </li>
        <li>
          <strong>Forward compatibility</strong>: Old code can read new data. This is critical in
          distributed systems where different services or clients may be running different versions
          of your application.
        </li>
      </ul>

      <h2>Safe schema changes</h2>
      <p>The following changes are safe and preserve both backward and forward compatibility:</p>

      <h3>Adding fields to a struct</h3>
      <p>New code reading old data will use default values for missing fields:</p>
      <ul>
        <li>
          <strong>Numbers</strong>: <code>0</code>
        </li>
        <li>
          <strong>Booleans</strong>: <code>false</code>
        </li>
        <li>
          <strong>Strings/Bytes</strong>: Empty string/bytes
        </li>
        <li>
          <strong>Arrays</strong>: Empty array <code>[]</code>
        </li>
        <li>
          <strong>Structs</strong>: A struct with all fields at their default values
        </li>
        <li>
          <strong>Enums</strong>: The implicit <code>UNKNOWN</code> variant
        </li>
        <li>
          <strong>Optional types</strong>: <code>null</code>
        </li>
      </ul>

      <h3>Adding variants to an enum</h3>
      <p>
        Old code encountering a new variant will treat it as the implicit <code>UNKNOWN</code>{' '}
        variant.
      </p>

      <h3>Renaming types, fields, and variants</h3>
      <p>
        Skir uses numeric identifiers (field numbers) in its binary and compact JSON formats, not
        names. Therefore, renaming any element is safe.
      </p>
      <Note type="info">
        <p>
          Names <em>are</em> used in the human-readable JSON format. This format is for debugging
          only and should not be used for storage or inter-service communication.
        </p>
      </Note>

      <h3>Removing fields or variants</h3>
      <p>
        You must mark the field or variant number as <code>removed</code> to prevent accidental
        reuse.
      </p>

      <h3>Compatible type changes</h3>
      <p>You can change a type if the new type is backward-compatible with the old one:</p>
      <ul>
        <li>
          <code>bool</code> → <code>int32</code>, <code>int64</code>, <code>hash64</code>
        </li>
        <li>
          <code>int32</code> → <code>int64</code>
        </li>
        <li>
          <code>float32</code> → <code>float64</code>
        </li>
        <li>
          <code>float64</code> → <code>float32</code> (precision loss possible)
        </li>
        <li>
          <code>[A]</code> → <code>[B]</code> (if <code>A</code> → <code>B</code> is valid)
        </li>
        <li>
          <code>A?</code> → <code>B?</code> (if <code>A</code> → <code>B</code> is valid)
        </li>
      </ul>

      <h2>Unsafe changes</h2>
      <p>The following changes will break compatibility:</p>
      <ul>
        <li>
          Changing a field/variant number, or reordering fields/variants if using implicit
          numbering.
        </li>
        <li>
          Changing the type of a field, wrapper variant, method request or method response to an
          incompatible type.
        </li>
        <li>Changing a method's stable identifier.</li>
        <li>
          Reusing a <code>removed</code> field or variant number.
        </li>
        <li>
          Deleting a field or variant without marking it as <code>removed</code>.
        </li>
        <li>Changing a constant variant to a wrapper variant or vice-versa.</li>
      </ul>

      <h2>Automated compatibility checks</h2>
      <p>
        The Skir compiler includes a <code>snapshot</code> tool to prevent accidental breaking
        changes.
      </p>

      <h3>How it works</h3>
      <p>
        The <code>npx skir snapshot</code> command helps you manage schema evolution by maintaining
        a history of your schema state. When you run this command, two things happen:
      </p>
      <ol>
        <li>
          <strong>Verification</strong>: Skir checks for a <code>skir-snapshot.json</code> file. If
          it exists, it compares your current <code>.skir</code> files against it. If breaking
          changes are detected, the command reports them and exits.
        </li>
        <li>
          <strong>Update</strong>: If no breaking changes are found (or if no snapshot exists), Skir
          creates or updates the <code>skir-snapshot.json</code> file to reflect the current schema.
        </li>
      </ol>

      <h3>Tracked types and stable identifiers</h3>
      <p>
        To track compatibility across renames, Skir needs a stable identifier for your types. You
        can assign a random integer ID to any struct or enum:
      </p>
      <CodeBlock language="skir">{`// "User" is now tracked by ID 500996846
struct User(500996846) {
  name: string;
}`}</CodeBlock>
      <p>
        If you rename <code>User</code> to <code>Account</code> but keep the ID{' '}
        <code>500996846</code>, Skir knows it's the same type and will validate the change safely.
      </p>
      <Note type="tip">
        <p>
          Assign stable identifiers to all root types used for storage. Nested types are implicitly
          tracked through their parents so you don't need to give them a stable identifier.
          Similarly, the request and response types of methods are automatically tracked as part of
          the method definition.
        </p>
      </Note>

      <h3>Handling intentional breaking changes</h3>
      <p>
        If you must make a breaking change (e.g., during early development), simply delete the{' '}
        <code>skir-snapshot.json</code> file and run <code>npx skir snapshot</code> again to
        establish a new baseline.
      </p>

      <h2>Recommended workflow</h2>

      <h3>1. During development</h3>
      <p>
        While drafting a new schema version, use the <code>--dry-run</code> flag to check for
        backward compatibility without updating the snapshot:
      </p>
      <CodeBlock language="bash">{`npx skir snapshot --dry-run`}</CodeBlock>
      <p>This confirms that your changes are safe relative to the last release (snapshot).</p>

      <p>
        If you are using the official{' '}
        <a
          href="https://marketplace.visualstudio.com/items?itemName=Gepheum.skir-vscode"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium decoration-primary decoration-2 underline-offset-2"
        >
          VSCode extension
        </a>
        , breaking changes will be highlighted directly in your editor as you type.
      </p>
      <div className="not-prose my-6 pt-[2px] w-[460px] max-w-full mx-auto">
        <HoverVideo src="/skir-website/schema-evolution-check.mp4" />
      </div>

      <h3>2. Before release</h3>
      <p>
        Run <code>npx skir snapshot</code> without flags to verify compatibility and commit the new
        schema state to the snapshot file.
      </p>

      <h3>3. Continuous integration</h3>
      <p>
        Add the command to your CI pipeline or pre-commit hook to prevent accidental breaking
        changes. The <code>--ci</code> flag ensures the snapshot is up-to-date and compatible:
      </p>
      <CodeBlock language="yaml">{`- name: Ensure Skir snapshot up-to-date
  run: npx skir snapshot --ci`}</CodeBlock>

      <h2>Round-tripping unrecognized data</h2>
      <p>
        Consider a service in a distributed system that reads a Skir value, modifies it, and writes
        it back. If the schema has evolved (e.g., new fields were added) but the service is running
        older code, it may encounter data it doesn't recognize.
      </p>
      <p>
        When deserializing, you can choose to either <strong>drop</strong> or{' '}
        <strong>preserve</strong> this unrecognized data.
      </p>
      <ul>
        <li>
          <strong>Drop (default)</strong>: Unrecognized fields and variants are discarded. This is
          safer but results in data loss if the object is saved back to storage.
        </li>
        <li>
          <strong>Preserve</strong>: Unrecognized data is kept internally and written back during
          serialization. This enables "round-tripping".
        </li>
      </ul>

      <h3>Example</h3>
      <p>Consider a schema evolution where a field and an enum variant are added:</p>
      <CodeBlock language="skir" filename="Version 1">{`struct UserBefore(999) {
  id: int64;
  subscription_status: enum {
    FREE;
    PREMIUM;
  };
}`}</CodeBlock>
      <CodeBlock language="skir" filename="Version 2">{`struct UserAfter(999) {
  id: int64;
  subscription_status: enum {
    FREE;
    PREMIUM;
    TRIAL;  // Added
  };
  name: string;  // Added
}`}</CodeBlock>

      <h4>Default behavior: drop</h4>
      <p>By default, unrecognized data is lost during the round-trip.</p>
      <CodeBlock language="typescript">{`// Old code reads and writes the data
const oldUser = UserBefore.serializer.fromJson(originalJson);
const roundTrippedJson = UserBefore.serializer.toJson(oldUser);

// New code reads the result
const result = UserAfter.serializer.fromJson(roundTrippedJson);

assert(result.id === 123);
assert(result.name === "");  // Lost: reset to default
assert(result.subscriptionStatus.union.kind === "UNKNOWN");  // Lost: became UNKNOWN`}</CodeBlock>

      <h4>Preserve behavior</h4>
      <p>You can configure the deserializer to keep unrecognized values.</p>
      <CodeBlock language="typescript">{`// Old code reads with "keep-unrecognized-values"
const oldUser = UserBefore.serializer.fromJson(
  originalJson,
  "keep-unrecognized-values"
);
const roundTrippedJson = UserBefore.serializer.toJson(oldUser);

// New code reads the result
const result = UserAfter.serializer.fromJson(roundTrippedJson);

assert(result.id === 123);
assert(result.name === "Jane");  // Preserved!
assert(result.subscriptionStatus.union.kind === "TRIAL");  // Preserved!`}</CodeBlock>

      <Note type="warning">
        <p>
          <strong>Only preserve unrecognized data from trusted sources.</strong> Malicious actors
          could inject fields with IDs that you haven't defined yet. If you preserve this data and
          later define those IDs in a future version of your schema, the injected data could be
          deserialized as valid fields, potentially leading to security vulnerabilities or data
          corruption.
        </p>
      </Note>

      <NextPageLink title="Skir services" href="/docs/rpc" />
    </Prose>
  )
}
