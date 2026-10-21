#!/usr/bin/env python3
"""Crea páginas de etiquetas sin eliminar URLs ya publicadas. No requiere librerías externas."""
import argparse
from pathlib import Path
import re
import shlex


def split_tags(value):
    lexer = shlex.shlex(value.strip().strip("[]"), posix=True)
    lexer.whitespace += ","
    lexer.whitespace_split = True
    return list(lexer)


def tags_in_post(path):
    lines = path.read_text(encoding="utf-8-sig").splitlines()
    if not lines or lines[0].strip() != "---":
        return set()
    tags = set()
    reading_tags = False
    for line in lines[1:]:
        if line.strip() == "---":
            break
        match = re.match(r"^tags:\s*(.*)$", line)
        if match:
            reading_tags = True
            tags.update(split_tags(match.group(1)))
        elif reading_tags and re.match(r"^\s*-\s+", line):
            tags.update(split_tags(re.sub(r"^\s*-\s+", "", line)))
        elif line.strip() and not line.lstrip().startswith("#"):
            reading_tags = False
    return tags


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Comprueba las etiquetas sin escribir archivos.")
    args = parser.parse_args()
    root = Path(__file__).resolve().parent
    tag_dir = root / "_tag"
    tags = set()
    for path in (root / "_posts").rglob("*"):
        if path.suffix in (".md", ".markdown"):
            tags.update(tags_in_post(path))
    missing = sorted(tag for tag in tags if not (tag_dir / (tag + ".md")).is_file())
    if args.check:
        if missing:
            print("Faltan etiquetas: " + ", ".join(missing))
            return 1
        print(f"Etiquetas comprobadas: {len(tags)}. Todas tienen página.")
        return 0
    tag_dir.mkdir(exist_ok=True)
    for tag in missing:
        if tag in (".", "..") or "/" in tag or "\\" in tag:
            raise ValueError(f"Etiqueta no válida como nombre de archivo: {tag}")
        safe_tag = tag.replace('"', '\\"')
        (tag_dir / (tag + ".md")).write_text('---\ntag: "' + safe_tag + '"\n---\n', encoding="utf-8")
    print(f"Etiquetas creadas: {len(missing)}. Se conservan todas las páginas existentes.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
