export interface User {
    id: number;
    email: string;
    password_hash: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    profile_picture_url?: string;
    user_type: 'regular_user' | 'psychologist' | 'admin';
    created_at: Date;
    updated_at: Date;
    is_active: boolean;
}
export interface Psychologist {
    id: number;
    user_id: number;
    license_number: string;
    license_verified: boolean;
    license_verification_date?: Date;
    bio?: string;
    years_experience?: number;
    hourly_rate?: number;
    max_concurrent_clients: number;
    accepting_new_clients: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface PsychologistProfile extends Psychologist {
    user: User;
    specializations: string[];
    services: Service[];
    languages: string[];
    clinicLocations: ClinicLocation[];
    education: Education[];
    certifications: Certification[];
    availability: Availability[];
    averageRating?: number;
    totalReviews?: number;
}
export interface Service {
    id: number;
    psychologist_id: number;
    service_name: string;
    service_description?: string;
    service_type: 'individual' | 'couples' | 'group' | 'family';
    delivery_method: 'in_person' | 'online' | 'hybrid';
    price?: number;
    created_at: Date;
}
export interface ClinicLocation {
    id: number;
    psychologist_id: number;
    clinic_name?: string;
    street_address: string;
    city: string;
    state_province?: string;
    postal_code?: string;
    country: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    is_primary: boolean;
    created_at: Date;
}
export interface Education {
    id: number;
    psychologist_id: number;
    institution_name: string;
    degree: string;
    field_of_study?: string;
    graduation_year?: number;
    created_at: Date;
}
export interface Certification {
    id: number;
    psychologist_id: number;
    certification_name: string;
    issuing_organization?: string;
    issue_date?: Date;
    expiry_date?: Date;
    certificate_url?: string;
    created_at: Date;
}
export interface Availability {
    id: number;
    psychologist_id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_available: boolean;
    created_at: Date;
}
export interface Booking {
    id: number;
    psychologist_id: number;
    user_id: number;
    appointment_date: Date;
    duration_minutes: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
    meeting_type: 'in_person' | 'video_call' | 'phone_call';
    notes?: string;
    cancellation_reason?: string;
    created_at: Date;
    updated_at: Date;
}
export interface Payment {
    id: number;
    booking_id?: number;
    user_id: number;
    psychologist_id: number;
    amount: number;
    commission_amount?: number;
    platform_fee?: number;
    payment_method: 'credit_card' | 'debit_card' | 'bank_transfer' | 'digital_wallet';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    stripe_payment_id?: string;
    stripe_charge_id?: string;
    transaction_date: Date;
    created_at: Date;
}
export interface Review {
    id: number;
    psychologist_id: number;
    user_id: number;
    booking_id?: number;
    rating: number;
    title?: string;
    review_text?: string;
    is_verified_booking: boolean;
    is_published: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface Message {
    id: number;
    sender_id: number;
    recipient_id: number;
    subject?: string;
    message_body: string;
    is_read: boolean;
    is_archived: boolean;
    created_at: Date;
    read_at?: Date;
}
//# sourceMappingURL=models.d.ts.map