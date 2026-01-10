# 🎯 Top 10 Files with Missing Translation Keys

Generated: January 10, 2026

---

## Files Ranked by Impact

### 1. 🔴 `pages/student/ViewExamPage.tsx`
**Missing Keys:** 57+  
**Impact:** CRITICAL  
**Languages Affected:** EN, AR, KU

**Status:** Entire exam details page is untranslated

**Missing Categories:**
- `view_exam.exam_details`
- `view_exam.exam_title`
- `view_exam.exam_date`
- `view_exam.classroom`
- `view_exam.instructions`
- `view_exam.preparation_tips`
- And 51 more...

**User Impact:** Students cannot view exam details properly

---

### 2. 🔴 `pages/public/FAQPage.tsx`
**Missing Keys:** 13  
**Impact:** CRITICAL  
**Languages Affected:** EN, AR, KU

**Status:** Help page completely untranslated

**Missing Categories:**
- `faq.title`
- `faq.certificates_question`
- `faq.certificates_answer`
- `faq.free_resources_question`
- `faq.technical_support_question`
- And 8 more...

**User Impact:** Users cannot access help content

---

### 3. 🔴 `components/errors/PartialLoadError.tsx`
**Missing Keys:** 17  
**Impact:** CRITICAL  
**Languages Affected:** EN, AR, KU

**Status:** Error handling broken

**Missing Categories:**
- `errors.network.title`
- `errors.network.message`
- `errors.server.title`
- `errors.timeout.message`
- `errors.retry_button`
- And 12 more...

**User Impact:** Users see untranslated error messages

---

### 4. 🔴 `components/landing/Features.tsx`
**Missing Keys:** 35  
**Impact:** HIGH  
**Languages Affected:** EN, AR, KU

**Status:** Marketing features page incomplete

**Missing Categories:**
- `naqraa_features.0.title`
- `naqraa_features.0.description`
- `naqraa_features.0.details.0`
- `naqraa_features.1.*`
- And 30 more array items...

**User Impact:** Landing page features not displayed properly

---

### 5. 🔴 `pages/public/AccountVerified.tsx`
**Missing Keys:** 4  
**Impact:** CRITICAL  
**Languages Affected:** EN, AR, KU

**Status:** Account verification page broken

**Missing Categories:**
- `account_verified.title`
- `account_verified.description`
- `account_verified.login_now`
- `account_verified.back_home`

**User Impact:** New users cannot complete registration flow

---

### 6. ⚠️ `components/UpcomingEventsWidget.tsx`
**Missing Keys:** 5  
**Impact:** HIGH  
**Languages Affected:** EN, AR (AR only 2), KU

**Status:** Dashboard widget partially broken

**Missing Categories:**
- `dashboard_index.no_upcoming_events`
- `dashboard_index.no_date`
- `dashboard_index.add_as_task`
- `dashboard_index.failed_to_fetch_events`
- `dashboard_index.next_days`

**User Impact:** Upcoming events widget shows untranslated text

---

### 7. ⚠️ `pages/student/TodoPage.tsx`
**Missing Keys:** 14  
**Impact:** HIGH  
**Languages Affected:** EN, AR (5 keys), KU

**Status:** Task management messages missing

**Missing Categories:**
- `todo_page.task_created`
- `todo_page.task_updated`
- `todo_page.task_deleted`
- `todo_page.task_completed`
- `todo_page.overdue`
- And 9 more...

**User Impact:** No feedback when managing tasks

---

### 8. ⚠️ `components/DayDetailsDrawer.tsx`
**Missing Keys:** 9  
**Impact:** MEDIUM  
**Languages Affected:** EN, AR, KU

**Status:** Timetable details incomplete

**Missing Categories:**
- `timetable_page.instructor`
- `timetable_page.room`
- `timetable_page.lectures_schedule`
- `timetable_page.classes`
- `timetable_page.type`
- And 4 more...

**User Impact:** Class schedule details not fully translated

---

### 9. ⚠️ `pages/student/ExamsPage.tsx`
**Missing Keys:** Dynamic (`days.${dayKey}`)  
**Impact:** MEDIUM  
**Languages Affected:** EN, AR, KU

**Status:** Dynamic day names not found

**Note:** This uses template strings. Ensure you have all day names:
- `view_exam.saturday`
- `view_exam.sunday`
- `view_exam.monday`
- `view_exam.tuesday`
- `view_exam.wednesday`
- `view_exam.thursday`
- `view_exam.friday`

**User Impact:** Exam dates show incorrect text

---

### 10. ⚠️ `components/TodaysTasksWidget.tsx`
**Missing Keys:** 5  
**Impact:** MEDIUM  
**Languages Affected:** EN, KU (AR has most)

**Status:** Dashboard widget partially broken

**Missing Categories:**
- `task_widget.no_tasks_today`
- `task_widget.overdue`
- `dashboard_index.pending_tasks`
- `dashboard_index.due_in_hours`

**User Impact:** Today's tasks widget incomplete

---

## 📊 Summary Statistics

| Priority | Files | Missing Keys (Total) | Languages Affected |
|----------|-------|---------------------|-------------------|
| 🔴 Critical | 5 | ~126 keys | All (EN, AR, KU) |
| ⚠️ High | 3 | ~24 keys | All or Most |
| ℹ️ Medium | 2 | Dynamic + 5 keys | All |

---

## 🎯 Recommended Fix Order

1. **Start with:** `pages/public/AccountVerified.tsx` (4 keys, critical for onboarding)
2. **Then:** `components/errors/PartialLoadError.tsx` (17 keys, affects all error handling)
3. **Then:** `pages/public/FAQPage.tsx` (13 keys, help page)
4. **Then:** `components/landing/Features.tsx` (35 keys, marketing)
5. **Then:** `pages/student/ViewExamPage.tsx` (57 keys, large but important)
6. **Finally:** Widget and detail pages (24 keys combined)

---

## 🔧 Quick Commands to Check Each File

```bash
# Search for translation usage in a specific file
grep -n "t(" pages/student/ViewExamPage.tsx | head -20

# Count missing keys in ViewExamPage
python3 -c "
import json
with open('code_translation_report.json') as f:
    data = json.load(f)
    view_exam_keys = [k for k in data['missing_keys']['en']['keys'] if 'view_exam' in k]
    print(f'view_exam missing keys: {len(view_exam_keys)}')
"

# Show all missing keys for a specific component
cat code_translation_report.json | python3 -m json.tool | grep "view_exam"
```

---

## ✅ Progress Tracker

Track your progress fixing each file:

- [ ] AccountVerified.tsx (4 keys)
- [ ] PartialLoadError.tsx (17 keys)
- [ ] FAQPage.tsx (13 keys)
- [ ] Features.tsx (35 keys)
- [ ] ViewExamPage.tsx (57 keys)
- [ ] UpcomingEventsWidget.tsx (5 keys)
- [ ] TodoPage.tsx (14 keys)
- [ ] DayDetailsDrawer.tsx (9 keys)
- [ ] ExamsPage.tsx (dynamic days)
- [ ] TodaysTasksWidget.tsx (5 keys)

**Total:** ~159 unique keys to add (some overlap across languages)

---

## 📝 After Fixing Each File

1. Run the check script:
   ```bash
   python3 check_missing_in_code.py
   ```

2. Test the specific page/component in all languages

3. Commit your changes:
   ```bash
   git add public/locales/
   git commit -m "Add missing translations for [file name]"
   ```

---

**Last Updated:** January 10, 2026  
**Script Used:** `check_missing_in_code.py`
