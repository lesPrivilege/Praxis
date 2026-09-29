#!/usr/bin/env python3
"""Write a work's verification table and renders/README.md from its reports.

  python3 receipt.py <work>

The table replaces the block that starts at "| 结论 | 结果 |" in <work>/README.md, so
receipts never drift from check-report.json and render-config.json.
"""
import json
import re
import sys
from pathlib import Path


def rows(work):
    r = json.loads((work / 'renders' / 'check-report.json').read_text())
    c = json.loads((work / 'renders' / 'render-config.json').read_text())
    ps, bp, st = r['video_decode']['psnr_vs_fresh_render_db'], r['browser_playback'], r['self_test']
    low = {t: v for t, v in ps.items() if v < 30}
    ok = lambda b: '通过' if b else '未通过'
    audio = c['audio']
    vid = c['video']
    out = [
        ('网页可运行', f"{ok(r['interactive_play']['pass'] and r['static_param']['pass'] and r['reduced_motion']['pass'] and not r['console_errors'])}："
                      f"Chromium 加载无 console 错误；空格播放 {r['interactive_play']['advanced_to_s']} 秒后暂停；`?static=1` 与减少动态效果两种入口各生成 "
                      f"{r['static_param']['plates']} 张分镜，390px 下无横向溢出；GL：{r.get('gl_renderer') or '—'}"),
        ('自检', f"{ok(st['pass'])}：selfTest {sum(x['pass'] for x in st['checks'])}/{len(st['checks'])} 项"),
        ('重复 seek 一致', f"{ok(r['seek_consistency']['pass'])}：{r['seek_consistency']['times']} 个时刻 × 顺序、逆序、乱序 3 遍，"
                          f"帧指纹 {len(r['seek_consistency']['mismatched_times'])} 处不一致"),
        ('视频已导出', f"通过：{c['output']}，{vid['codec']} {vid['bitrate'] / 1e6:g} Mbps，{c['size'][0]}×{c['size'][1]} @{c['fps']}fps，"
                      f"{c['frames']} 帧，{c['output_bytes'] / 1e6:.1f} MB；"
                      + (f"音轨 Opus {audio['bitrate'] // 1000} kbps，{audio['channels']} 声道，来自 {audio['source']}；" if audio else '无音轨（作品没有声音）；')
                      + f"WebCodecs 编码，webm.py 封装，用时 {c['elapsed_s']} 秒"),
        ('实际解码', f"{ok(r['video_decode']['pass'])}：{r['video_decode']['decoder']} 解码 {r['video_decode']['frames_decoded']}/"
                    f"{r['video_decode']['frames_expected']} 帧；{len(ps)} 个关键帧与新渲染对比，PSNR {min(ps.values())}–{max(ps.values())} dB"
                    + (f"；低于 30 dB：{'、'.join(f'{t}s（{v}）' for t, v in low.items())}" if low else '')),
        ('完整播放', f"{ok(bp['pass'])}：Chromium `<video>` {bp['playback_rate']} 倍速播放至 ended，时长 {bp.get('duration', 0):.3f} 秒"
                    + (f"，解码音频 {bp.get('audio_bytes_decoded', 0):,} 字节" if audio else '')
                    + "；Opus 读了解码拼图 `renders/contact-sheet.png`"),
    ]
    if audio:
        a = r['audio_sync']
        out.append(('音画同步', f"{ok(a['pass'])}：{a['decoder']} 解码封装后的 Opus 流，与源 WAV 互相关，偏移 {a['offset_ms']} ms，相关系数 {a['correlation']}"))
    out += [
        ('依赖已离线', '部分：页面与运行层没有外部请求；字体使用系统字体，未随仓库保存；导出依赖本机 Playwright Chromium，未快照'),
        ('受众验证', '未做：没有观看基线，理解与感受未知'),
    ]
    return out, c


def table(work):
    out, _ = rows(work)
    return '| 结论 | 结果 |\n|---|---|\n' + '\n'.join(f'| {a} | {b} |' for a, b in out)


def renders_readme(work, c):
    audio = c['audio']
    files = [
        f"| `{Path(c['output']).name}` | {c['video']['codec']} {c['size'][0]}×{c['size'][1]} @{c['fps']}fps，{c['frames']} 帧"
        + (f"；Opus 音轨 {audio['channels']} 声道 48 kHz" if audio else '；无音轨') + ' |',
    ]
    if audio:
        files.append('| `audio-only.webm` | 同一 Opus 流另封一份（只含一帧画面），供同步检查解码 |')
    files += [
        '| [render-config.json](render-config.json) | 帧率、尺寸、编码器与码率、GL renderer、启动参数、源文件 sha256、每 2 秒帧指纹 |',
        '| [check-report.json](check-report.json) | 自检、seek 一致、交互、静态与减少动态效果入口、解码 PSNR、浏览器播放、音画偏移 |',
        '| `contact-sheet.png` | 从导出视频解码出的帧，每 4 秒一格 |',
        '| [keyframes](keyframes/README.md) | 静态分镜时刻的 PNG |',
    ]
    return (f"# 导出产物\n\n由 [流水线](../../_pipeline/README.md) 生成；git HEAD `{c['git_head'][:7]}`，工作树含未提交修改，逐文件源哈希见配置。\n\n"
            '| 文件 | 内容 |\n|---|---|\n' + '\n'.join(files) +
            '\n\n视频、`audio-only.webm` 与拼图不进 git，用 `vgpipe.py render` 与 `check` 在本地重新生成；配置、报告与关键帧随仓库保存。'
            '文件存在不算验收；各项检查结论写在 [作品说明](../README.md#验证)。\n')


if __name__ == '__main__':
    work = Path(sys.argv[1]).resolve()
    readme = work / 'README.md'
    s = readme.read_text()
    new = table(work)
    if 'CHECK_TABLE' in s:
        s = s.replace('CHECK_TABLE', new)
    else:
        s, n = re.subn(r'\| 结论 \| 结果 \|\n\|---\|---\|\n(?:\|.*\|\n?)+', new + '\n', s)
        if n != 1:
            sys.exit(f'{readme}: expected one verification table, found {n}')
    readme.write_text(s)
    _, c = rows(work)
    (work / 'renders' / 'README.md').write_text(renders_readme(work, c))
    kf = work / 'renders' / 'keyframes' / 'README.md'
    kf.write_text('# 关键帧\n\n`vgpipe.py frames` 在静态分镜时刻用 `__vg.frame(t, "image/png")` 生成，文件名即时刻（秒）。'
                  '网页中的静态分镜按同一批时刻即时生成，不读取这些文件。返回 [导出产物](../README.md)。\n')
    print(f'updated {readme.relative_to(work.parent)}')
