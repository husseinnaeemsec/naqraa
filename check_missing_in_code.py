#!/usr/bin/env python3
"""
Check for translation keys used in code but missing from translation files.
This finds t('key') usage in the codebase and verifies they exist in translations.
"""

import json
import os
import re
from pathlib import Path
from typing import Set, Dict, List

def flatten_keys(d: dict, parent_key: str = '', sep: str = '.') -> Set[str]:
    """Flatten nested dictionary keys into dot-notation strings."""
    keys = set()
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            keys.update(flatten_keys(v, new_key, sep=sep))
        else:
            keys.add(new_key)
    return keys

def load_translation_file(file_path: str) -> Dict:
    """Load and parse a JSON translation file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"⚠️  Error loading {file_path}: {e}")
        return {}

def find_translation_keys_in_file(file_path: str) -> Set[str]:
    """
    Extract translation keys from a TypeScript/JavaScript file.
    Looks for patterns like: t('key') or t("key") or t(`key`)
    """
    keys = set()
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Pattern to match t('key'), t("key"), t(`key`), i18n.t('key'), etc.
        patterns = [
            r"[^a-zA-Z]t\s*\(\s*['\"]([^'\"]+)['\"]\s*[\),]",  # t('key') or t("key")
            r"[^a-zA-Z]t\s*\(\s*`([^`]+)`\s*[\),]",  # t(`key`)
            r"i18n\.t\s*\(\s*['\"]([^'\"]+)['\"]\s*[\),]",  # i18n.t('key')
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, content)
            keys.update(matches)
            
    except Exception as e:
        print(f"⚠️  Error reading {file_path}: {e}")
    
    return keys

def find_all_translation_keys_in_codebase(src_dir: str) -> Dict[str, Set[str]]:
    """Scan all source files for translation key usage."""
    all_keys = {}
    extensions = ['.tsx', '.ts', '.jsx', '.js']
    
    for root, dirs, files in os.walk(src_dir):
        # Skip node_modules and other build directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', 'build', '.git']]
        
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, src_dir)
                keys = find_translation_keys_in_file(file_path)
                if keys:
                    all_keys[rel_path] = keys
    
    return all_keys

def main():
    script_dir = Path(__file__).parent
    src_dir = script_dir / 'src'
    locales_dir = script_dir / 'public' / 'locales'
    
    print(f"\n{'='*80}")
    print("  CHECKING TRANSLATION KEYS USED IN CODE")
    print(f"{'='*80}\n")
    
    # Load translation files
    print("📂 Loading translation files...\n")
    languages = {
        'en': locales_dir / 'en' / 'translation.json',
        'ar': locales_dir / 'ar' / 'translation.json',
        'ku': locales_dir / 'ku' / 'translation.json'
    }
    
    translation_keys = {}
    for lang, file_path in languages.items():
        translations = load_translation_file(str(file_path))
        translation_keys[lang] = flatten_keys(translations)
        print(f"   ✅ {lang.upper()}: {len(translation_keys[lang])} keys loaded")
    
    # Find all keys used in code
    print(f"\n📁 Scanning source code in: {src_dir}\n")
    code_keys_by_file = find_all_translation_keys_in_codebase(str(src_dir))
    
    # Collect all unique keys used in code
    all_code_keys = set()
    for keys in code_keys_by_file.values():
        all_code_keys.update(keys)
    
    print(f"   ✅ Found {len(all_code_keys)} unique translation keys used in {len(code_keys_by_file)} files\n")
    
    print(f"{'='*80}\n")
    print("🔍 CHECKING FOR MISSING KEYS IN TRANSLATION FILES\n")
    
    # Check which keys are missing from each language
    missing_by_language = {}
    for lang, available_keys in translation_keys.items():
        missing = all_code_keys - available_keys
        if missing:
            missing_by_language[lang] = sorted(list(missing))
    
    if missing_by_language:
        print("⚠️  MISSING TRANSLATION KEYS DETECTED!\n")
        
        for lang, missing_keys in missing_by_language.items():
            print(f"🔴 {lang.upper()} is missing {len(missing_keys)} key(s) used in code:\n")
            
            # Show missing keys with file references
            key_files = {}
            for file_path, file_keys in code_keys_by_file.items():
                for key in file_keys:
                    if key in missing_keys:
                        if key not in key_files:
                            key_files[key] = []
                        key_files[key].append(file_path)
            
            # Group by category
            categorized = {}
            for key in missing_keys:
                category = key.split('.')[0] if '.' in key else 'root'
                if category not in categorized:
                    categorized[category] = []
                categorized[category].append(key)
            
            for category in sorted(categorized.keys()):
                print(f"   📁 {category}:")
                for key in sorted(categorized[category])[:20]:
                    files = key_files.get(key, [])
                    file_list = ', '.join(files[:2])
                    if len(files) > 2:
                        file_list += f" (+{len(files)-2} more)"
                    print(f"      • {key}")
                    print(f"        Used in: {file_list}")
                
                if len(categorized[category]) > 20:
                    print(f"      ... and {len(categorized[category]) - 20} more keys")
                print()
            
            print(f"{'-'*80}\n")
    else:
        print("✅ All translation keys used in code exist in translation files!\n")
    
    # Check for unused keys in translation files
    print(f"{'='*80}\n")
    print("🔍 CHECKING FOR UNUSED KEYS IN TRANSLATION FILES\n")
    
    unused_by_language = {}
    for lang, available_keys in translation_keys.items():
        unused = available_keys - all_code_keys
        if unused:
            unused_by_language[lang] = sorted(list(unused))
    
    if unused_by_language:
        for lang, unused_keys in unused_by_language.items():
            print(f"ℹ️  {lang.upper()} has {len(unused_keys)} key(s) not used in code")
            print(f"   (These might be used dynamically or are no longer needed)\n")
            
            # Show first 10
            for key in sorted(unused_keys)[:10]:
                print(f"      • {key}")
            if len(unused_keys) > 10:
                print(f"      ... and {len(unused_keys) - 10} more\n")
    
    print(f"{'='*80}\n")
    
    # Summary
    total_missing = sum(len(keys) for keys in missing_by_language.values())
    if total_missing > 0:
        print(f"⚠️  TOTAL MISSING KEYS: {total_missing}")
        print(f"   Action required: Add these translation keys to the respective language files\n")
    else:
        print("✅ All translation keys are properly defined!\n")
    
    # Save report
    report = {
        "code_keys_count": len(all_code_keys),
        "files_scanned": len(code_keys_by_file),
        "missing_keys": {
            lang: {
                "count": len(keys),
                "keys": keys
            } for lang, keys in missing_by_language.items()
        },
        "unused_keys": {
            lang: {
                "count": len(keys),
                "keys": keys[:100]  # Limit to first 100
            } for lang, keys in unused_by_language.items()
        }
    }
    
    report_file = script_dir / 'code_translation_report.json'
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    print(f"📝 Detailed report saved to: {report_file}\n")

if __name__ == "__main__":
    main()
