export declare enum RecurrenceType {
    ONCE = "once",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly"
}
export declare class BulkCreateSlotsDto {
    startTime: string;
    endTime: string;
    roomIds: string[];
    recurrence: RecurrenceType;
    startDate: string;
    endDate?: string;
    weekDays?: number[];
    monthDay?: number;
}
