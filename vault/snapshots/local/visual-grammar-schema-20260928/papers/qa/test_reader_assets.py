"""Required assets fail closed, using isolated fixtures only."""
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import build

class ReaderAssets(unittest.TestCase):
    def test_missing_assets(self):
        for name in ("signature.svg", "cover.svg", "cover-compact.svg"):
            with self.subTest(name=name), tempfile.TemporaryDirectory() as root:
                with patch.object(build, "SCRIPT_DIR", Path(root)):
                    with self.assertRaises(FileNotFoundError):
                        build.reader_asset(name)

    def test_empty_asset(self):
        with tempfile.TemporaryDirectory() as root:
            directory = Path(root) / "reader"
            directory.mkdir()
            (directory / "signature.svg").write_text("  ")
            with patch.object(build, "SCRIPT_DIR", Path(root)):
                with self.assertRaisesRegex(ValueError, "Required reader asset is empty"):
                    build.reader_asset("signature.svg")

    def test_missing_compact_cannot_silently_hide_cover(self):
        with tempfile.TemporaryDirectory() as root:
            directory = Path(root) / "reader"
            directory.mkdir()
            (directory / "cover.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg"/>')
            with patch.object(build, "SCRIPT_DIR", Path(root)):
                with self.assertRaises(FileNotFoundError):
                    build.with_cover("<h1>Title</h1><h2>Subtitle</h2>", "Cover")

if __name__ == "__main__":
    unittest.main()
