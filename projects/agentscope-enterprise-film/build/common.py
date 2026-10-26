"""Local paths and cached ffmpeg; no dependency download."""
import os,shutil
from pathlib import Path
ROOT=Path(os.environ.get('PRAXIS_FILM_ROOT',Path(__file__).resolve().parent.parent)).resolve()
def ffmpeg_path():
    explicit=os.environ.get('PRAXIS_FFMPEG')
    if explicit:
        p=Path(explicit)
        if not p.is_file() or not os.access(p,os.X_OK):raise RuntimeError('PRAXIS_FFMPEG must be executable')
        return str(p)
    binary=shutil.which('ffmpeg')
    if binary:return binary
    for p in sorted((Path.home()/'.cache'/'uv'/'archive-v0').glob('*/imageio_ffmpeg/binaries/ffmpeg-*')):
        if p.is_file() and os.access(p,os.X_OK):return str(p)
    raise RuntimeError('No existing ffmpeg; set PRAXIS_FFMPEG. No downloads are performed.')
