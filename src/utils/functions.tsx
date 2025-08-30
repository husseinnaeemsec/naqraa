import type { Enrollment, Profile, User } from "../../types"
import { BASE_API_URL } from "../api/client";
import i18n from "../i18n"

// Get user profile from localStorage
export function getUserProfile(): Profile | null {
  const data = localStorage.getItem("profile");
  return data ? JSON.parse(data) : null;
}

export const setupUserPrefrences = (user: User | null) => {

  const profile = user?.profile || getUserProfile();

  if (profile) {
    // Change language
    if (i18n.language !== profile.lang) {
      i18n.changeLanguage(profile.lang);
    }

    // Set direction (RTL for ar/ku)
    document.body.dir =
      profile.lang === "ar" || profile.lang === "ku" ? "rtl" : "ltr";

    // Theme setup using html.classList
    if (profile.theme === "dark") {
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
  return `${BASE_API_URL}/media/${path}`;
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
