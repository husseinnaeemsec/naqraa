# Translation Keys Analysis Report

**Generated:** January 7, 2026  
**Project:** Naqraa Frontend

---

## Executive Summary

The analysis found **400 missing translation keys** across the three language files (English, Arabic, Kurdish).

### Coverage Statistics

| Language | Keys Present | Coverage | Missing Keys |
|----------|--------------|----------|--------------|
| **English (EN)** | 1,018 | 84.6% | 186 |
| **Arabic (AR)** | 1,064 | 88.4% | 140 |
| **Kurdish (KU)** | 1,130 | 93.9% | 74 |
| **Total Unique Keys** | 1,204 | - | - |

**Kurdish has the best coverage** (93.9%), while **English needs the most work** (84.6%).

---

## Key Findings

### 1. Major Missing Categories

#### English (EN) - Missing 186 keys
- **Exams Page** (27 keys): Complete exam viewing functionality missing
- **Dashboard** (32 keys): Many dashboard widgets incomplete  
- **View Exam** (57 keys): Entire exam detail view needs translation
- **Recent Activity** (11 keys): Activity feed translations missing
- **Days of Week** (7 keys): Basic day names missing

#### Arabic (AR) - Missing 140 keys  
- **Exams Page** (27 keys): Same as English
- **View Exam** (57 keys): Same as English
- **Dashboard Components** (20 keys): Some widgets missing
- **Recent Activity** (7 keys): Partial translations

#### Kurdish (KU) - Missing 74 keys (Best Coverage!)
- **Dashboard Components** (27 keys)
- **View Exam Days** (7 keys)
- **Miscellaneous** (40 keys)

### 2. Common Missing Keys (All Languages)

Some keys are missing across multiple languages:
- `exam_preparation` goal description
- Plural forms for counters (`enrolled_courses_plural`, etc.)
- Recent activity mock data
- Some status labels

### 3. Language-Specific Keys

Keys that exist in one language but not others:
- **English unique**: 25 keys (mostly calendar and profile cards)
- **Arabic unique**: 42 keys (various error messages, UI elements)
- **Kurdish unique**: 112 keys (most complete set, includes exams and days)

---

## Priority Actions

### 🔴 High Priority (Complete First)

1. **Exam Pages (`exams_page.*` and `view_exam.*`)** - 84 keys total
   - Critical for exam viewing functionality
   - Consistent across all languages
   
2. **Days of Week (`days.*`)** - 7 keys
   - Basic, frequently used keys
   - Quick wins for all languages

3. **Dashboard Index** - 32+ keys  
   - Core user interface elements
   - High visibility

### 🟡 Medium Priority

4. **Recent Activity** - 11 keys
   - User engagement feature
   
5. **User Preferences** - Exam preparation goals
   - Onboarding/settings flow

6. **Error Messages** - Various error keys
   - Important for UX

### 🟢 Low Priority

7. **Plural Forms** - 3-4 keys
   - Nice to have for proper grammar
   
8. **Footer Credits** - 2 keys
   - Low impact

---

## Detailed Missing Keys by Language

### English (EN) - 186 Missing Keys

<details>
<summary><strong>Dashboard (37 keys)</strong></summary>

```
dashboard_index.add_as_task
dashboard_index.check_attendance
dashboard_index.continue
dashboard_index.current_streak
dashboard_index.days_count
dashboard_index.due_in_hours
dashboard_index.explore_courses
dashboard_index.last_watched_course
dashboard_index.lectures_completed
dashboard_index.mathematics
dashboard_index.new_task_title
dashboard_index.next_days
dashboard_index.no_courses_yet
dashboard_index.notifications
dashboard_index.pending_tasks
dashboard_index.points_earned
dashboard_index.progress
dashboard_index.quick_actions
dashboard_index.recent_activity
dashboard_index.sample_task
dashboard_index.student
dashboard_index.study_hours
dashboard_index.study_streak
dashboard_index.study_time_this_week
dashboard_index.tasks_completed
dashboard_index.today
dashboard_index.todays_tasks
dashboard_index.upcoming
dashboard_index.view_all
dashboard_index.view_timetable
dashboard_index.weekly_study_hours
dashboard_index.welcome_user
```
</details>

<details>
<summary><strong>Exams (27 keys)</strong></summary>

```
exams_page.completed_exams
exams_page.download_schedule
exams_page.exam_schedule
exams_page.exam_table_title
exams_page.filter_all
exams_page.filter_completed
exams_page.filter_upcoming
exams_page.no_exams
exams_page.no_search_results
exams_page.search_placeholder
exams_page.status_completed
exams_page.status_scheduled
exams_page.status_soon
exams_page.status_upcoming
exams_page.status_urgent
exams_page.subtitle
exams_page.table_actions
exams_page.table_class
exams_page.table_date
exams_page.table_exam
exams_page.table_status
exams_page.table_subject
exams_page.table_time
exams_page.title
exams_page.total_exams
exams_page.upcoming_exams
exams_page.view_button
```
</details>

<details>
<summary><strong>View Exam (57 keys)</strong></summary>

```
view_exam.actions
view_exam.add_to_calendar
view_exam.back_to_exams
view_exam.classroom
view_exam.course_duration_1
view_exam.course_duration_2
view_exam.course_duration_3
view_exam.description
view_exam.download_details
view_exam.error_title
view_exam.exam_completed
view_exam.exam_date
view_exam.exam_details
view_exam.exam_status
view_exam.exam_time
view_exam.exam_title
view_exam.fetch_error
view_exam.instruction_1
view_exam.instruction_2
view_exam.instruction_3
view_exam.instruction_4
view_exam.instructions
view_exam.invalid_exam_id
view_exam.loading
view_exam.no_classroom
view_exam.no_subject
view_exam.organization_access_description
view_exam.organization_access_title
view_exam.recommended_articles
view_exam.recommended_courses
view_exam.recommended_resources
view_exam.sample_article_1
view_exam.sample_article_1_desc
view_exam.sample_article_2
view_exam.sample_article_2_desc
view_exam.sample_article_3
view_exam.sample_article_3_desc
view_exam.sample_course_1
view_exam.sample_course_1_desc
view_exam.sample_course_2
view_exam.sample_course_2_desc
view_exam.sample_course_3
view_exam.sample_course_3_desc
view_exam.sample_resource_1
view_exam.sample_resource_1_desc
view_exam.sample_resource_2
view_exam.sample_resource_2_desc
view_exam.sample_resource_3
view_exam.sample_resource_3_desc
view_exam.share_exam_description
view_exam.share_exam_title
view_exam.status_completed
view_exam.status_scheduled
view_exam.status_soon
view_exam.status_upcoming
view_exam.status_urgent
view_exam.subject
```
</details>

<details>
<summary><strong>Other Categories</strong></summary>

**Days (7 keys):**
```
days.friday, days.monday, days.saturday, days.sunday
days.thursday, days.tuesday, days.wednesday
```

**Recent Activity (11 keys):**
```
recent_activity.count
recent_activity.error_loading
recent_activity.mock_course_enroll
recent_activity.mock_exam_complete
recent_activity.mock_lesson_watch
recent_activity.mock_post_create
recent_activity.time_days_ago
recent_activity.time_hours_ago
recent_activity.time_minutes_ago
recent_activity.time_minutes_days
recent_activity.time_minutes_hours
```

**Upcoming Exams (9 keys):**
```
upcoming_exams.exam_count
upcoming_exams.no_exams
upcoming_exams.no_exams_subtitle
upcoming_exams.scheduled
upcoming_exams.soon
upcoming_exams.title
upcoming_exams.upcoming
upcoming_exams.urgent
upcoming_exams.view_all
```

**Common UI (15 keys):**
```
add_new_collection, add_new_task, alert_confirm_button_text
complete_lecture, completed, delete, edit, error
high, low, medium, next, prev, urgent
loading_resources, loading_resources_text
```

**Error Messages (8 keys):**
```
not_found_error, not_found_error_text
server_error, server_error_text
unauthoraized_error, unauthoraized_error_text
unknown_error, unknown_error_text
```
</details>

---

### Arabic (AR) - 140 Missing Keys

Similar structure but fewer dashboard keys needed. Main gaps:
- Exam pages (same 84 keys as EN)
- Dashboard cards (10 keys)
- Recent activity (7 keys)
- Days of week (7 keys)

---

### Kurdish (KU) - 74 Missing Keys (Best Performance!)

Kurdish is closest to complete. Main gaps:
- Dashboard cards (27 keys)
- View exam days (7 keys)
- Common UI elements (20 keys)
- Error messages (8 keys)

---

## Recommendations

### Immediate Actions

1. **Create a translation task list** - Prioritize by the order above
2. **Add exam-related keys first** - They represent ~40% of missing keys
3. **Standardize day names** - Add to all three languages
4. **Review Kurdish translations** - Use as reference for AR/EN since it's most complete

### Long-term Improvements

1. **Implement automated checks** - Run this script in CI/CD
2. **Add i18n key validation** - Prevent using undefined keys in code
3. **Create translation guidelines** - Ensure consistency across languages
4. **Add plural form support** - Handle grammatical variations properly

### Translation Workflow

1. Identify missing key from report
2. Find equivalent in other languages (if exists)
3. Translate consistently with existing style
4. Test in UI context
5. Mark as complete

---

## Technical Notes

- **Script location:** `/check_translations.py`
- **Report location:** `/translation_report.json`
- **Locale files:** `/public/locales/{en,ar,ku}/translation.json`

To re-run the analysis:
```bash
python3 check_translations.py
```

---

## Appendix: Full List of Missing Keys

See `translation_report.json` for the complete machine-readable list.
