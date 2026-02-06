import { SplitCodeExample } from '@/components/split-code-example'

const skirCode = `struct WhatToWearRequest {
  temperature_celsius: float32;
  raining: bool;
}

struct WhatToWearResponse {
  bottom_outfit: string;
  sunglasses: bool;
}

method WhatToWear(WhatToWearRequest):
    WhatToWearResponse  = 770862;`

const codeExamples = {
  typescript: `import { ServiceClient } from "skir-client";
import { WhatToWear, WhatToWearRequest }
    from "../skirout/outfit_picker";

const client = new ServiceClient("http://localhost:8080/api");

const response = await client.invokeRemote(
  WhatToWear,
  WhatToWearRequest.create({
    temperatureCelsius: 25,
    raining: false,
  })
);

if (response.sunglasses) {
  console.log("Don't forget your sunglasses 😎");
}`,

  python: `from skirout.outfit_picker_skir
    import WhatToWear, WhatToWearRequest

import skir

service_client = skir.ServiceClient("http://localhost:8080/api")

response = service_client.invoke_remote(
    WhatToWear,
    WhatToWearRequest(
        temperature_celsius=25,
        raining=False,
    )
)

if (response.sunglasses):
    print("Don't forget your sunglasses 😎")`,

  cpp: `#include "httplib.h"
#include "skirout/outfit_picker.h"
#include "skir.h"

using ::skirout_outfit_picker::WhatToWear;
using ::skirout_outfit_picker::WhatToWearRequest;
using ::skirout_outfit_picker::WhatToWearResponse;

std::unique_ptr<skir::service::Client> client =
    skir::service::MakeHttplibClient(
        std::make_unique<httplib::Client>("localhost", 8080),
        "/api");

const WhatToWearRequest request = {
    .raining = false,
    .temperature_celsius = 25,
};

const absl::StatusOr<WhatToWearResponse> response =
    InvokeRemote(*client, WhatToWear(), request);

if (response.ok() && response->sunglasses) {
  std::cout << "Don't forget your sunglasses 😎\\n";
}`,

  kotlin: `import build.skir.service.ServiceClient
import skirout.outfit_picker.WhatToWear
import skirout.outfit_picker.WhatToWearRequest
import skirout.outfit_picker.WhatToWearResponse

val serviceClient = ServiceClient("http://localhost:8080/api")

val response = serviceClient.invokeRemote(
    WhatToWear,
    WhatToWearRequest(
        temperatureCelcius = 25,
        raining = false,
    ),
)

if (response.sunglasses) {
    println("Don't forget your sunglasses 😎")
}`,

  java: `import build.skir.service.ServiceClient;
import skirout.outfit_picker.WhatToWearRequest;
import skirout.outfit_picker.WhatToWearResponse;
import skirout.outfit_picker.Methods;

final ServiceClient serviceClient =
    new ServiceClient("http://localhost:8080/api");

final WhatToWearResponse response =
    serviceClient.invokeRemoteBlocking(
        Methods.WHAT_TO_WEAR,
        WhatToWearRequest.builder()
            .setRaining(false)
            .setTemperatureCelsius(25)
            .build());

if (response.sunglasses()) {
  System.out.println("Don't forget your sunglasses 😎");
}`,

  dart: `import 'package:skir_client/skir_client.dart' as skir;
import 'package:your_project/skirout/outfit_picker.dart';

final serviceClient =
    skir.ServiceClient('http://localhost:8080/api');

final response = await serviceClient
    .wrap(whatToWearMethod)
    .invoke(
      WhatToWearRequest(
        temperatureCelsius: 25,
        raining: false,
      )
    );

if (response.sunglasses) {
  print("Don't forget your sunglasses 😎");
}`,
}

export function RpcExample() {
  return <SplitCodeExample skirCode={skirCode} codeExamples={codeExamples} />
}
