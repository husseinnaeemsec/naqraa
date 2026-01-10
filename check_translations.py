#!/usr/bin/env python3
"""
Translation Key Checker for Naqraa Frontend
This script checks for missing translation keys across different language files.
"""

import json
import os
from pathlib import Path
from typing import Dict, Set, List, Tuple


def flatten_keys(d: dict, parent_key: str = '', sep: str = '.') -> Set[str]:
    """
    Flatten nested dictionary keys into dot-notation strings.
    Example: {"a": {"b": "value"}} -> {"a.b"}
    """
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
    except FileNotFoundError:
        print(f"❌ File not found: {file_path}")
        return {}
    except json.JSONDecodeError as e:
        print(f"❌ JSON decode error in {file_path}: {e}")
        return {}


def compare_translations(locales_dir: str) -> Dict[str, Dict[str, List[str]]]:
    """
    Compare translation files and find missing keys.
    
    Returns:
        Dictionary with language codes as keys and missing keys information.
    """
    # Language files to check
    languages = {
        'en': os.path.join(locales_dir, 'en', 'translation.json'),
        'ar': os.path.join(locales_dir, 'ar', 'translation.json'),
        'ku': os.path.join(locales_dir, 'ku', 'translation.json')
    }
    
    # Load all translation files
    translations = {}
    all_keys = {}
    
    print("📂 Loading translation files...\n")
    for lang, file_path in languages.items():
        translations[lang] = load_translation_file(file_path)
        all_keys[lang] = flatten_keys(translations[lang])
        print(f"  ✅ {lang.upper()}: {len(all_keys[lang])} keys found")
    
    print(f"\n{'='*70}\n")
    
    # Get union of all keys
    all_possible_keys = set()
    for keys in all_keys.values():
        all_possible_keys.update(keys)
    
    # Find missing keys for each language
    missing_keys = {}
    for lang in languages:
        missing = all_possible_keys - all_keys[lang]
        if missing:
            missing_keys[lang] = sorted(list(missing))
    
    return missing_keys, all_keys, all_possible_keys


def find_extra_keys(all_keys: Dict[str, Set[str]], all_possible_keys: Set[str]) -> Dict[str, List[str]]:
    """Find keys that exist in one language but not in others (potential reference language keys)."""
    extra_keys = {}
    
    for lang, keys in all_keys.items():
        # Keys that exist in this language but not in ANY other language
        other_langs_keys = set()
        for other_lang, other_keys in all_keys.items():
            if other_lang != lang:
                other_langs_keys.update(other_keys)
        
        extra = keys - other_langs_keys
        if extra:
            extra_keys[lang] = sorted(list(extra))
    
    return extra_keys


def print_report(missing_keys: Dict[str, List[str]], all_keys: Dict[str, Set[str]], 
                 all_possible_keys: Set[str]):
    """Print a formatted report of missing translation keys."""
    
    print("🔍 TRANSLATION KEY ANALYSIS REPORT")
    print(f"{'='*70}\n")
    
    print("📊 SUMMARY:")
    print(f"   Total unique keys across all languages: {len(all_possible_keys)}")
    for lang, keys in all_keys.items():
        coverage = (len(keys) / len(all_possible_keys) * 100) if all_possible_keys else 0
        print(f"   {lang.upper()}: {len(keys)} keys ({coverage:.1f}% coverage)")
    
    print(f"\n{'='*70}\n")
    
    # Report missing keys
    if missing_keys:
        print("⚠️  MISSING TRANSLATION KEYS:\n")
        
        for lang, keys in missing_keys.items():
            print(f"🔴 {lang.upper()} is missing {len(keys)} key(s):")
            print(f"   (Keys that exist in other languages but not in {lang.upper()})\n")
            
            # Group keys by top-level category
            categorized = {}
            for key in keys:
                category = key.split('.')[0]
                if category not in categorized:
                    categorized[category] = []
                categorized[category].append(key)
            
            for category in sorted(categorized.keys()):
                print(f"   📁 {category}:")
                for key in sorted(categorized[category])[:10]:  # Show first 10
                    print(f"      • {key}")
                
                if len(categorized[category]) > 10:
                    print(f"      ... and {len(categorized[category]) - 10} more")
                print()
            
            print(f"{'-'*70}\n")
    else:
        print("✅ All languages have complete translations!")
    
    # Find keys unique to each language
    print(f"\n{'='*70}\n")
    print("🔎 KEYS UNIQUE TO SPECIFIC LANGUAGES:")
    print("   (These might be language-specific or need to be added to others)\n")
    
    extra_keys = find_extra_keys(all_keys, all_possible_keys)
    if extra_keys:
        for lang, keys in extra_keys.items():
            print(f"   {lang.upper()} has {len(keys)} unique key(s):")
            for key in sorted(keys)[:5]:
                print(f"      • {key}")
            if len(keys) > 5:
                print(f"      ... and {len(keys) - 5} more")
            print()
    else:
        print("   ✅ No language-specific keys found\n")
    
    print(f"{'='*70}\n")


def save_detailed_report(missing_keys: Dict[str, List[str]], output_file: str):
    """Save a detailed JSON report of missing keys."""
    report = {
        "timestamp": "2026-01-07",
        "missing_keys": missing_keys,
        "summary": {
            lang: len(keys) for lang, keys in missing_keys.items()
        }
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    print(f"📝 Detailed report saved to: {output_file}\n")


def main():
    """Main execution function."""
    # Get the project root directory
    script_dir = Path(__file__).parent
    locales_dir = script_dir / 'public' / 'locales'
    
    print(f"\n{'='*70}")
    print("  NAQRAA FRONTEND - TRANSLATION KEY CHECKER")
    print(f"{'='*70}\n")
    print(f"📂 Checking translations in: {locales_dir}\n")
    
    if not locales_dir.exists():
        print(f"❌ Locales directory not found: {locales_dir}")
        return
    
    # Compare translations
    missing_keys, all_keys, all_possible_keys = compare_translations(str(locales_dir))
    
    # Print report
    print_report(missing_keys, all_keys, all_possible_keys)
    
    # Save detailed report
    report_file = script_dir / 'translation_report.json'
    save_detailed_report(missing_keys, str(report_file))
    
    # Summary
    total_missing = sum(len(keys) for keys in missing_keys.values())
    if total_missing > 0:
        print(f"⚠️  TOTAL MISSING KEYS: {total_missing}")
        print(f"   Action required: Add missing translation keys to maintain consistency\n")
    else:
        print("✅ All translations are complete and synchronized!\n")


if __name__ == "__main__":
    main()
