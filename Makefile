# The one task entry point: `make validate` is the gate before a commit, and what CI runs.
.PHONY: validate

validate:
	node --check .github/scripts/languages.mjs
	python3 scripts/text_check.py .
	python3 scripts/issue_links.py . --repo martonpaulo/martonpaulo
	python3 scripts/dry_check.py
