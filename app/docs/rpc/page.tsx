import { CodeBlock, Note, Prose } from '@/components/prose'

export const metadata = {
  title: 'Skir Services',
  description: 'Build typesafe APIs with Skir services and.',
}

export default function RpcPage() {
  return (
    <Prose>
      <h1>Skir services</h1>
      <p className="text-xl text-muted-foreground">
        Skir provides a protocol, along with server and client runtime libraries, allowing you to
        issue RPCs with end-to-end type safety.
      </p>
      <p>
        Skir services are versatile: they can be used either for communication between
        microservices, or for communication between a server and a client.
      </p>

      <h2>Core concepts</h2>
      <p>
        Building a Skir service involves three main steps: defining the API schema, implementing the
        server logic, and calling the service.
      </p>

      <h3>API definition</h3>
      <p>
        Everything starts in your <code>.skir</code> schema. You define methods using the{' '}
        <code>method</code> keyword.
      </p>
      <CodeBlock language="skir">{`// calculator.skir

method Square(float32): float32 = 1001;
method SquareRoot(float32): float32 = 1002;`}</CodeBlock>
      <p>
        A method definition specifies the request type (input), the response type (output), and a
        stable numeric identifier.
      </p>
      <p>
        Methods are defined globally in your schema. Skir does not group methods into{' '}
        <em>Service</em> blocks in the <code>.skir</code> file like Protocol Buffer does. You decide
        how to group and implement methods in your application code.
      </p>

      <h3>Implement the service</h3>
      <p>
        The Skir runtime library provides a <code>Service</code> class that handles all the heavy
        lifting: deserializing requests, routing to your code, serializing responses.
      </p>
      <Note type="info">
        <p>
          The examples below use Python, but the concepts apply identically to all supported
          languages.
        </p>
      </Note>

      <h4>Registering methods</h4>
      <p>
        You simply link the abstract method definitions from your schema to your Python functions
        (method implementations) using <code>add_method</code>.
      </p>
      <CodeBlock language="python">{`from skirout.calc import Square, SquareRoot
import math

async def square_impl(val: float, meta: RequestMeta) -> float:
    return val * val

async def sqrt_impl(val: float, meta: RequestMeta) -> float:
    if val < 0:
        raise ValueError("Cannot calculate square root of negative number")
    return math.sqrt(val)

service = skir.ServiceAsync[RequestMeta]
service.add_method(Square, square_impl)
service.add_method(SquareRoot, sqrt_impl)`}</CodeBlock>

      <h4>Request context</h4>
      <p>
        <code>RequestMeta</code> is a custom type you define to pass context (like auth tokens or
        user IDs) from the HTTP layer into your method logic. This context object is passed to every
        method implementation.
      </p>
      <p>
        If you do not need to extract any context from the request, you can simply define an empty
        class.
      </p>
      <CodeBlock language="python">{`from dataclasses import dataclass
import skir

@dataclass
class RequestMeta:
    auth_token: str
    client_ip: str


# Create an async service typed with our metadata class
service = skir.ServiceAsync[RequestMeta]`}</CodeBlock>

      <h3>Running the service</h3>
      <p>
        Skir does not start its own HTTP server. Instead, it provides a <code>handle_request</code>{' '}
        method that you call from your existing framework's request handler (FastAPI, Flask,
        Express, etc.).
      </p>
      <p>
        This allows you to leverage your framework's existing middleware for logging, auth, and rate
        limiting.
      </p>
      <CodeBlock language="python" filename="FastAPI example">{`from fastapi import FastAPI, Request
from fastapi.responses import Response
from .my_skir_service import service, RequestMeta

app = FastAPI()


# Mount the Skir service into this FastAPI app
@app.api_route("/myapi", methods=["GET", "POST"])
async def myapi(request: Request):
    # 1. Read body
    if request.method == "POST":
        req_body = (await request.body()).decode("utf-8")
    else:
        req_body = urllib.parse.unquote(
            request.url.query.encode("utf-8").decode("utf-8")
        )

    # 2. Build metadata from framework-specific request object
    req_meta = extract_meta_from_request(request)

    # 3. Delegate to Skir
    raw_response = await service.handle_request(req_body, req_meta)

    # 4. Map back to framework response
    return Response(
        content=raw_response.data,
        status_code=raw_response.status_code,
        media_type=raw_response.content_type,
    )


def extract_meta_from_request(request: Request) -> RequestMeta:
    ...`}</CodeBlock>

      <h3>Call the service</h3>

      <h4>Using Skir clients</h4>
      <p>Here is how you call a Skir service directly from your application code.</p>
      <p>
        The Skir runtime library provides a <code>ServiceClient</code> class. You point it at your
        server URL, and use it to invoke your generated API methods.
      </p>
      <CodeBlock language="python">{`from skir import ServiceClient
import aiohttp
from skirout.calc import Square

# Initialize the client with your service URL
client = ServiceClient("http://localhost:8000/api")

async def main():
    async with aiohttp.ClientSession() as session:
        # Call methods directly using the generated definitions
        response = await client.invoke_remote_async(
            session,
            Square,
            5.0,
            headers={"Authorization": "Bearer token"}
        )

        print(response) # 25.0`}</CodeBlock>

      <h2>Why use Skir services?</h2>
      <p>
        In a traditional REST API, the contract between client and server is implicit and fragile.
        If the server changes an endpoint but the client isn't updated, things break at runtime.
      </p>
      <p>
        Skir enforces this contract at compile time. Both your server implementation and your client
        calls are generated from the same source of truth. You cannot call a method that doesn't
        exist or pass wrong arguments without the compiler alerting you.
      </p>

      <h3>Versus traditional REST APIs</h3>
      <div className="my-6 w-full overflow-y-auto">
        <table className="w-full border-collapse border border-border text-sm">
          <thead>
            <tr className="bg-secondary/50">
              <th className="border-b border-border p-4 text-left font-medium">Feature</th>
              <th className="border-b border-border p-4 text-left font-medium">
                Traditional API (REST)
              </th>
              <th className="border-b border-border p-4 text-left font-medium">
                Skir Service (RPC)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border transition-colors hover:bg-muted/50">
              <td className="p-4 font-medium">Endpoint</td>
              <td className="p-4 text-muted-foreground">
                Resource-based (e.g. <code>/users/123</code>)
              </td>
              <td className="p-4 text-muted-foreground">
                Single URL (e.g. <code>/api</code>)
              </td>
            </tr>
            <tr className="border-b border-border transition-colors hover:bg-muted/50">
              <td className="p-4 font-medium">Operations</td>
              <td className="p-4 text-muted-foreground">
                Endpoint + HTTP Verb (e.g. <code>GET /users/123</code>)
              </td>
              <td className="p-4 text-muted-foreground">
                Schema methods (e.g. <code>GetUser</code>)
              </td>
            </tr>
            <tr className="border-b border-border transition-colors hover:bg-muted/50">
              <td className="p-4 font-medium">Input</td>
              <td className="p-4 text-muted-foreground">Path params, query params, JSON body</td>
              <td className="p-4 text-muted-foreground">Strongly-typed request</td>
            </tr>
            <tr className="border-b border-border transition-colors hover:bg-muted/50">
              <td className="p-4 font-medium">Output</td>
              <td className="p-4 text-muted-foreground">JSON with implicit structure</td>
              <td className="p-4 text-muted-foreground">Strongly-typed response</td>
            </tr>
            <tr className="transition-colors hover:bg-muted/50">
              <td className="p-4 font-medium">Client</td>
              <td className="p-4 text-muted-foreground">Manual fetch/axios calls</td>
              <td className="p-4 text-muted-foreground">
                Typesafe, handles serialization and transport
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Note type="info">
        <p>
          Skir solves the same problem as <strong>tRPC</strong>, but it is{' '}
          <strong>language-agnostic</strong>. While tRPC is excellent for full-stack TypeScript
          applications, Skir brings that same level of developer experience and safety to polyglot
          environments (e.g., a TypeScript frontend talking to a Kotlin or Python backend).
        </p>
      </Note>

      <h2>Debugging</h2>

      <h3>Using cURL</h3>
      <p>
        Since Skir runs over standard HTTP, you can also inspect or call it manually. Requests are
        just POSTs with a JSON body specifying the method name and arguments.
      </p>
      <CodeBlock language="bash">{`curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"method": "Square", "request": 5.0}' \\
  http://localhost:8000/api`}</CodeBlock>

      <h3>Skir Studio</h3>
      <p>
        Every Skir service comes with a built-in interactive documentation and testing tool called{' '}
        <strong>Skir Studio</strong>.
      </p>
      <p>
        To access it, simply visit your API endpoint in a browser with the <code>?studio</code>{' '}
        query parameter (e.g., <code>http://localhost:8000/api?studio</code>). Skir serves a
        lightweight HTML page that inspects your service, lists all available methods, and provides
        auto-generated forms to send test requests and view responses.
      </p>
      <Note type="tip">
        <p>
          If you are familiar with <strong>Swagger UI</strong> (common in the FastAPI ecosystem),
          Skir Studio fills the same role. It provides a dedicated, auto-generated web interface to
          explore your API schema and execute requests interactively.
        </p>
      </Note>
    </Prose>
  )
}
