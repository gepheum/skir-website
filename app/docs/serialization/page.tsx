import { NextPageLink } from '@/components/next-page-link'
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
      <p>
        Skir defines a standard for serializing and deserializing data types to JSON and binary. The
        generated data classes implement this standard to ensure that data structures defined in
        your schema can be encoded and decoded consistently across all languages.
      </p>

      <h2>Serialization formats</h2>
      <p>When serializing a data structure, you can choose one of 3 formats:</p>

      <div className="my-6 not-prose">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Format</TableHead>
              <TableHead className="w-[160px]">Persistable</TableHead>
              <TableHead className="w-[140px]">Space efficiency</TableHead>
              <TableHead className="w-[120px]">Readability</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-medium">JSON (Dense)</TableCell>
              <TableCell>Yes (safe)</TableCell>
              <TableCell>High</TableCell>
              <TableCell>Low</TableCell>
              <TableCell className="whitespace-normal">
                Default choice. Safe for persistence and offers a good balance between performance
                and debuggability.
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-medium">JSON (Readable)</TableCell>
              <TableCell>No (unsafe)</TableCell>
              <TableCell>Low</TableCell>
              <TableCell>High</TableCell>
              <TableCell className="whitespace-normal">
                Good for debugging. <strong>Do not</strong> use for persistence: schema evolution
                (e.g. renaming fields) will break compatibility with old data.
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-medium">Binary</TableCell>
              <TableCell>Yes (safe)</TableCell>
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

      <h4>Encoding rules</h4>

      <div className="my-6 not-prose">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Type</TableHead>
              <TableHead>Encoded as</TableHead>
              <TableHead className="w-[250px]">Examples</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">bool</TableCell>
              <TableCell className="whitespace-normal">
                <code>1</code> for true, <code>0</code> for false
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>1</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">int32</TableCell>
              <TableCell className="whitespace-normal">A JSON number</TableCell>
              <TableCell className="font-mono text-xs">1234</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">
                <div>int64</div>
                <div>hash64</div>
              </TableCell>
              <TableCell className="whitespace-normal">
                <ul className="!list-none !pl-0 !m-0 !text-foreground !space-y-0.5 [&_li]:!leading-snug">
                  <li>
                    If the value is within the safe integer range for JavaScript
                    (±9,007,199,254,740,991), it is serialized as a JSON number.
                  </li>
                  <li>Otherwise, it is serialized as a string.</li>
                </ul>
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
                <ul className="!list-none !pl-0 !m-0 !text-foreground !space-y-0.5 [&_li]:!leading-snug">
                  <li>Finite numbers are serialized as JSON numbers.</li>
                  <li>
                    <code>NaN</code>, <code>Infinity</code>, and <code>-Infinity</code> are
                    serialized as strings.
                  </li>
                </ul>
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>1.23</div>
                <div>"Infinity"</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">timestamp</TableCell>
              <TableCell className="whitespace-normal">
                A JSON number representing milliseconds since the Unix epoch
              </TableCell>
              <TableCell className="font-mono text-xs">1672531200000</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">string</TableCell>
              <TableCell className="whitespace-normal">A JSON string</TableCell>
              <TableCell className="font-mono text-xs">"Hello"</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">bytes</TableCell>
              <TableCell className="whitespace-normal">A Base64 string</TableCell>
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
              <TableCell className="whitespace-normal">A JSON array</TableCell>
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
                <ul className="!list-none !pl-0 !m-0 !text-foreground !space-y-0.5 [&_li]:!leading-snug">
                  <li>Constant variants are serialized as integers.</li>
                  <li>
                    Wrapper variants are serialized as arrays with two elements: the variant number,
                    the value.
                  </li>
                </ul>
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

      <h4>Encoding rules</h4>

      <div className="my-6 not-prose">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Type</TableHead>
              <TableHead>Encoded as</TableHead>
              <TableHead className="w-[250px]">Examples</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">bool</TableCell>
              <TableCell className="whitespace-normal">
                <code>true</code> or <code>false</code>
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>true</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">int32</TableCell>
              <TableCell className="whitespace-normal">A JSON number</TableCell>
              <TableCell className="font-mono text-xs">1234</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">
                <div>int64</div>
                <div>hash64</div>
              </TableCell>
              <TableCell className="whitespace-normal">
                <ul className="!list-none !pl-0 !m-0 !text-foreground !space-y-0.5 [&_li]:!leading-snug">
                  <li>
                    If the value is within the safe integer range for JavaScript
                    (±9,007,199,254,740,991), it is serialized as a JSON number.
                  </li>
                  <li>Otherwise, it is serialized as a string.</li>
                </ul>
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
                <ul className="!list-none !pl-0 !m-0 !text-foreground !space-y-0.5 [&_li]:!leading-snug">
                  <li>Finite numbers are serialized as JSON numbers.</li>
                  <li>
                    <code>NaN</code>, <code>Infinity</code>, and <code>-Infinity</code> are
                    serialized as strings.
                  </li>
                </ul>
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>1.23</div>
                <div>"Infinity"</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">timestamp</TableCell>
              <TableCell className="whitespace-normal">
                An object with <code>unix_millis</code> and <code>formatted</code> fields
              </TableCell>
              <TableCell className="font-mono text-xs">
                {`{ "unix_millis": 1672531200000, "formatted": "2023-01-01T00:00:00Z" }`}
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">string</TableCell>
              <TableCell className="whitespace-normal">A JSON string</TableCell>
              <TableCell className="font-mono text-xs">"Hello"</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">bytes</TableCell>
              <TableCell className="whitespace-normal">
                The string "hex:" followed by the hexadecimal representation
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
              <TableCell className="whitespace-normal">A JSON array</TableCell>
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
                <ul className="!list-none !pl-0 !m-0 !text-foreground !space-y-0.5 [&_li]:!leading-snug">
                  <li>Constant variants are serialized as strings.</li>
                  <li>
                    Wrapper variants are serialized as objects with <code>kind</code> and{' '}
                    <code>value</code> fields.
                  </li>
                </ul>
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

      <h4>Encoding rules</h4>
      <p>All numeric values are encoded using little-endian byte order.</p>

      <div className="my-6 not-prose">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Type</TableHead>
              <TableHead>Encoded as</TableHead>
              <TableHead className="w-[250px]">Examples</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">bool</TableCell>
              <TableCell className="whitespace-normal">
                <code>1</code> for true, <code>0</code> for false
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>0x01</div>
                <div>0x00</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">int32</TableCell>
              <TableCell className="whitespace-normal">
                <ul className="!list-none !pl-0 !m-0 !text-foreground !space-y-0.5 [&_li]:!leading-snug">
                  <li>
                    0-231: single byte <code>val</code>
                  </li>
                  <li>
                    232-65535: <code>0xe8</code> followed by <code>uint16(val)</code>
                  </li>
                  <li>
                    &ge; 65536: <code>0xe9</code> followed by <code>uint32(val)</code>
                  </li>
                  <li>
                    -256 to -1: <code>0xeb</code> followed by <code>uint8(val + 256)</code>
                  </li>
                  <li>
                    -65536 to -257: <code>0xec</code> followed by <code>uint16(val + 65536)</code>
                  </li>
                  <li>
                    &le; -65537: <code>0xed</code> followed by <code>int32(val)</code>
                  </li>
                </ul>
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>10 -&gt; 0x0a</div>
                <div>255 -&gt; 0xe8 0xff 0x00</div>
                <div>-1 -&gt; 0xeb 0xff</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">int64</TableCell>
              <TableCell className="whitespace-normal">
                <ul className="!list-none !pl-0 !m-0 !text-foreground !space-y-0.5 [&_li]:!leading-snug">
                  <li>
                    If the value fits in a 32-bit signed integer, uses the <code>int32</code>{' '}
                    encoding.
                  </li>
                  <li>
                    Otherwise: marker <code>0xee</code> followed by 8 bytes (int64).
                  </li>
                </ul>
              </TableCell>
              <TableCell className="font-mono text-xs"></TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">hash64</TableCell>
              <TableCell className="whitespace-normal">
                <ul className="!list-none !pl-0 !m-0 !text-foreground !space-y-0.5 [&_li]:!leading-snug">
                  <li>
                    If the value fits in a 32-bit unsigned integer, uses the <code>int32</code>{' '}
                    encoding.
                  </li>
                  <li>
                    Otherwise: marker <code>0xea</code> followed by 8 bytes (uint64).
                  </li>
                </ul>
              </TableCell>
              <TableCell className="font-mono text-xs"></TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">float32</TableCell>
              <TableCell className="whitespace-normal">
                <ul className="!list-none !pl-0 !m-0 !text-foreground !space-y-0.5 [&_li]:!leading-snug">
                  <li>
                    0 is encoded as a single byte <code>0x00</code>.
                  </li>
                  <li>
                    Otherwise: marker <code>0xf0</code> followed by 4 bytes (IEEE 754, little
                    endian).
                  </li>
                </ul>
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>0.0 -&gt; 0x00</div>
                <div>1.5 -&gt; 0xf0 00 00 c0 3f</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">float64</TableCell>
              <TableCell className="whitespace-normal">
                <ul className="!list-none !pl-0 !m-0 !text-foreground !space-y-0.5 [&_li]:!leading-snug">
                  <li>
                    0 is encoded as a single byte <code>0x00</code>.
                  </li>
                  <li>
                    Otherwise: marker <code>0xf1</code> followed by 8 bytes (IEEE 754, little
                    endian).
                  </li>
                </ul>
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>0.0 -&gt; 0x00</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">timestamp</TableCell>
              <TableCell className="whitespace-normal">
                <ul className="!list-none !pl-0 !m-0 !text-foreground !space-y-0.5 [&_li]:!leading-snug">
                  <li>
                    0 (Epoch) is encoded as a single byte <code>0x00</code>.
                  </li>
                  <li>
                    Otherwise: marker <code>0xef</code> followed by 8 bytes (int64 millis).
                  </li>
                </ul>
              </TableCell>
              <TableCell className="font-mono text-xs"></TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">string</TableCell>
              <TableCell className="whitespace-normal">
                <ul className="!list-none !pl-0 !m-0 !text-foreground !space-y-0.5 [&_li]:!leading-snug">
                  <li>
                    Empty string: <code>0xf2</code>.
                  </li>
                  <li>
                    Non-empty: marker <code>0xf3</code>, followed by length (encoded as a number),
                    followed by UTF-8 bytes.
                  </li>
                </ul>
              </TableCell>
              <TableCell className="font-mono text-xs">"Hi" -&gt; 0xf3 0x02 0x48 0x69</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">bytes</TableCell>
              <TableCell className="whitespace-normal">
                <ul className="!list-none !pl-0 !m-0 !text-foreground !space-y-0.5 [&_li]:!leading-snug">
                  <li>
                    Empty: <code>0xf4</code>.
                  </li>
                  <li>
                    Non-empty: marker <code>0xf5</code>, followed by length (encoded as a number),
                    followed by raw bytes.
                  </li>
                </ul>
              </TableCell>
              <TableCell className="font-mono text-xs"></TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">T?</TableCell>
              <TableCell className="whitespace-normal">
                <ul className="!list-none !pl-0 !m-0 !text-foreground !space-y-0.5 [&_li]:!leading-snug">
                  <li>
                    <code>null</code> is encoded as <code>0xff</code>.
                  </li>
                  <li>Otherwise, the value is encoded directly.</li>
                </ul>
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div>null -&gt; 0xff</div>
                <div>val -&gt; val_bytes</div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">[T]</TableCell>
              <TableCell className="whitespace-normal">
                <ul className="!list-none !pl-0 !m-0 !text-foreground !space-y-0.5 [&_li]:!leading-snug">
                  <li>
                    Length 0-3: markers <code>0xf6</code>-<code>0xf9</code>.
                  </li>
                  <li>
                    Length &gt; 3: marker <code>0xfa</code> followed by length (encoded as a
                    number).
                  </li>
                  <li>Then items are written sequentially.</li>
                </ul>
              </TableCell>
              <TableCell className="font-mono text-xs">[1, 2] -&gt; 0xf8 ... ...</TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">struct</TableCell>
              <TableCell className="whitespace-normal">
                Same encoding as an array. The array index corresponds to the field number. Removed
                fields are represented as <code>0</code>. Trailing default values are omitted.
              </TableCell>
              <TableCell className="font-mono text-xs"></TableCell>
            </TableRow>
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell className="font-mono">enum</TableCell>
              <TableCell className="whitespace-normal">
                <ul className="!list-none !pl-0 !m-0 !text-foreground !space-y-0.5 [&_li]:!leading-snug">
                  <li>Constant variant: encoded as a number (the variant number).</li>
                  <li>
                    Wrapper variant: markers <code>0xfb</code>-<code>0xfe</code> (for variant
                    numbers 1-4) or <code>0xf8</code> followed by the variant number. Then the
                    value.
                  </li>
                </ul>
              </TableCell>
              <TableCell className="font-mono text-xs"></TableCell>
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
        save space. To preserve forward compatibility, <em>zero</em> is treated as a valid input for
        any type, even non-numerical ones.
      </p>
      <p>
        With the exception of optional types (<code>T?</code>), all types will decode a{' '}
        <em>zero</em> value (integer 0) as the default value for that type. For example, a{' '}
        <code>string</code> decodes 0 as <code>""</code>, and an array decodes 0 as <code>[]</code>.
        For optional types, 0 is decoded as the default value of the underlying type (e.g.{' '}
        <code>string?</code> decodes 0 as <code>""</code>, not <code>null</code>).
      </p>

      <NextPageLink title="Schema evolution" href="/docs/schema-evolution" />
    </Prose>
  )
}
