import { Prose, CodeBlock, Note } from "@/components/prose"

export const metadata = {
  title: "Serialization Formats - Skir",
  description: "Learn about JSON and binary serialization formats in Skir.",
}

export default function SerializationPage() {
  return (
    <Prose>
      <h1>Serialization</h1>

      <h2>Serialization formats</h2>
      <p>When serializing a data structure, you can choose one of 3 formats.</p>

      <h3>JSON, dense flavor</h3>
      <p>This is the serialization format you should choose in most cases.</p>
      <p>
        Structs are serialized as JSON arrays, where the field numbers in the index definition match the indexes in the array. Enum constants are serialized as numbers.
      </p>
      <CodeBlock language="d">{`struct User {
  user_id: int32;
  removed;
  name: string;
  rest_day: Weekday;
  pets: [Pet];
  nickname: string;
}

const JOHN_DOE: User = {
  user_id = 400,
  name = "John Doe",
  rest_day = "SUNDAY",
  pets = [
    { name = "Fluffy" },
    { name = "Fido" },
  ],
  nickname = "",
}`}</CodeBlock>
      <p>The dense JSON representation of <code>JOHN_DOE</code> is:</p>
      <CodeBlock language="json">{`[400,0,"John Doe",7,[["Fluffy"],["Fido"]]]`}</CodeBlock>
      <p>A couple observations:</p>
      <ul>
        <li>Removed fields are replaced with zeros</li>
        <li>Trailing fields with default values (<code>nickname</code> in this example) are omitted</li>
      </ul>
      <p>
        This format is not very readable, but it's compact and it allows you to rename fields in your struct definition without breaking backward compatibility.
      </p>

      <h3>JSON, readable flavor</h3>
      <p>Structs are serialized as JSON objects, and enum constants are serialized as strings.</p>
      <p>The readable JSON representation of <code>JOHN_DOE</code> is:</p>
      <CodeBlock language="json">{`{
  "user_id": 400,
  "name": "John Doe",
  "rest_day": "SUNDAY",
  "pets": [
    { "name": "Fluffy" },
    { "name": "Fido" }
  ]
}`}</CodeBlock>
      <p>
        This format is more verbose and readable, but it should <strong>not</strong> be used if you need persistence, because Skir allows fields to be renamed in record definitions. In other words, never store a readable JSON on disk or in a database.
      </p>
      <Note type="info">
        <p>
          When Skir <em>deserializes</em> JSON, it knows how to handle both dense and readable flavor. It's only when <em>serializing</em> JSON that a flavor must be specified.
        </p>
      </Note>

      <h3>Binary format</h3>
      <p>
        This format is a bit more compact than JSON, and serialization/deserialization can be faster in languages like C++. Only prefer this format over JSON when the small performance gain is likely to matter, which should be rare.
      </p>

      <h2>Implementation details</h2>
      <p>
        This section describes precisely how each data type is serialized to each of the 3 formats. This information is intended for advanced users who want to understand the inner workings of Skir, or for developers who want to implement a Skir generator for a new programming language.
      </p>

      <h3>Handling of zeros</h3>
      <p>
        Since the dense JSON and binary format use zeros to represent <code>removed</code> fields, in order to preserve forward compatibility, zero is a valid input for any type even non-numerical types. With the exception of the optional type, all types will decode "zero" as the default value for the type (e.g. an empty array). The optional type will decode zero as the default value of the underlying type.
      </p>

      <h3>Primitives</h3>

      <h4>Bool</h4>
      <ul>
        <li><strong>JSON (Readable)</strong>: <code>true</code> or <code>false</code>.</li>
        <li><strong>JSON (Dense)</strong>: <code>1</code> for true, <code>0</code> for false.</li>
        <li><strong>Binary</strong>: A single byte: <code>1</code> for true, <code>0</code> for false.</li>
      </ul>

      <h4>Int32</h4>
      <ul>
        <li><strong>JSON</strong>: A JSON number.</li>
        <li><strong>Binary</strong>: Variable-length encoding with special bytes for ranges.</li>
      </ul>

      <h4>Int64</h4>
      <ul>
        <li><strong>JSON</strong>: If the value is within the safe integer range for JavaScript (±9,007,199,254,740,991), it is serialized as a JSON number. Otherwise, it is serialized as a string.</li>
        <li><strong>Binary</strong>: If the value fits in an <code>int32</code>, it uses the <code>int32</code> encoding. Otherwise, it uses a full 8-byte encoding.</li>
      </ul>

      <h4>Float32 and Float64</h4>
      <ul>
        <li><strong>JSON</strong>: Finite numbers are serialized as JSON numbers. <code>NaN</code>, <code>Infinity</code>, and <code>-Infinity</code> are serialized as strings: <code>"NaN"</code>, <code>"Infinity"</code>, <code>"-Infinity"</code>.</li>
        <li><strong>Binary</strong>: <code>0</code> is encoded as a single byte. Otherwise, the full IEEE 754 representation is used.</li>
      </ul>

      <h4>Timestamp</h4>
      <ul>
        <li><strong>JSON (Readable)</strong>: An object with <code>unix_millis</code> and <code>formatted</code> fields.</li>
        <li><strong>JSON (Dense)</strong>: A JSON number representing milliseconds since the Unix epoch.</li>
        <li><strong>Binary</strong>: <code>0</code> (Epoch) is encoded as a single byte. Otherwise, a full 8-byte encoding.</li>
      </ul>

      <h4>String</h4>
      <ul>
        <li><strong>JSON</strong>: A JSON string.</li>
        <li><strong>Binary</strong>: Length-prefixed UTF-8 bytes.</li>
      </ul>

      <h4>Bytes</h4>
      <ul>
        <li><strong>JSON (Readable)</strong>: The string "hex:" followed by the hexadecimal representation.</li>
        <li><strong>JSON (Dense)</strong>: A Base64 string.</li>
        <li><strong>Binary</strong>: Length-prefixed raw bytes.</li>
      </ul>

      <h3>Complex Types</h3>

      <h4>Optional</h4>
      <ul>
        <li><strong>JSON</strong>: <code>null</code> if the value is missing, otherwise the serialized value.</li>
        <li><strong>Binary</strong>: A special byte for <code>null</code>, or the serialized value directly.</li>
      </ul>

      <h4>Array</h4>
      <ul>
        <li><strong>JSON</strong>: A JSON array.</li>
        <li><strong>Binary</strong>: Length-prefixed with items following immediately.</li>
      </ul>

      <h4>Struct</h4>
      <ul>
        <li><strong>JSON (Readable)</strong>: A JSON object containing field names and values. Default values are omitted.</li>
        <li><strong>JSON (Dense)</strong>: A JSON array. The array index corresponds to the field number. Removed fields are represented as <code>0</code>. Trailing default values are omitted.</li>
        <li><strong>Binary</strong>: Encoded similarly to an array, with fields written in order.</li>
      </ul>

      <h4>Enum</h4>
      <ul>
        <li><strong>JSON (Readable)</strong>: Constant variants are serialized as strings. Wrapper variants are serialized as objects with <code>kind</code> and <code>value</code> fields.</li>
        <li><strong>JSON (Dense)</strong>: Constant variants are serialized as integers. Wrapper variants are serialized as arrays <code>[variant_number, value]</code>.</li>
        <li><strong>Binary</strong>: Variant number followed by the value (if wrapper variant).</li>
      </ul>
    </Prose>
  )
}
