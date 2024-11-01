#!python3
"""
Generate a tag file for each tag in use on your Jekyll blog
"""

from pathlib import Path


class CommitError(BaseException):
    """Raised when tags have changed to prompt the user to restart the process."""


tags_path = Path("_tag")

# get a list of all the tag pages that already exist
existing_tag_files = [f.stem for f in tags_path.glob("*.md")]

used_tags = []

# find all the tags currently in use
# if you have other collections be aware that tags on those are not processed by default
for p in Path("_posts/").iterdir():
    for post in p.glob('*.md'):
        with open(post) as f:
            end = False
            for line in f:
                if line.startswith("---"):
                    if end:
                        # got to the end of the front matter so stop now
                        break
                    end = True
                elif line.startswith("tag"):
                    used_tags.extend(line.split(":")[1].split())

used_tags = set(used_tags)

# generate new tag files
for tag in used_tags.difference(existing_tag_files):
    tag_file_content = f"---\ntag: \"{tag}\"\n---"
    tags_path.joinpath(f"{tag}.md").write_text(tag_file_content)

# remove any files that are no longer in use
for tag in set(existing_tag_files).difference(used_tags):
    tags_path.joinpath(f"{tag}.md").unlink()

# if any of the files have changed stop the commit so they can be added
if used_tags.symmetric_difference(existing_tag_files):
    raise CommitError("Tags have changed. Add tag file changes to commit.")