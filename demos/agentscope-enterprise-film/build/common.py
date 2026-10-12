"""Shared local paths; no downloads, package installs or remote actions."""
import os
from pathlib import Path
ROOT = Path(os.environ.get('PRAXIS_FILM_ROOT', Path(__file__).resolve().parent.parent)).resolve()


def ffmpeg_path():
    explicit = os.environ.get('PRAXIS_FFMPEG')
    if explicit:
        p = Path(explicit)
        if not p.is_file() or not os.access(p, os.X_OK):
            raise RuntimeError('PRAXIS_FFMPEG must name an executable file')
        return str(p)
    import shutil
    existing = shutil.which('ffmpeg')
    if existing:
        return existing
    cache = Path.home() / '.cache' / 'uv' / 'archive-v0'
    for p in sorted(cache.glob('*/imageio_ffmpeg/binaries/ffmpeg-*')):
        if p.is_file() and os.access(p, os.X_OK):
            return str(p)
    raise RuntimeError('No local ffmpeg found; set PRAXIS_FFMPEG. This pipeline never downloads dependencies.')
