// Test helper: every JSON response must match what the scenario's OpenAPI contract declares for it.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import { parse } from 'yaml';

const read = (name: string) => readFileSync(fileURLToPath(new URL(`../contracts/${name}`, import.meta.url)), 'utf8');
// Local references point into the scenario contract, "./work.yaml" ones into the shared envelope.
const rebase = (text: string) => text.replaceAll('"$ref":"./work.yaml#/', '"$ref":"work#/').replaceAll('"$ref":"#/', '"$ref":"contract#/');

export function contractCheck(contractFile: string) {
  const contract = parse(read(contractFile));
  const ajv = new Ajv2020({ strict: false, validateFormats: false });
  ajv.addSchema(JSON.parse(JSON.stringify(parse(read('work.yaml'))).replaceAll('"$ref":"#/', '"$ref":"work#/')), 'work');
  ajv.addSchema(JSON.parse(rebase(JSON.stringify(contract))), 'contract');

  // The schema declared for this method, path and status; null when the response has no body.
  function declared(method: string, path: string, status: number): unknown {
    const template = Object.keys(contract.paths).find((t) => new RegExp(`^${t.replace(/\{[^}]+\}/g, '[^/]+')}$`).test(path));
    assert.ok(template, `No contract path for ${method} ${path}`);
    const responses = contract.paths[template][method.toLowerCase()]?.responses ?? {};
    // 401, 500 and 503 fall under each operation's default Problem; anything else must be named.
    const response = responses[String(status)] ?? ([401, 500, 503].includes(status) ? responses.default : undefined);
    assert.ok(response, `${method} ${template} does not declare status ${status}`);
    const resolved = response.$ref ? contract.components.responses[response.$ref.split('/').pop()] : response;
    return resolved.content?.['application/json'].schema ?? null;
  }

  return function check(method: string, path: string, status: number, text: string): void {
    const schema = declared(method, path.split('?')[0], status);
    if (!schema) return assert.equal(text, '', `${method} ${path} → ${status} should have no body`);
    const validate = ajv.compile(JSON.parse(rebase(JSON.stringify(schema))));
    assert.ok(validate(JSON.parse(text)), `${method} ${path} → ${status} breaks the contract: ${JSON.stringify(validate.errors)}`);
  };
}
