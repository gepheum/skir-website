import { CodeBlock, Prose } from '@/components/prose'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const metadata = {
  title: 'Serialization Formats - Skir',
  description: 'Learn about JSON and binary serialization formats in Skir.',
}

export default function SerializationPage() {
  return (
    <Prose>
      <h1>Serialization</h1>

      <h2>Serialization formats</h2>
      <p>When serializing a data structure, you can choose one of 3 formats.</p>

      <div className="my-6 not-prose">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Format</TableHead>
              <TableHead className="w-[160px]">Persistence</TableHead>
              <TableHead className="w-[140px]">Space efficiency</TableHead>
              <TableHead className="w-[120px]">Readability</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-medium">JSON (Dense)</TableCell>
              <TableCell className="font-medium">Safe</TableCell>
              <TableCell>High</TableCell>
              <TableCell>Mediocre</TableCell>
              <TableCell className="whitespace-normal">
                Default choice. Safe for persistence and offers a good balance between performance
                and debuggability.
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-medium">JSON (Readable)</TableCell>
              <TableCell className="font-medium">Unsafe</TableCell>
              <TableCell>Low</TableCell>
              <TableCell>High</TableCell>
              <TableCell className="whitespace-normal">
                Good for debugging. <strong>Do not</strong> use for persistence: schema evolution
                (e.g. renaming fields) will break compatibility with old data.
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-medium">Binary</TableCell>
              <TableCell className="font-medium">Safe</TableCell>
              <TableCell>Very High</TableCell>
              <TableCell>None</TableCell>
              <TableCell className="whitespace-normal">
                Most compact, fastest in languages like C++.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <h3>JSON, dense flavor</h3>
      <p>This is the serialization format you should choose in most cases.</p>
      <p>
        Structs are serialized as JSON arrays, where the field numbers in the index definition match
        the indexes in the array. Enum constants are serialized as numbers.
      </p>
      <CodeBlock language="skir">{`struct User {
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
      <p>
        The dense JSON representation of <code>JOHN_DOE</code> is:
      </p>
      <CodeBlock language="json">{`[400,0,"John Doe",7,[["Fluffy"],["Fido"]]]`}</CodeBlock>
      <p>A couple observations:</p>
      <ul>
        <li>Removed fields are replaced with zeros</li>
        <li>
          Trailing fields with default values (<code>nickname</code> in this example) are omitted
        </li>
      </ul>
      <p>
        This format is not very readable, but it's compact and it allows you to rename fields in
        your struct definition without breaking backward compatibility.
      </p>

      <h4>Serialization rules</h4>

      <div className="my-6 not-prose">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Type</TableHead>
              <TableHead>Rule</TableHead>
              <TableHead className="w-[250px]">Examples</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">bool</TableCell>
              <TableCell className="whitespace-normal">
                <code>1</code> for true, <code>0</code> for false.
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>1</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">int32</TableCell>
              <TableCell className="whitespace-normal">A JSON number.</TableCell>
              <TableCell className="font-mono text-xs">1234</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">int64</TableCell>
              <TableCell className="whitespace-normal">
                If the value is within the safe integer range for JavaScript
                (±9,007,199,254,740,991), it is serialized as a JSON number. Otherwise, it is
                serialized as a string.
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>1234</div>
                <div>"9007199254740992"</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">
                <div>float32</div>
                <div>float64</div>
              </TableCell>
              <TableCell className="whitespace-normal">
                Finite numbers are serialized as JSON numbers.
                <br />
                <code>NaN</code>, <code>Infinity</code>, and <code>-Infinity</code> are serialized
                as strings.
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>1.23</div>
                <div>"NaN"</div>
                <div>"Infinity"</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">timestamp</TableCell>
              <TableCell className="whitespace-normal">
                A JSON number representing milliseconds since the Unix epoch.
              </TableCell>
              <TableCell className="font-mono text-xs">1672531200000</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">string</TableCell>
              <TableCell className="whitespace-normal">A JSON string.</TableCell>
              <TableCell className="font-mono text-xs">"Hello"</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">bytes</TableCell>
              <TableCell className="whitespace-normal">A Base64 string.</TableCell>
              <TableCell className="font-mono text-xs">"SGVsbG8="</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">T?</TableCell>
              <TableCell className="whitespace-normal">
                <code>null</code> if the value is missing, otherwise the serialized value.
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>null</div>
                <div>123</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">[T]</TableCell>
              <TableCell className="whitespace-normal">A JSON array.</TableCell>
              <TableCell className="font-mono text-xs">[1, 2, 3]</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">struct</TableCell>
              <TableCell className="whitespace-normal">
                A JSON array. The array index corresponds to the field number. Removed fields are
                represented as <code>0</code>. Trailing default values are omitted.
              </TableCell>
              <TableCell className="font-mono text-xs">[400, 0, "John"]</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">enum</TableCell>
              <TableCell className="whitespace-normal">
                Constant variants are serialized as integers. Wrapper variants are serialized as
                arrays with two elements: the variant number, the value.
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>1</div>
                <div>[2, "value"]</div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <h3>JSON, readable flavor</h3>
      <p>Structs are serialized as JSON objects, and enum constants are serialized as strings.</p>
      <p>
        The readable JSON representation of <code>JOHN_DOE</code> is:
      </p>
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
        This format is more verbose and readable, but it should <strong>not</strong> be used if you
        need persistence, because Skir allows fields to be renamed in record definitions. In other
        words, never store a readable JSON on disk or in a database.
      </p>

      <h4>Serialization rules</h4>

      <div className="my-6 not-prose">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Type</TableHead>
              <TableHead>Rule</TableHead>
              <TableHead className="w-[250px]">Examples</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">bool</TableCell>
              <TableCell className="whitespace-normal">
                <code>true</code> or <code>false</code>.
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>true</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">int32</TableCell>
              <TableCell className="whitespace-normal">A JSON number.</TableCell>
              <TableCell className="font-mono text-xs">1234</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">int64</TableCell>
              <TableCell className="whitespace-normal">
                If the value is within the safe integer range for JavaScript
                (±9,007,199,254,740,991), it is serialized as a JSON number. Otherwise, it is
                serialized as a string.
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>1234</div>
                <div>"9007199254740992"</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">
                <div>float32</div>
                <div>float64</div>
              </TableCell>
              <TableCell className="whitespace-normal">
                Finite numbers are serialized as JSON numbers.
                <br />
                <code>NaN</code>, <code>Infinity</code>, and <code>-Infinity</code> are serialized
                as strings.
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>1.23</div>
                <div>"NaN"</div>
                <div>"Infinity"</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">timestamp</TableCell>
              <TableCell className="whitespace-normal">
                An object with <code>unix_millis</code> and <code>formatted</code> fields.
              </TableCell>
              <TableCell className="font-mono text-xs">
                {`{ "unix_millis": 1672531200000, "formatted": "2023-01-01T00:00:00Z" }`}
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">string</TableCell>
              <TableCell className="whitespace-normal">A JSON string.</TableCell>
              <TableCell className="font-mono text-xs">"Hello"</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">bytes</TableCell>
              <TableCell className="whitespace-normal">
                The string "hex:" followed by the hexadecimal representation.
              </TableCell>
              <TableCell className="font-mono text-xs">"hex:48656c6c6f"</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">T?</TableCell>
              <TableCell className="whitespace-normal">
                <code>null</code> if the value is missing, otherwise the serialized value.
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>null</div>
                <div>123</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">[T]</TableCell>
              <TableCell className="whitespace-normal">A JSON array.</TableCell>
              <TableCell className="font-mono text-xs">[1, 2, 3]</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">struct</TableCell>
              <TableCell className="whitespace-normal">
                A JSON object containing field names and values. Default values are omitted.
              </TableCell>
              <TableCell className="font-mono text-xs">{`{ "name": "John", "age": 30 }`}</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">enum</TableCell>
              <TableCell className="whitespace-normal">
                Constant variants are serialized as strings. Wrapper variants are serialized as
                objects with <code>kind</code> and <code>value</code> fields.
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>"RED"</div>
                <div>{`{ "kind": "rgb", "value": "ff0000" }`}</div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <h3>Binary format</h3>
      <p>
        This format is a bit more compact than JSON, and serialization/deserialization can be faster
        in languages like C++. Only prefer this format over JSON when the small performance gain is
        likely to matter, which should be rare.
      </p>

      <h4>Serialization rules</h4>
      <p>
        Similar to dense JSON, zeros are used to represent <code>removed</code> fields.
      </p>

      <div className="my-6 not-prose">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Type</TableHead>
              <TableHead>Rule</TableHead>
              <TableHead className="w-[250px]">Examples</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">bool</TableCell>
              <TableCell className="whitespace-normal">
                A single byte: <code>1</code> for true, <code>0</code> for false.
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>0x01</div>
                <div>0x00</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">int32</TableCell>
              <TableCell className="whitespace-normal">
                Variable-length encoding (varint) with zig-zag encoding for signed integers.
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>0 -&gt; 0x00</div>
                <div>-1 -&gt; 0x01</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">int64</TableCell>
              <TableCell className="whitespace-normal">
                Similar to int32, using variable-length encoding.
              </TableCell>
              <TableCell className="font-mono text-xs">-</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">float32</TableCell>
              <TableCell className="whitespace-normal">
                <code>0</code> is encoded as a single byte <code>0x00</code>. Otherwise, encoded as{' '}
                <code>0xf0</code> followed by the 4 bytes of IEEE 754 representation (little
                endian).
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>0.0 -&gt; 0x00</div>
                <div>1.5 -&gt; 0xf0 00 00 c0 3f</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">float64</TableCell>
              <TableCell className="whitespace-normal">
                <code>0</code> is encoded as a single byte <code>0x00</code>. Otherwise, encoded as{' '}
                <code>0xf1</code> followed by the 8 bytes of IEEE 754 representation (little
                endian).
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>0.0 -&gt; 0x00</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">timestamp</TableCell>
              <TableCell className="whitespace-normal">
                <code>0</code> (Epoch) is encoded as a single byte <code>0x00</code>. Otherwise,
                encoded as <code>0xf2</code> followed by the 8 bytes (int64) of the timestamp
                millis.
              </TableCell>
              <TableCell className="font-mono text-xs">-</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">string</TableCell>
              <TableCell className="whitespace-normal">
                Varint length prefix followed by UTF-8 bytes.
              </TableCell>
              <TableCell className="font-mono text-xs">"Hi" -&gt; 0x02 0x48 0x69</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">bytes</TableCell>
              <TableCell className="whitespace-normal">
                Varint length prefix followed by raw bytes.
              </TableCell>
              <TableCell className="font-mono text-xs">-</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">T?</TableCell>
              <TableCell className="whitespace-normal">
                A special byte <code>0x00</code> for null. Otherwise <code>0x01</code> followed by
                value.
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>null -&gt; 0x00</div>
                <div>val -&gt; 0x01 ...</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">[T]</TableCell>
              <TableCell className="whitespace-normal">
                Varint length prefix followed by items sequentially.
              </TableCell>
              <TableCell className="font-mono text-xs">[1, 2] -&gt; 0x02 ... ...</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">struct</TableCell>
              <TableCell className="whitespace-normal">
                Encoded similarly to an array, with fields written in order. Removed fields are
                written as zero-value for their type.
              </TableCell>
              <TableCell className="font-mono text-xs">-</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">enum</TableCell>
              <TableCell className="whitespace-normal">
                Variant number (varint) followed by the value (if wrapper variant).
              </TableCell>
              <TableCell className="font-mono text-xs">-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <h2>Deserialization</h2>

      <h3>JSON flavors</h3>
      <p>
        When Skir <em>deserializes</em> JSON, it knows how to handle both dense and readable flavor.
        You do not need to specify which flavor is being used.
      </p>

      <h3>Handling of zeros</h3>
      <p>
        Both the dense JSON and binary formats use zeros to represent <code>removed</code> fields to
        save space. To preserve forward compatibility, "zero" is treated as a valid input for any
        type, even non-numerical ones.
      </p>
      <p>
        With the exception of optional types (<code>T?</code>), all types will decode a "zero" value
        (integer 0) as the default value for that type. For example, a <code>string</code> decodes 0
        as <code>""</code>, and an array decodes 0 as <code>[]</code>. For optional types, 0 is
        decoded as the default value of the underlying type (e.g. <code>string?</code> decodes 0 as{' '}
        <code>""</code>, not <code>null</code>).
      </p>
    </Prose>
  )
}
