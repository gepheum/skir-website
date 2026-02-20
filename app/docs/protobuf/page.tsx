import { CodeBlock, Note, Prose } from '@/components/prose'

export const metadata = {
  title: 'Skir vs Protobuf - Skir Documentation',
  description: 'A guide for Protocol Buffer users migrating to Skir.',
}

export default function ProtobufPage() {
  return (
    <Prose>
      <h1>Skir vs Protobuf</h1>
      <p>
        If you have used{' '}
        <a href="https://protobuf.dev/" target="_blank" rel="noopener noreferrer">
          Protocol Buffers
        </a>{' '}
        (protobuf) before, you will find Skir very familiar. Skir was heavily inspired by protobuf
        and shares many of its core design principles: efficient binary serialization, schema
        evolution, and language-agnostic types.
      </p>
      <p>
        However, Skir was built to address common pain points in the protobuf ecosystem and to
        provide a superior developer experience. This guide highlights the key differences.
      </p>

      <h2>Language differences</h2>

      <h3>Constants</h3>
      <p>
        Skir lets you define constants directly in your schema files. You can define complex values
        (structs, lists, maps, primitives) in your <code>.skir</code> file and they will be compiled
        into native code constants in your target language.
      </p>
      <CodeBlock language="skir" filename="config.skir">{`struct Config {
  timeout_ms: int32;
  retries: int32;
  supported_locales: [string];
}

const DEFAULT_CONFIG: Config = {
  timeout_ms = 5000,
  retries = 3,
  supported_locales = ["en-US", "ja-JP", "fr-FR"],
};`}</CodeBlock>
      <p>
        The <code>DEFAULT_CONFIG</code> constant is compiled into native code, ensuring your
        frontend and backend share the exact same configuration values.
      </p>

      <h3>Unified enums and oneof</h3>
      <p>
        In Protocol Buffers, an <code>enum</code> represents one of multiple stateless options, and
        a <code>oneof</code> represents one of multiple stateful options. This often leads to
        awkward patterns when you want a mix of stateless and stateful options, for example:
      </p>
      <CodeBlock language="protobuf">{`// poker.proto

message PokerAction {
  enum Enum {
    UNKNOWN = 0;
    CHECK = 1;
    BET = 2;
    CALL = 3;
    FOLD = 4;
    RAISE = 5;
  }
  Enum action = 1;
  // Only if action is BET or RAISE
  int32 amount = 2;
}`}</CodeBlock>
      <p>
        Skir unifies these two concepts into a specific "Rust-like" enum. Variants can be stateless
        (like a standard enum) or stateful (holding data), and you can mix them freely.
      </p>
      <CodeBlock language="skir">{`enum PokerAction {
  CHECK;           // Stateless variant
  bet: int32;      // Stateful variant (holds the amount)
  FOLD;
  CALL;
  raise: int32;
}`}</CodeBlock>

      <h3>Implicit UNKNOWN variant</h3>
      <p>
        The{' '}
        <a
          href="https://protobuf.dev/programming-guides/style/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Protobuf Style Guide
        </a>{' '}
        requires you to manually add an <code>UNSPECIFIED</code> value as the first entry of every
        enum to handle default values safely:
      </p>

      <blockquote className="border-l-4 pl-4 text-muted-foreground italic my-4">
        <p>
          The first listed value should be a zero value enum and have the suffix of either{' '}
          <code>_UNSPECIFIED</code> or <code>_UNKNOWN</code>. This value may be used as an
          unknown/default value and should be distinct from any of the semantic values you expect to
          be explicitly set. For more information on the unspecified enum value, see the Proto Best
          Practices page.
        </p>
      </blockquote>

      <p>
        Skir does this automatically. Every enum in Skir has an implicit <code>UNKNOWN</code>{' '}
        variant (with index 0). This serves as the default value and captures unrecognized variants
        deserialized from newer schema versions.
      </p>

      <h3>Keyed arrays vs maps</h3>
      <p>
        Protocol Buffer 3 introduced the <code>{'map<K, V>'}</code> type with the goal of preventing
        developers from having to manually iterate through lists to find items. Such manual
        iteration is cumbersome and inefficient if multiple lookups have to be performed.
      </p>
      <p>
        Unfortunately, <code>map</code> comes with a trade-off: in the majority of cases, the key
        used for indexing is already stored inside the value type.
      </p>
      <CodeBlock language="protobuf" filename="Protobuf">{`message User {
  string id = 1;
  string name = 2;
}

message UserRegistry {
  // Redundant: 'id' is stored in the map key AND the User
  map<string, User> users = 1;
}`}</CodeBlock>
      <p>
        This forces you to store the ID twice and creates an implicit contract: the code
        constructing the map must ensure the key matches the ID inside the value.
      </p>
      <p>
        Skir introduces <em>Keyed Arrays</em> to solve this problem. You define an array and tell
        the compiler which field of the value acts as the key.
      </p>
      <CodeBlock language="skir" filename="Skir">{`struct User {
  id: string;
  name: string;
}

struct UserRegistry {
  // Serialized as a list, but indexed by 'id' in generated code
  users: [User|id];
}`}</CodeBlock>
      <p>
        On the wire, <code>users</code> is serialized as a plain list of <code>User</code> objects.
        In the generated code, Skir automatically creates methods to perform O(1) lookups by{' '}
        <code>id</code>. You get the performance of a map with the storage efficiency of a list.
      </p>

      <h3>Field numbering</h3>
      <p>
        In Skir, fields in a <code>struct</code> are numbered starting from 0, and they must use
        sequential integers (no gaps allowed).
      </p>
      <p>
        This contrasts with Protocol Buffers, where field numbers must be greater than or equal to
        1, and can be sparse (you can skip numbers). Skir&apos;s sequential requirement enables more
        efficient serialization and deserialization implementations (often just array indexing)
        compared to the hash map or switch statement approaches often required for sparse field
        numbers.
      </p>

      <h3>API definitions</h3>
      <p>
        In Protocol Buffers, service methods are grouped into <code>service</code> blocks. In Skir,
        methods are defined globally in the schema, and grouping is decided in the application code.
      </p>
      <p>
        In Protocol Buffers, service methods are identified by their name. In Skir, methods are
        identified by a numeric ID. This makes it safe to rename methods without breaking
        compatibility.
      </p>

      <h2>Differences in generated code</h2>
      <p>
        Although the differences between the protobuf-generated code and the Skir-generated code
        largely depend on the targeted language, there are some general patterns across languages.
      </p>

      <h3>Adding fields to a type</h3>
      <p>This is a fundamental difference in design philosophy.</p>
      <p>
        With Protocol Buffers, adding a field to a message is guaranteed <strong>not</strong> to
        break existing code that constructs instances of that message. If the code isn't updated,
        the new field simply takes its default value (0, empty string, etc.).
      </p>
      <p>
        Skir takes the opposite approach: it aims to raise a compile-time error if you add a field
        to a struct but forget to update the code that constructs it. When you add a field, you
        usually <em>want</em> to update every instantiation site to populate that field correctly.
        Skir ensures you don't miss any spot by enforcing strict constructors.
      </p>
      <CodeBlock language="python" filename="Protobuf">{`# my_script_with_protobuf.py

# Adding 'email' to User message doesn't break this code.
user = User()
user.id = 123
user.name = "Alice"`}</CodeBlock>
      <CodeBlock language="python" filename="Skir">{`# my_script_with_skir.py

# Static type checkers will raise an error if 'email' is added to User in the
# schema file and this code is not updated.
user = User(
    id=123,
    name="Alice",
)`}</CodeBlock>
      <Note type="info">
        <p>
          When deserializing old data that is missing the new field, both Protobuf and Skir behave
          similarly: the new field is assigned its default value.
        </p>
      </Note>

      <h3>Immutability</h3>
      <p>
        In most languages, the Skir compiler generates two versions of each <code>struct</code>{' '}
        type: an immutable one and a mutable one.
      </p>
      <p>
        Immutable types generally help write safer, more predictable, and thread-safe code. However,
        there are some cases where immutability is overkill and mutable types are simply easier to
        use.
      </p>
      <p>
        Skir lets you pick on a case-by-case basis which version you want to use. It creates methods
        allowing you to easily convert between immutable and mutable, and these functions have smart
        logic to avoid unnecessary copies.
      </p>
      <p>
        In contrast, Protocol Buffers typically does not generate immutable types in languages like
        TypeScript and Python.
      </p>

      <h2>Schema evolution: guidelines vs guarantees</h2>
      <p>
        Both Protocol Buffers and Skir are designed to support schema evolution, but they take
        fundamentally different approaches to ensuring compatibility.
      </p>
      <p>
        Protocol Buffers provides{' '}
        <a
          href="https://protobuf.dev/programming-guides/proto3/#updating"
          target="_blank"
          rel="noopener noreferrer"
        >
          guidelines and best practices
        </a>{' '}
        for evolving schemas safely. These guidelines tell you which changes are safe (e.g., adding
        fields, renaming) and which are dangerous (e.g., changing field numbers, incompatible type
        changes). However, <strong>nothing in the toolchain enforces these rules</strong>. It is
        entirely up to developers to remember the guidelines, understand the implications, and avoid
        making breaking changes.
      </p>
      <p>
        This manual approach works well in small teams with high discipline, but it becomes
        error-prone as teams grow or when developers are less familiar with the evolution rules.
        Breaking changes can slip through code review and cause production issues when old code
        encounters incompatible new data, or when new code cannot deserialize old persisted records.
      </p>
      <p>
        Skir takes a different approach: it provides <strong>automated enforcement</strong> through
        its built-in snapshot tool. When you run <code>npx skir snapshot</code>, Skir analyzes your
        current schema against a stored snapshot of the previous version and automatically detects
        breaking changes. If you accidentally change a field number or make an incompatible type
        change, Skir will catch it and refuse to proceed.
      </p>
      <p>
        This shift from <em>guidelines you must remember to follow</em> to{' '}
        <em>automated checks that prevent mistakes</em> provides a much stronger guarantee of
        compatibility. You can confidently evolve your schema knowing that the tooling will catch
        any dangerous changes before they reach production. Additionally, when integrated into your
        CI pipeline or Git pre-commit hooks, the snapshot check ensures that every schema change is
        validated automatically.
      </p>

      <h2>External dependencies</h2>
      <p>
        Protocol Buffers does not come with a built-in package manager. To share types across
        multiple Git repositories, developers traditionally have to rely on{' '}
        <code>git submodule</code>, manual file copying, or external commercial services like{' '}
        <code>buf</code>.
      </p>
      <p>
        Skir includes a built-in, free package manager that treats GitHub repositories as packages.
        This allows you to easily share common data structures (like standard currency types or user
        definitions) across your backend microservices and your frontend applications.
      </p>
      <ol>
        <li>
          Define dependencies in <code>skir.yml</code>, pointing to any public or private GitHub
          repository and a tag.
        </li>
        <li>
          Import the types you need: <code>import User from "@my-org/common-types/user.skir";</code>
        </li>
        <li>
          Run <code>npx skir gen</code>.
        </li>
      </ol>
      <p>
        Skir handles downloading the repositories from GitHub, caching them, and resolving imports
        automatically. You get a full-featured schema registry experience using just your existing
        source control.
      </p>

      <h2>Serialization</h2>
      <p>Protobuf has two serialization formats: Binary and JSON (Proto3 JSON Mapping).</p>
      <p>
        The Protobuf JSON format is readable (uses field names), but is not safe for schema
        evolution (renaming fields breaks compatibility).
      </p>
      <p>Skir offers three serialization formats:</p>
      <ul>
        <li>
          <strong>JSON (Dense)</strong>: Structs are serialized as arrays (<code>[val1, val2]</code>
          ) rather than objects. It is the default choice offering the best balance between:
          <ul>
            <li>
              Space efficiency: although it is not as space efficient as binary, it comes close.
            </li>
            <li>Evolution safety: you can rename fields without breaking compatibility.</li>
            <li>
              Interoperability and debuggability: being valid JSON, it is easy to inspect and works
              out of the box with databases (e.g., PostgreSQL JSONB columns) and external tools,
              unlike binary formats.
            </li>
          </ul>
        </li>
        <li>
          <strong>JSON (Readable)</strong>: Similar to Protobuf&apos;s JSON mapping. Useful for
          debugging but unsafe for persistence as it relies on field names.
        </li>
        <li>
          <strong>Binary</strong>: Equivalent to Protobuf binary. A bit more compact and performant
          than dense JSON.
        </li>
      </ul>

      <h2>RPC Services</h2>
      <p>
        Protobuf is typically paired with gRPC. While efficient, gRPC requires specific tooling for
        debugging (like <code>grpcui</code>) and often needs a proxy (gRPC-Web) to be called from a
        browser.
      </p>
      <p>
        Skir services run over standard HTTP and are designed to be embedded into your existing
        application (Express, Flask, Spring Boot, etc.). This makes them naturally compatible with
        web clients and easy to inspect with standard tools like cURL.
      </p>
      <p>
        Additionally, every Skir service comes with <strong>Skir Studio</strong> out of the box.
        This built-in interactive debugging interface allows you to explore your API and test
        methods directly in your browser, without needing to install or configure any external
        tools.
      </p>
    </Prose>
  )
}
