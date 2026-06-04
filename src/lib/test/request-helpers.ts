export function createJsonRequest(url: string, method: string, body?: object, headers?: Record<string, string>): Request {
  const requestInit: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': 'mock-csrf-token',
      ...headers,
    },
  }

  if (body) {
    requestInit.body = JSON.stringify(body)
  }

  return new Request(url, requestInit)
}

export function createGetRequest(url: string, headers?: Record<string, string>): Request {
  return createJsonRequest(url, 'GET', undefined, headers)
}

export function createPostRequest(url: string, body: object, headers?: Record<string, string>): Request {
  return createJsonRequest(url, 'POST', body, headers)
}

export function createPatchRequest(url: string, body: object, headers?: Record<string, string>): Request {
  return createJsonRequest(url, 'PATCH', body, headers)
}

export function createDeleteRequest(url: string, headers?: Record<string, string>): Request {
  return createJsonRequest(url, 'DELETE', undefined, headers)
}
