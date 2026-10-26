"""Self-check for the Seed TTS credentials. Prints what kind of credential is set (by its
shape only, never its value) and what the speech service answers to a three-character request.

  python3 audio/seed_check.py
"""
import json, os, re, urllib.error, urllib.request, uuid

key = os.environ.get('SEED_TTS_API_KEY', '')
app = os.environ.get('SEED_TTS_APP_ID', '')
rid = os.environ.get('SEED_TTS_RESOURCE_ID', 'seed-tts-2.0')
host = os.environ.get('SEED_TTS_HOST', 'openspeech.bytedance.com')

if not key:
    raise SystemExit('SEED_TTS_API_KEY 没有设置。在 ~/.zshenv 里写 export SEED_TTS_API_KEY=…，然后新开一个终端。')
if re.fullmatch(r'[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}', key):
    kind = '36 位 UUID：豆包语音新版控制台的 API Key（正确的类型）'
elif re.fullmatch(r'[A-Za-z]{2,4}-[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}-\w{4,6}', key):
    kind = '火山方舟（Ark）的 API Key：语音接口不认这一种，需要换成豆包语音控制台里的 Key'
elif re.fullmatch(r'[A-Za-z0-9_-]{32}', key):
    kind = '32 位字符串：像是旧版控制台的 Access Token，需要同时设置 SEED_TTS_APP_ID'
else:
    kind = f'{len(key)} 位，认不出的形状'
print('密钥类型：', kind)
print('App ID：', '已设置' if app else '未设置', '｜资源：', rid, '｜主机：', host)

headers = {'Content-Type': 'application/json', 'X-Api-Resource-Id': rid, 'X-Api-Request-Id': str(uuid.uuid4())}
if app:
    headers.update({'X-Api-App-Id': app, 'X-Api-Access-Key': key})
else:
    headers['X-Api-Key'] = key
body = {'user': {'uid': 'check'}, 'req_params': {'text': '你好。', 'speaker': 'zh_male_m191_uranus_bigtts',
                                                 'audio_params': {'format': 'pcm', 'sample_rate': 24000}}}
req = urllib.request.Request(f'https://{host}/api/v3/tts/unidirectional', data=json.dumps(body, ensure_ascii=False).encode(), method='POST', headers=headers)
try:
    r = urllib.request.urlopen(req, timeout=60)
    r.read(2000)
    print('结果：通过。可以合成了。')
except urllib.error.HTTPError as e:
    msg = e.read().decode(errors='replace')
    m = re.search(r'"message":"([^"]*)"', msg)
    text = m.group(1) if m else msg[:160]
    hint = {'Invalid X-Api-Key': '密钥本身不被语音服务承认（类型不对，或抄错了）',
            'not granted': '密钥是对的，但这个账号/应用还没有开通这项资源',
            'app key not found': '用的是旧版 Token，但没有给 App ID',
            'grant not found': '新版 Key 被放进了旧版的请求头，去掉 SEED_TTS_APP_ID'}
    why = next((v for k, v in hint.items() if k in text), '')
    print(f'结果：没通过。HTTP {e.code}：{text}' + (f'\n原因：{why}' if why else ''))
