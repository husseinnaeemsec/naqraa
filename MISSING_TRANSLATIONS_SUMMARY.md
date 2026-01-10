# Missing Translations Report

**Generated:** January 10, 2026  
**Project:** Naqraa Frontend

---

## 🚨 Critical Summary

Your project has **518 missing translation keys** that are used in the codebase but not defined in translation files.

### Breakdown by Language

| Language | Keys Used in Code | Keys Available | Missing | Coverage |
|----------|-------------------|----------------|---------|----------|
| **English (EN)** | 993 | 1,087 | **221** | 77.7% ❌ |
| **Arabic (AR)** | 993 | 1,142 | **166** | 83.3% ⚠️ |
| **Kurdish (KU)** | 993 | 1,172 | **131** | 86.8% ⚠️ |

---

## 📊 Most Critical Missing Categories

### 1. View Exam Page (57+ keys)
**Status:** 🔴 Complete page missing translations  
**Affected Languages:** EN, AR, KU  
**Files:** `pages/student/ViewExamPage.tsx`

Missing keys include:
- `view_exam.exam_details`
- `view_exam.exam_title`
- `view_exam.exam_date`
- `view_exam.exam_time`
- `view_exam.classroom`
- And 50+ more...

### 2. FAQ Page (13 keys)
**Status:** 🔴 Complete page missing translations  
**Affected Languages:** EN, AR, KU  
**Files:** `pages/public/FAQPage.tsx`

Missing keys:
- `faq.title`
- `faq.certificates_question`
- `faq.certificates_answer`
- `faq.free_resources_question`
- `faq.free_resources_answer`
- And more...

### 3. Error Handling (17 keys)
**Status:** 🔴 Critical - Error messages not translated  
**Affected Languages:** EN, AR, KU  
**Files:** `components/errors/PartialLoadError.tsx`

Missing keys:
- `errors.network.title`
- `errors.network.message`
- `errors.server.title`
- `errors.server.message`
- `errors.timeout.title`
- `errors.retry_button`
- And more...

### 4. Features Landing Page (35 keys)
**Status:** 🔴 Critical - Marketing page incomplete  
**Affected Languages:** EN, AR, KU  
**Files:** `components/landing/Features.tsx`

Missing keys:
- `naqraa_features.0.title`
- `naqraa_features.0.description`
- `naqraa_features.0.details.0`
- `naqraa_features.1.title`
- And 30+ more...

### 5. Account Verification (4 keys)
**Status:** 🔴 Critical - User onboarding affected  
**Affected Languages:** EN, AR, KU  
**Files:** `pages/public/AccountVerified.tsx`

Missing keys:
- `account_verified.title`
- `account_verified.description`
- `account_verified.login_now`
- `account_verified.back_home`

### 6. Dashboard Components (30+ keys)
**Status:** ⚠️ Important - Dashboard partially translated  
**Affected Languages:** EN, KU (AR has most)  
**Files:** Multiple dashboard widgets

Missing keys include:
- `dashboard_index.no_upcoming_events`
- `dashboard_index.add_as_task`
- `dashboard_index.task_toggle_failed`
- And more...

### 7. Todo/Tasks Page (14 keys)
**Status:** ⚠️ Important - Task management affected  
**Affected Languages:** EN, AR, KU  
**Files:** `pages/student/TodoPage.tsx`

Missing keys:
- `todo_page.task_created`
- `todo_page.task_updated`
- `todo_page.task_deleted`
- `todo_page.task_completed`
- And more...

### 8. Timetable Details (9 keys)
**Status:** ⚠️ Important  
**Affected Languages:** EN, AR, KU  
**Files:** `components/DayDetailsDrawer.tsx`

Missing keys:
- `timetable_page.instructor`
- `timetable_page.room`
- `timetable_page.lectures_schedule`
- And more...

---

## 🎯 Priority Actions

### Immediate (Critical for User Experience)
1. **Add Error Messages** - Users see untranslated error messages
2. **Complete Account Verification** - New users onboarding flow broken
3. **Fix View Exam Page** - Entire exam details page untranslated

### High Priority (Affects Major Features)
4. **Add FAQ Page Translations** - Help/support page incomplete
5. **Complete Features Landing Page** - Marketing content missing
6. **Fix Dashboard Widgets** - Main student interface partially broken

### Medium Priority (Nice to Have)
7. **Complete Todo/Tasks Translations** - Task management messages
8. **Add Timetable Details** - Schedule view details
9. **Fix Footer Translations** - Footer credits incomplete

---

## 📝 Dynamic Keys Issue

Some keys use template strings that the scanner couldn't detect:

### Examples of Dynamic Keys:
```typescript
// These won't be detected by the scanner
t(`attendance.status_${record.status}`)
t(`days.${dayKey}`)
t(`common.priority.${task.priority}`)
t(`tasks_table.priority_${task.priority}`)
```

**Solution:** You have these base keys defined in translation files:
- `attendance.status_present`, `status_absent`, etc.
- `common.priority.high`, `priority.medium`, etc.
- Days of week keys

The scanner reports these as "missing" but they're actually defined. Just make sure all variations exist.

---

## 🔧 How to Fix

### Option 1: Automated (Recommended)
1. Use the generated `code_translation_report.json` file
2. Create a script to add missing keys with placeholder text
3. Send to translation team for proper translations

### Option 2: Manual
For each language file (`public/locales/{lang}/translation.json`):

1. **Add View Exam keys:**
```json
"view_exam": {
  "exam_details": "Exam Details",
  "exam_title": "Exam Title",
  "exam_date": "Exam Date",
  "exam_time": "Exam Time",
  "classroom": "Classroom",
  // ... add all 57 missing keys
}
```

2. **Add FAQ keys:**
```json
"faq": {
  "title": "Frequently Asked Questions",
  "certificates_question": "Can I get certificates?",
  "certificates_answer": "Yes, you can get certificates...",
  // ... add all missing FAQ keys
}
```

3. **Add Error keys:**
```json
"errors": {
  "network": {
    "title": "Network Error",
    "message": "Please check your connection"
  },
  "server": {
    "title": "Server Error",
    "message": "Something went wrong"
  },
  // ... add all error variations
}
```

4. **Continue for all other categories...**

### Example Fix for English:

See the detailed JSON in `code_translation_report.json` for the complete list of missing keys.

---

## 📁 Files to Update

### English Translation File
**Path:** `public/locales/en/translation.json`  
**Missing:** 221 keys

### Arabic Translation File
**Path:** `public/locales/ar/translation.json`  
**Missing:** 166 keys

### Kurdish Translation File
**Path:** `public/locales/ku/translation.json`  
**Missing:** 131 keys

---

## ✅ Validation

After adding missing keys, run:

```bash
python3 check_missing_in_code.py
```

This will verify that all keys used in the code now exist in translation files.

---

## 📈 Progress Tracking

Current status:
- ❌ EN: 77.7% complete (221 missing)
- ⚠️ AR: 83.3% complete (166 missing)
- ⚠️ KU: 86.8% complete (131 missing)

Target: 100% for all languages

---

## 🔗 Related Files

- **Translation Checker:** `check_missing_in_code.py`
- **Detailed Report:** `code_translation_report.json`
- **Previous Analysis:** `TRANSLATION_ANALYSIS.md`
- **Legacy Report:** `translation_report.json`

---

## 💡 Notes

1. **"Unused" keys:** The report shows 300+ unused keys in each language. These might be:
   - Used dynamically (template strings)
   - Planned for future features
   - Legacy keys that can be removed

2. **Dynamic priority keys:** Keys like `common.priority.high`, `priority.medium` are defined but used dynamically as `common.priority.${task.priority}`, so they appear in the "unused" list but are actually needed.

3. **Day names:** Similar situation - `view_exam.saturday`, `monday`, etc. are used via template strings.

---

**Last Updated:** January 10, 2026  
**Next Review:** After translation fixes are applied
