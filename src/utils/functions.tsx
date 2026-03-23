import { t } from "i18next";
import type {  Enrollment, EnrollmentSection,  } from "../../types"
import { BASE_API_URL } from "../api/client";
import i18n from '../i18n';
import type { UserType } from "../types/user";



export const setupUserPrefrences = (user: UserType ) => {

  const userPreferences = user?.preferences;

  if (userPreferences) {
    // Change language
    if (i18n.language !== userPreferences.language) {
      i18n.changeLanguage(userPreferences.language);
    }

    // Set direction (RTL for ar/ku)
    document.body.dir = userPreferences.language === "ar" || userPreferences.language === "ku" ? "rtl" : "ltr";

    // Theme setup using html.classList
    if (userPreferences.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
};

export function getLogo(color: string = 'default') {
  if (color === 'default') {
    if (document.documentElement.classList.contains("dark")) {
      return '/logo-dark.svg'
    }
  }else if (color === 'dark'){
    return '/logo-dark.svg';
  }
  return '/logo.svg'

}

export function getFavicon() {

  return '/favicon.svg'
}

/**
 * Get media URL
 * @param path - media file name or absolute URL
 * @returns string - full URL to the media
 */
export function getMedia(path: string): string {
  if (!path) return '';

  // Check if path is absolute URL
  const isAbsolute = /^(https?:)?\/\//i.test(path);
  if (isAbsolute) return path;

  // Otherwise, construct full URL
  return `${BASE_API_URL.replace("/v1","")}${path}`;
}


export function convertDurationsToHours(durations: number[]): string[] {
  return durations.map((duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    let result = "";
    if (hours > 0) {
      result += `${hours} ساعة`;
    }
    if (minutes > 0) {
      if (hours > 0) result += " و ";
      result += `${minutes} دقيقة`;
    }
    if (!result) result = "0 دقيقة"; // handle 0
    return result;
  });
}

export function getLectureDurations(enrollment: Enrollment): number[] {
  const durations: number[] = [];
  enrollment.course.sections.forEach((section) => {
    section.lectures.forEach((lecture) => {
      durations.push(lecture.duration);
    });
  });
  return durations;
}

export function formatFileSize(sizeInBytes: number): string {
    if (sizeInBytes === 0) return "0 بايت";

    const k = 1024;
    const units = ["بايت", "كيلوبايت", "ميجابايت", "جيجابايت", "تيرابايت"];

    const i = Math.floor(Math.log(sizeInBytes) / Math.log(k));
    const size = parseFloat((sizeInBytes / Math.pow(k, i)).toFixed(2));

    return `${size} ${units[i]}`;
}


export function timeSinceAr(dateString: string): string {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `منذ ${interval} سنة`;

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `منذ ${interval} شهر`;

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `منذ ${interval} يوم`;

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `منذ ${interval} ساعة`;

  interval = Math.floor(seconds / 60);
  if (interval > 1) return `منذ ${interval} دقيقة`;

  return "الآن";
}


export function timeSince(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
        { label: "سنة", seconds: 31536000 },
        { label: "شهر", seconds: 2592000 },
        { label: "أسبوع", seconds: 604800 },
        { label: "يوم", seconds: 86400 },
        { label: "ساعة", seconds: 3600 },
        { label: "دقيقة", seconds: 60 },
        { label: "ثانية", seconds: 1 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return ` منذ ${count} ${interval.label}${count > 1 ? '' : ''} `;
        }
    }

    return "الآن";
}


export function timeBefore(targetDate:string) {
  const now = new Date();
  const date = new Date(targetDate);
  const diffMs = date.getTime() - now.getTime(); // difference in milliseconds

  if (diffMs < 0) return formatDate(date); // already passed, show date

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 0) {
    if (diffHours > 0) return `بعد ${diffHours} ساعة`;
    if (diffMin > 0) return `بعد ${diffMin} دقيقة`;
    return `بعد ${diffSec} ثانية`;
  } else if (diffDays <= 7) {
    return `بعد ${diffDays} يوم`;
  } else if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7);
    return `بعد ${weeks} أسبوع`;
  } else {
    return formatDate(date); // show exact date if too far
  }
}

// Helper: format date in Arabic style
function formatDate(date:Date) {
  return date.toLocaleDateString("ar-IQ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// 2️⃣ Convert HH:mm:ss to readable ص/م time
export function formatTime(timeString:string) {
  const [hour, minute] = timeString.split(":").map(Number);
  let period = hour < 12 ? "ص" : "م";
  let displayHour = hour % 12 || 12; // convert 0-23 to 1-12
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
}

interface SectionProgress {
  id: number;
  title: string;
  completed: number;
  total: number;
  progress: number; // 0-100
}

interface EnrollmentProgress {
  overall_progress: number;
  completed_lectures: number;
  total_lectures: number;
  sections: SectionProgress[];
}

/**
 * Calculate progress given sections and completed lecture IDs.
 */
export function calculateProgress(
  sections: EnrollmentSection[],
  completedLectures: number[]
): EnrollmentProgress {
  const completedSet = new Set(completedLectures);
  let totalLectures = 0;
  let totalCompleted = 0;
  const sectionProgress: SectionProgress[] = [];

  sections.forEach(section => {
    const sectionTotal = section.lectures.length;
    const sectionCompleted = section.lectures.filter(lec =>
      completedSet.has(lec.id)
    ).length;

    totalLectures += sectionTotal;
    totalCompleted += sectionCompleted;

    sectionProgress.push({
      id: section.id,
      title: section.title,
      completed: sectionCompleted,
      total: sectionTotal,
      progress: sectionTotal > 0 ? Math.round((sectionCompleted / sectionTotal) * 100) : 0
    });
  });

  const overallProgress = totalLectures > 0 ? Math.round((totalCompleted / totalLectures) * 100) : 0;

  return {
    overall_progress: overallProgress,
    completed_lectures: totalCompleted,
    total_lectures: totalLectures,
    sections: sectionProgress
  };
}

/**
 * A simple debounce function for the trailing-edge.
 * @template T - The type of the function being debounced.
 * @param {T} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {(...args: Parameters<T>) => void} - The debounced function.
 */
export function simpleDebounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function(this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export function isExpired(isoTime:string) : boolean {
  const targetTime = new Date(isoTime).getTime();
  const now = Date.now();

  // Return true if the target time is in the past
  return now > targetTime;
}


export function convertMinutes(minutes:number, type = "hour") {
  if (typeof minutes !== "number" || minutes < 0) return 0;

  switch (type) {
    case "day":
      return (minutes / 60 / 24).toFixed(2); // 2 decimal places
    case "hour":
      return (minutes / 60).toFixed(2);
    case "minute":
    default:
      return minutes;
  }
}

export function isValidEmail(email:string | null):boolean {
  if(!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}


export function extractErrors(err: any): string[]{
  const res = err?.response?.data;
  if (!res) return ["حدث خطأ غير متوقع."];

  let errorList: string[] = [];

  if(typeof res.error === 'string'){
    errorList.push(res.error);
  }

  if (typeof res.detail === "string") {
    errorList.push(res.detail);
  }

  if (Array.isArray(res.non_field_errors)) {
    errorList.push(...res.non_field_errors);
  }

  // collect field errors (email, name, etc.)
  Object.keys(res).forEach((key) => {
    if (Array.isArray(res[key])) {
      res[key].forEach((msg: string) => errorList.push(msg));
    }
  });

  return errorList.length ? errorList : ["حدث خطأ غير متوقع."];
};


export  function getNewTaskInitialDataQuery( initial_title:string| null = null , initial_priority:string | null = null , initial_open_drawer:'true'|'false' | null = null ){
        const title = initial_title ?? t("dashboard_index.new_task_title");
        const dueDate = new Date().toISOString().split('T')[0];
        const priority = initial_priority ?? 'low';
        const openDrawer = initial_open_drawer ?? 'true';
        const urlQuery = new URLSearchParams({ title, dueDate, priority, openDrawer }).toString();

        return `/dashboard/tasks?${urlQuery}`
    }