import { Prose, CodeBlock, Note } from "@/components/prose"

export const metadata = {
  title: "Language Reference - Skir",
  description: "Complete guide to the Skir schema language syntax and features.",
}

export default function LanguageReferencePage() {
  return (
    <Prose>
      <h1>Skir language reference</h1>

      <h2>Records</h2>
      <p>There are two types of records: structs and enums.</p>

      <h3>Structs</h3>
      <p>
        Use the keyword <code>struct</code> to define a struct, which is a collection of fields of different types.
      </p>
      <p>
        The fields of a struct have a name, but during serialization they are actually identified by a number, which can either be set explicitly:
      </p>
      <CodeBlock language="skir">{`struct Point {
  x: int32 = 0;
  y: int32 = 1;
  label: string = 2;
}`}</CodeBlock>
      <p>or implicitly:</p>
      <CodeBlock language="skir">{`struct Point {
  x: int32;     // implicitly set to 0
  y: int32;     // implicitly set to 1
  label: string; // implicitly set to 2
}`}</CodeBlock>
      <p>
        If you're not explicitly specifying the field numbers, you must be careful not to change the order of the fields or else you won't be able to deserialize old values.
      </p>
      <CodeBlock language="skir">{`// BAD: you can't reorder the fields and keep implicit numbering
// struct Point {
//   label: string;
//   x: int32;
//   y: int32;
// }

// GOOD
struct Point {
  label: string = 2;

  // Fine to rename fields
  x_coordinate: int32 = 0;
  y_coordinate: int32 = 1;

  // Fine to add new fields
  color: Color = 3;
}`}</CodeBlock>

      <h3>Enums</h3>
      <p>
        Enums in Skir are similar to enums in Rust. An enum value is one of several possible variants, and each variant can optionally have data associated with it.
      </p>
      <CodeBlock language="skir">{`// Indicates whether an operation succeeded or failed.
enum OperationStatus {
  SUCCESS;        // a constant variant
  error: string;  // a wrapper variant
}`}</CodeBlock>
      <p>In this example, an <code>OperationStatus</code> is one of these 3 things:</p>
      <ul>
        <li>the <code>SUCCESS</code> constant</li>
        <li>an <code>error</code> with a string value</li>
        <li><code>UNKNOWN</code>: a special implicit variant common to all enums</li>
      </ul>
      <p>If you need a variant to hold multiple values, wrap them inside a struct:</p>
      <CodeBlock language="skir">{`struct MoveAction {
  x: int32;
  y: int32;
}

enum BoardGameTurn {
  PASS;
  move: MoveAction;
}`}</CodeBlock>
      <p>Like the fields of a struct, the variants of an enum have a number, and the numbering can be explicit or implicit.</p>
      <CodeBlock language="skir">{`enum ExplicitNumbering {
  // The numbers don't need to be consecutive.
  FOO = 10;
  bar: string = 2;
}

enum ImplicitNumbering {
  // Implicit numbering is 1-based.
  // 0 is reserved for the special UNKNOWN variant.

  FOO;          // = 1
  bar: string;  // = 2
}`}</CodeBlock>
      <p>
        The variant numbers are used for identifying the variants in the serialization format (not the variant names). You must be careful not to change the number of a variant, or you won't be able to deserialize old values. For example, if you're using implicit numbering, you must not reorder the variants.
      </p>
      <p>It is always fine to rename an enum, rename the variants of an enum, or add new variants to an enum.</p>

      <h3>Nesting records</h3>
      <p>
        You can define a record (struct or enum) within the definition of another record. This is simply for namespacing, and it can help make your <code>.skir</code> files more organized.
      </p>
      <CodeBlock language="skir">{`enum Status {
  OK;

  struct Error {
    message: string;
  }
  error: Error;
}

struct Foo {
  // Note the dot notation to refer to the nested record.
  error: Status.Error;
}`}</CodeBlock>

      <h3>Inline records</h3>
      <p>
        For improved readability and conciseness, Skir allows you to define records (structs or enums) directly within a field's type definition. This <strong>inline</strong> syntax is a shorthand for explicitly nesting a record definition and then referencing it as a type.
      </p>
      <p>
        When you use an inline record, the Skir compiler automatically infers the name of the record by converting the <code>snake_case</code> field name into <code>PascalCase</code>.
      </p>
      <CodeBlock language="skir">{`// Using inline records

struct Notification {
  metadata: struct {
    sent_at: timestamp;
    sender_id: string;
  }

  payload: enum {
    APP_LAUNCH;
    message: struct {
      body: string;
      title: string;
    }
  }
}`}</CodeBlock>

      <h3>Removed numbers</h3>
      <p>
        When removing a field from a struct or a variant from an enum, you must mark the removed number in the record definition using the <code>removed</code> keyword. The syntax is different whether you're using explicit or implicit numbering:
      </p>
      <CodeBlock language="skir">{`struct ExplicitNumbering {
  a: string = 0;
  b: string = 1;
  f: string = 5;
  removed 2..4, 6;  // 2..4 is same as 2, 3, 4
}

struct ImplicitNumbering {
  a: string;
  b: string:
  removed;
  removed;
  removed;
  f: string;
  removed;
}`}</CodeBlock>

      <h3>Stable identifiers</h3>
      <p>
        You can assign a numeric stable identifier to a struct or an enum by specifying it in parentheses after the record name:
      </p>
      <CodeBlock language="skir">{`struct Point(23456) { ... }`}</CodeBlock>
      <p>
        This identifier is used by the <code>npx skir snapshot</code> command to track record identity across renames and detect breaking changes.
      </p>
      <p>No two types in your Skir project can have the same stable identifier.</p>
      <Note type="tip">
        <p>
          You can use <code>?</code> as a placeholder for the identifier and run <code>npx skir format</code>. It will replace the question mark with a generated random number. This replacement happens automatically on save if you are using the VSCode extension.
        </p>
      </Note>

      <h3>Recursive records</h3>
      <p>
        Records can be recursive, meaning a record can contain a field of its own type, either directly or indirectly. This feature is essential for defining recursive data structures such as trees.
      </p>
      <CodeBlock language="skir">{`struct DecisionNode {
  question: string;
  yes: DecisionTree;
  no: DecisionTree;
}

enum DecisionTree {
  result: string;
  node: DecisionNode;
}`}</CodeBlock>

      <h2>Data types</h2>

      <h3>Primitive types</h3>
      <ul>
        <li><code>bool</code>: true or false</li>
        <li><code>int32</code>: a signed 32-bit integer</li>
        <li><code>int64</code>: a signed 64-bit integer</li>
        <li><code>hash64</code>: an unsigned 64-bit integer; prefer using this for hash codes and <code>int64</code> for numbers which represent an actual <em>count</em></li>
        <li><code>float32</code>: a 32-bit floating point number; can be one of <code>NaN</code>, <code>Infinity</code> or <code>-Infinity</code></li>
        <li><code>float64</code>: a 64-bit floating point number; can be one of <code>NaN</code>, <code>Infinity</code> or <code>-Infinity</code></li>
        <li><code>string</code>: a Unicode string</li>
        <li><code>bytes</code>: a sequence of bytes</li>
        <li><code>timestamp</code>: a specific instant in time represented as an integral number of milliseconds since the Unix epoch</li>
      </ul>

      <h3>Array type</h3>
      <p>
        Wrap the item type inside square brackets to represent an array of items, e.g. <code>[string]</code> or <code>[User]</code>.
      </p>

      <h4>Keyed arrays</h4>
      <p>
        If the items are structs and one of the struct fields can be used to identify every item in the array, you can add the field name next to a pipe character: <code>[Item|key_field]</code>.
      </p>
      <CodeBlock language="skir">{`struct User {
  id: int32;
  name: string;
}

struct UserRegistry {
  users: [User|id];
}`}</CodeBlock>
      <p>
        Language plugins will generate methods allowing you to perform key lookups in the array using a hash table. For example, in Python:
      </p>
      <CodeBlock language="python">{`user = user_registry.users.find(user_id)
if user:
    do_something(user)`}</CodeBlock>
      <p>
        If the item key is nested within another struct, you can chain the field names like so: <code>[Item|a.b.c]</code>.
      </p>

      <h3>Optional type</h3>
      <p>
        Add a question mark at the end of a non-optional type to make it optional. An <code>other_type?</code> value is either an <code>other_type</code> or null.
      </p>

      <h2>Constants</h2>
      <p>
        You can define constants of any type with the <code>const</code> keyword. The syntax for representing the value is similar to JSON, with the following differences:
      </p>
      <ul>
        <li>object keys must not be quoted</li>
        <li>trailing commas are allowed and even encouraged</li>
        <li>strings can be single-quoted or double-quoted</li>
        <li>strings can span multiple lines by escaping new line characters</li>
      </ul>
      <CodeBlock language="skir">{`const PI: float64 = 3.14159;

const LARGE_CIRCLE: Circle = {
  center: {
    x: 100,
    y: 100,
  },
  radius: 100,
  color: {
    r: 255,
    g: 0,
    b: 255,
    label: "fuschia",
  },
};

const SUPPORTED_LOCALES: [string] = [
  "en-GB",
  "en-US",
  "es-MX",
];

// Use strings for enum constants.
const REST_DAY: Weekday = "SUNDAY";

// Use { kind: ..., value: ... } for enum variants holding a value.
const NOT_IMPLEMENTED_ERROR: OperationStatus = {
  kind: "error",
  value: "Not implemented",
};`}</CodeBlock>
      <p>
        All the fields of a struct must be specified, unless you use <code>{'{| ... |}'}</code> instead of <code>{'{ ... }'}</code>, in which case missing fields are set to their default values.
      </p>

      <h2>Methods (RPCs)</h2>
      <p>The <code>method</code> keyword allows you to define the signature of a remote method.</p>
      <CodeBlock language="skir">{`struct GetUserProfileRequest {
  user_id: int32;
}

struct GetUserProfileResponse {
  profile: UserProfile?;
}

method GetUserProfile(GetUserProfileRequest): GetUserProfileResponse = 12345;`}</CodeBlock>
      <p>The request and response can have any type.</p>

      <h3>Stable identifiers</h3>
      <p>
        Every method must have a unique integer identifier (e.g. <code>= 12345</code>) used for RPC routing. This identifier decouples the method's identity from its name, allowing safe renaming and refactoring without breaking compatibility with older clients.
      </p>
      <p>No two methods in your Skir project can have the same stable identifier.</p>

      <h3>Inline request/response records</h3>
      <p>
        Just as you can define structs and enums inline for fields, Skir supports inline record definitions for RPC methods. This allows you to define the request and response structures directly within the method signature.
      </p>
      <CodeBlock language="skir">{`// Using inline records

method GetUserProfile(struct {
  user_id: int32;
}): struct {
  profile: UserProfile?;
} = 12345;`}</CodeBlock>

      <h2>Imports</h2>
      <p>
        The <code>import</code> statement allows you to import types from another module. You can either specify the names to import, or import the whole module with an alias using the <code>as</code> keyword.
      </p>
      <CodeBlock language="skir">{`import Point, Circle from "geometry/geometry.skir";
import * as color from "color.skir";

struct Rectangle {
  top_left: Point;
  bottom_right: Point;
}

struct Disk {
  circle: Circle;
  fill_color: color.Color; // the type is defined in the "color.skir" module
}`}</CodeBlock>
      <p>The path is always relative to the root of the Skir source directory.</p>

      <h2>Doc comments</h2>
      <p>
        Doc comments are designated by three forward slashes (<code>///</code>) and are used to provide high-level documentation for records, fields, variants, methods and constants. Unlike regular comments (<code>//</code> or <code>/*</code>), which are ignored by the compiler, doc comments are processed as part of your schema definition.
      </p>

      <h3>Referencing symbols</h3>
      <p>
        Doc comments can contain references to other symbols within your schema by enclosing them in square brackets. If a symbol referenced in square brackets is missing or misspelled, the Skir compiler will trigger a compilation error. This ensures that your documentation never becomes <em>stale</em> or refers to fields that no longer exist.
      </p>
      <CodeBlock language="skir">{`struct Account {
  /// Same as [User.email]
  email: string;
  /// True if the [email] has been confirmed via a verification link.
  is_verified: bool;
  created_at: timestamp;
}`}</CodeBlock>

      <h3>Integration with code generators</h3>
      <p>
        One of the primary advantages of doc comments is that they are copied directly into the generated code. Developers using IDEs like VSCode or IntelliJ will see your documentation in hover information, code completion, and inlay hints.
      </p>
    </Prose>
  )
}
