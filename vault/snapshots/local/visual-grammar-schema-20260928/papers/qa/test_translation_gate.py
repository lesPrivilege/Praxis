"""派生阅读入口的来源/复核失败用例；不改真实译文或 manifest。"""
import sys
import hashlib
import subprocess
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import build


class TranslationGate(unittest.TestCase):
    def setUp(self):
        # Bind the positive fixture to real historical source bytes. Current
        # editorial changes must not turn every negative case into stale-source failure.
        self.commit = "a0234bc42dda75767554a2da89c247d66c2ad022"
        self.source_bytes = {path: subprocess.check_output(
            ["git", "show", f"{self.commit}:{path.relative_to(build.SCRIPT_DIR.parent).as_posix()}"],
            cwd=build.SCRIPT_DIR.parent,
        ) for path in build.SOURCE_FILES.values()}
        self.payload = {
            'source_commit': 'a0234bc42dda75767554a2da89c247d66c2ad022',
            'review_status': 'reviewed',
            'files': {name: {
                'review_status': 'reviewed',
                'source_sha256': hashlib.sha256(self.source_bytes[path]).hexdigest(),
                'translation_sha256': build.sha256_file(build.TRANSLATION_FILES[name]),
            } for name, path in build.SOURCE_FILES.items()},
        }

    def ready(self, payload):
        original = Path.read_bytes
        def read_bytes(path):
            return self.source_bytes[path] if path in self.source_bytes else original(path)
        with patch.object(build, 'load_manifest', return_value=payload), patch.object(Path, 'read_bytes', read_bytes):
            return build.reviewed_translation_cache()

    def test_exact_binding(self):
        self.assertTrue(self.ready(self.payload))

    def test_unreviewed_document(self):
        self.payload['files']['practice']['review_status'] = 'pending'
        self.assertFalse(self.ready(self.payload))

    def test_stale_source(self):
        self.payload['files']['canonical']['source_sha256'] = '0' * 64
        self.assertFalse(self.ready(self.payload))

    def test_changed_translation(self):
        self.payload['files']['index']['translation_sha256'] = '0' * 64
        self.assertFalse(self.ready(self.payload))

    def test_missing_document(self):
        del self.payload['files']['index']
        self.assertFalse(self.ready(self.payload))

    def test_fictitious_commit(self):
        self.payload['source_commit'] = '0' * 40
        self.assertFalse(self.ready(self.payload))

    def test_unreviewed_manifest(self):
        self.payload['review_status'] = 'pending'
        self.assertFalse(self.ready(self.payload))

    def test_source_copy_is_not_an_english_translation(self):
        original = Path.read_text
        def read_text(path, *args, **kwargs):
            if path == build.TRANSLATION_FILES['canonical']:
                return original(build.SOURCE_FILES['canonical'], *args, **kwargs)
            return original(path, *args, **kwargs)
        with patch.object(Path, 'read_text', read_text):
            self.assertFalse(self.ready(self.payload))


if __name__ == '__main__':
    unittest.main()
