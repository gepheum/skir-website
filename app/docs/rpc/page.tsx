import { CodeBlock, Note, Prose } from '@/components/prose'

export const metadata = {
  title: 'RPC Interfaces - Skir',
  description: 'Build typesafe APIs with Skir services and RPC interfaces.',
}

export default function RpcPage() {
  return (
    <Prose>
      <h1>Skir services</h1>
      <p>
        Skir provides a transport-agnostic RPC (Remote Procedure Call) framework that lets you
        define API methods in your schema and implement them in your preferred programming language.
      </p>
      <p>
        Unlike many RPC frameworks that couple your code to a specific transport protocol or server
        implementation, Skir services are designed to be embedded within your existing application
        stack. You can integrate with:
      </p>
      <ul>
        <li>
          <strong>Java</strong>: Spring Boot
        </li>
        <li>
          <strong>Kotlin</strong>: Ktor
        </li>
        <li>
          <strong>Dart</strong>: Shelf
        </li>
        <li>
          <strong>Python</strong>: FastAPI, Flask, or Starlite
        </li>
        <li>
          <strong>TypeScript</strong>: Express
        </li>
        <li>
          <strong>C++</strong>: httplib
        </li>
      </ul>
      <p>
        Features like authentication, request logging or rate limiting are handled by the underlying
        framework.
      </p>

      <h2>Why use Skir services?</h2>
      <p>
        The primary advantage of using Skir services is <strong>end-to-end type safety</strong>.
      </p>
      <p>
        In a traditional REST API, the contract between client and server is often implicit:{' '}
        <em>
          Send a JSON object with fields <code>x</code> and <code>y</code> to <code>/api/foo</code>,
          and receive a JSON object with field <code>z</code>.
        </em>{' '}
        This contract is fragile; if the server code changes the expected keys but the client isn't
        updated, the API breaks at runtime.
      </p>
      <p>
        Skir enforces this contract at compile time. By defining your methods in a{' '}
        <code>.skir</code> schema, both your server implementation and your client calls are
        generated from the same source of truth. You cannot call a method that doesn't exist, pass
        the wrong arguments, or mishandle the response type without the compiler alerting you
        immediately.
      </p>
      <Note type="info">
        <p>
          Skir solves the same problem as <strong>tRPC</strong>, but it is{' '}
          <strong>language-agnostic</strong>. While tRPC is excellent for full-stack TypeScript
          applications, Skir brings that same level of developer experience and safety to polyglot
          environments (e.g., a TypeScript frontend talking to a Kotlin or Python backend).
        </p>
      </Note>

      <h3>Use cases</h3>
      <p>Skir services are versatile and can be used in two main contexts:</p>
      <ol>
        <li>
          <strong>Microservices</strong>: Similar to gRPC, Skir allows efficiently typed
          communication between backend services.
        </li>
        <li>
          <strong>Browser-to-Backend</strong>: Skir works seamlessly over standard HTTP/JSON, making
          it perfect for connecting a web frontend (React, Vue, etc.) to your backend.
        </li>
      </ol>

      <h2>Defining methods</h2>
      <p>
        In Skir, a service is simply a collection of methods. You define methods in your{' '}
        <code>.skir</code> files using the <code>method</code> keyword.
      </p>
      <CodeBlock language="skir">{`// Defines a method named 'GetUser' which takes a GetUserRequest and returns a GetUserResponse
method GetUser(GetUserRequest): GetUserResponse = 12345;`}</CodeBlock>
      <p>
        A method definition specifies the <strong>request</strong> type, the{' '}
        <strong>response</strong> type, and a stable numeric identifier.
      </p>
      <Note type="info">
        <p>
          Methods are defined globally in your schema. Skir does not group methods into "Service"
          blocks in the <code>.skir</code> file. You decide how to group and implement methods in
          your application code.
        </p>
      </Note>

      <h2>Implementing a service</h2>
      <p>
        <em>
          The examples below use Python, but the concepts apply identically to all supported
          languages.
        </em>
      </p>
      <p>
        Skir provides a <code>Service</code> class in its runtime library for each supported
        language. This class acts as a central dispatcher that handles deserialization, routing, and
        serialization.
      </p>
      <p>
        To create a service, you instantiate the <code>Service</code> class and register your method
        implementations.
      </p>

      <h3>1. The RequestMeta concept</h3>
      <p>
        Skir services are generic over a <code>RequestMeta</code> type. This is a type you define to
        hold context information extracted from the HTTP request, such as authentication tokens,
        user sessions, or client IP addresses. This metadata is passed to your method
        implementations along with the request body.
      </p>
      <CodeBlock language="python">{`from dataclasses import dataclass
import skir

@dataclass
class RequestMeta:
    auth_token: str
    client_ip: str


# Create an async service typed with our metadata class
service = skir.ServiceAsync[RequestMeta]`}</CodeBlock>

      <h3>2. Registering methods</h3>
      <p>
        You link the abstract method definitions generated from your schema to your actual code
        logic.
      </p>
      <CodeBlock language="python">{`from skirout.user import GetUser, GetUserRequest, GetUserResponse

async def get_user(req: GetUserRequest, meta: RequestMeta) -> GetUserResponse:
    # We have type-safe access to both the request fields and our metadata
    print(f"Request from IP: {meta.client_ip}")
    return GetUserResponse(user=await db.get_user(req.user_id))

# Typing error if the signature of get_user does not match GetUser.
service.add_method(GetUser, get_user)`}</CodeBlock>

      <h2>Running the service</h2>
      <p>
        Skir does not start its own HTTP server. Instead, it provides a <code>handle_request</code>{' '}
        method that you call from your existing web server's request handler.
      </p>
      <p>
        This <code>handle_request</code> method takes:
      </p>
      <ol>
        <li>The raw request body (as a string).</li>
        <li>
          Your constructed <code>RequestMeta</code> object.
        </li>
      </ol>
      <p>
        It returns a generated response containing the status code, content type, and body data,
        which you seamlessly write back to your HTTP client.
      </p>
      <p>
        Since Skir manages the request body parsing and routing internally, you typically only need{' '}
        <strong>one HTTP endpoint</strong> (e.g., <code>/api</code>) to serve your entire API.
      </p>
      <CodeBlock language="python" filename="FastAPI example">{`from fastapi import FastAPI, Request
from fastapi.responses import Response

app = FastAPI()


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
    raw_response = await skir_service.handle_request(req_body, req_headers)

    # 4. Map back to framework response
    return Response(
        content=raw_response.data,
        status_code=raw_response.status_code,
        media_type=raw_response.content_type,
    )


def extract_meta_from_request(request: Request) -> RequestMeta:
    ...`}</CodeBlock>

      <h2>Calling a service</h2>

      <h3>Using Skir clients</h3>
      <p>
        Skir generates a type-safe <code>ServiceClient</code> class that abstracts away the network
        layer. This ensures that your client code is always in sync with your API definition.
      </p>
      <CodeBlock language="python">{`from skir import ServiceClient
import aiohttp

# 1. Initialize the client with your service URL
client = ServiceClient("http://localhost:8000/api")

async def main():
    async with aiohttp.ClientSession() as session:
        # 2. Call methods directly using the generated definitions
        response = await client.invoke_remote_async(
            session,
            GetUser,
            GetUserRequest(user_id="u_123"),
            headers={"Authorization": "Bearer token"}
        )

        # 'response' is fully typed as 'GetUserResponse'
        print(response.user.name)`}</CodeBlock>

      <h3>Using cURL</h3>
      <p>
        You can also invoke Skir methods using any HTTP client by sending a POST request with a JSON
        body. The body must follow a specific structure identifying the method and its arguments.
      </p>
      <CodeBlock language="bash">{`curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"method": "GetUser", "request": {"user_id": "u_123"}}' \\
  http://localhost:8000/api`}</CodeBlock>

      <h2>Skir Studio</h2>
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
