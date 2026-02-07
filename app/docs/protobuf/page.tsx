import { CodeBlock, Note, Prose } from '@/components/prose'

export const metadata = {
  title: 'Coming from Protocol Buffer - Skir',
  description: 'A guide for Protocol Buffer users migrating to Skir.',
}

export default function ProtobufPage() {
  return (
    <Prose>
      <h1>Coming from Protocol Buffer</h1>
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
        enum to handle default values safely.
      </p>
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

      <h3>API definition</h3>
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

      <h2>Package management</h2>
      <p>
        Protocol Buffers does not come with a built-in package manager. To share types across
        multiple Git repositories, developers traditionally have to rely on{' '}
        <code>git submodule</code>, manual file copying, or external commercial services like{' '}
        <code>buf</code>.
      </p>
      <p>
        Skir includes a built-in, free package manager that treats{' '}
        <strong>GitHub repositories as packages</strong>. This allows you to easily share common
        data structures (like standard currency types or user definitions) across your backend
        microservices and your frontend applications.
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

      <h2>Serialization flexibility</h2>
      <p>Protobuf has two main formats: Binary and JSON (Proto3 JSON Mapping).</p>
      <p>
        The Protobuf JSON format is <em>readable</em> (uses field names), but because field names
        can change, it is not safe for long-term storage or schema evolution.
      </p>
      <p>Skir lets you choose between three formats:</p>
      <ol>
        <li>
          <strong>Binary</strong>: Equivalent to Protobuf binary. Compact and fast.
        </li>
        <li>
          <strong>Readable JSON</strong>: Like Protobuf JSON. Good for debugging, bad for specific
          schema evolution cases (renames).
        </li>
        <li>
          <strong>Dense JSON</strong>: A unique Skir format which is often the best default choice.
          It serializes structs as JSON arrays (<code>[val1, val2, ...]</code>) instead of objects.
          <ul>
            <li>
              <strong>Compact</strong>: Smaller than readable JSON, and often only ~20% larger than
              the binary format.
            </li>
            <li>
              <strong>Evolution-safe</strong>: Uses field numbers, not names. You can rename fields
              without breaking compatibility.
            </li>
            <li>
              <strong>Storage-ready</strong>: Perfect for storing data in text-based columns (like
              PostgreSQL JSONB) while maintaining the ability to rename fields in your schema.
            </li>
          </ul>
        </li>
      </ol>

      <h2>RPC Services</h2>
      <p>
        Protobuf is tightly coupled with gRPC. While you <em>can</em> use Protobuf with other
        transports, gRPC is the default and often the only easy path.
      </p>
      <p>
        Skir is transport-agnostic. It gives you a generic <code>Service</code> interface that
        handles routing and serialization/deserialization. You can hook this into <em>any</em> HTTP
        server or transport layer. This allows you to support high-performance binary RPCs for
        microservices (similar to gRPC) while simultaneously serving standard JSON over HTTP for
        browser clients, all without needing a proxy.
      </p>
      <p>
        Skir services are designed to be embedded into your existing application (Express, Flask,
        Spring Boot, etc.) rather than forcing you to run a separate server.
      </p>
    </Prose>
  )
}
