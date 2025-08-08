export declare class CreateEventDto {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    imageUrl?: string;
    category?: string;
    isRegistrationOpen?: boolean;
    maxAttendees?: number;
    price?: number;
    isPublished?: boolean;
}
