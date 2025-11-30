export interface Order {
  id: number;
  user_id: string; // uuid
  table_id: number;
  customer_name: string;
  customer_phone: string;
  arrive_date: string; // date
  arrive_time: string; // time
  activated_at: string | null; // timestamptz
  notes: string;
  status: 'Đã duyệt' | 'Pending' | 'Decline' | string;
  created_at: string; // timestamptz
  active_until: string | null; // timestamptz
}

export interface Table {
  id: number;
  name: string;
  area: string;
  capacity: number;
  status: string;
  active_until: string | null; // timestamptz
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;      // numeric
  img: string;        // url hoặc base64
  description: string;
}

export interface UserProfile {
  id: string; // uuid (trùng auth.users.id)
  full_name: string;
  phone: string;
  created_at: string;   // timestamptz
  updated_at: string;   // timestamptz
  role: 'admin' | 'user' | string;
  email: string;
}
