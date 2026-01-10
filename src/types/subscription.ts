export interface Feature {
  id: number;
  code: string;
  name: string;
  description: string | null;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  name_ar?: string | null;
  code: string; // source='name' in serializer
  price: number;
  duration_days: number;
  duration_months: number; // computed
  role?: string | null;
  is_free: boolean;
  is_popular: boolean;
  description?: string | null;
  description_ar?: string | null;
  features_list?: string[] | null; // free-form list if present
  features_ar?: string[] | null; // serializer method
  features: Feature[]; // related features
  is_recurring: boolean;
  stripe_price_id?: string | null;
  stripe_product_id?: string | null;
}

export interface Subscription {
  id: number;
  plan: SubscriptionPlan;
  start_date: string | null; // ISO 8601
  end_date: string | null; // ISO 8601
  is_active: boolean;
  auto_renew: boolean;
  remaining_days?: number | null;
  is_active_subscription?: boolean | null;
}

export interface Payment {
  id: number;
  plan: SubscriptionPlan | null;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string | null;
  transaction_id?: string | null;
  created_at: string; // ISO 8601
}

/* Pagination response helpers */
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type SubscriptionListResponse = Paginated<Subscription>;
export type SubscriptionPlanListResponse = Paginated<SubscriptionPlan>;
export type PaymentListResponse = Paginated<Payment>;