// Presets: the defaults a pipeline starts from (template, TTS provider and voice, style,
// direction). A run records the preset revision it used, so later edits do not rewrite
// what an old artifact was made with. Secrets are never stored, only the env var name.

// One field list per pipeline; validation and the control plane form both read it.
export const PRESET_FIELDS = {
  video: [
    { key: 'tts_provider', label: 'TTS provider', type: 'string', required: true, hint: '如 mimo、seed、system' },
    { key: 'tts_voice', label: '音色', type: 'string', required: true },
    { key: 'tts_language', label: '语言', type: 'string', hint: 'zh-CN、en-US' },
    { key: 'tts_rate', label: '语速倍率', type: 'number', hint: '1 为原速' },
    { key: 'api_key_env', label: '密钥所在环境变量', type: 'string', hint: '只记变量名，不记密钥' },
    { key: 'aspect', label: '画幅', type: 'list', hint: '16:9 9:16 4:3 3:4' },
    { key: 'style', label: '视觉风格', type: 'text' },
    { key: 'direction', label: '创作方向', type: 'text' },
    { key: 'cover_aspects', label: '封面画幅', type: 'list', hint: '4:3 3:4' },
  ],
  html: [
    { key: 'template', label: '模板或起步项目', type: 'string', hint: '仓库路径' },
    { key: 'theme', label: '明暗与配色', type: 'string' },
    { key: 'print', label: '需要打印版', type: 'boolean' },
    { key: 'offline', label: '离线自足', type: 'boolean' },
    { key: 'style', label: '视觉风格', type: 'text' },
  ],
}

const SECRET = /(sk-[A-Za-z0-9]{12,}|api[_-]?key\s*[:=]|bearer\s+[A-Za-z0-9._-]{12,})/i

export function validatePreset(input) {
  const fields = PRESET_FIELDS[input.pipeline]
  if (!fields) throw new Error(`pipeline must be one of ${Object.keys(PRESET_FIELDS).join(', ')}`)
  if (!input.title?.trim()) throw new Error('preset needs a title')
  const values = input.values ?? {}
  for (const key of Object.keys(values)) if (!fields.some((f) => f.key === key)) throw new Error(`unknown field for ${input.pipeline}: ${key}`)
  for (const f of fields) {
    const v = values[f.key]
    if (v === undefined || v === '') {
      if (f.required) throw new Error(`${f.key} is required`)
      continue
    }
    const ok = f.type === 'number' ? typeof v === 'number' && Number.isFinite(v)
      : f.type === 'boolean' ? typeof v === 'boolean'
      : f.type === 'list' ? Array.isArray(v) && v.every((x) => typeof x === 'string')
      : typeof v === 'string'
    if (!ok) throw new Error(`${f.key} must be a ${f.type}`)
    if (typeof v === 'string' && SECRET.test(v)) throw new Error(`${f.key} looks like a secret; store the env var name instead`)
  }
  if (values.api_key_env && !/^[A-Z][A-Z0-9_]*$/.test(values.api_key_env)) throw new Error('api_key_env must be an environment variable name')
}

export function presetId(pipeline, title) {
  const slug = title.normalize('NFKD').replace(/[^\x00-\x7f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `${pipeline}/${slug || Date.now().toString(36)}`
}
