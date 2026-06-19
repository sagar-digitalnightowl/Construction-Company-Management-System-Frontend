// src/constants/booking.js
export const BOOKING_STATUS = {
    BOOKED: 'booked',
    SOLD: 'sold',
    CANCELLED: 'cancelled',
};

export const BOOKING_APPROVAL_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
};

export const INSTALLMENT_STATUS = {
    PENDING: 'pending',
    PARTIAL: 'partial',
    PAID: 'paid',
    OVERDUE: 'overdue',
};

export const PAYMENT_MODE = {
    CASH: 'Cash',
    CHEQUE: 'Cheque',
    BANK_TRANSFER: 'Bank Transfer',
    CARD: 'Card',
    NEFT: 'NEFT',
    RTGS: 'RTGS',
    TRF: 'TRF',
    L_NEFT: 'L-NEFT',
    OTP: 'OTP',      
    CLP: 'CLP',     
};

export const MILESTONE_KEYS = {
    WITHIN_30_DAYS: 'within_30_days',
    PLINTH_COMPLETION: 'plinth_completion',
    GROUND_ROOF_CASTING: 'ground_roof_casting',
    SLAB_2ND_CASTING: 'slab_2nd_casting',
    SLAB_3RD_CASTING: 'slab_3rd_casting',
    SLAB_4TH_CASTING: 'slab_4th_casting',
    SLAB_5TH_CASTING: 'slab_5th_casting',
    SLAB_6TH_CASTING: 'slab_6th_casting',
    SLAB_7TH_CASTING: 'slab_7th_casting',
    SLAB_8TH_CASTING: 'slab_8th_casting',
    INTERNAL_WALL_COMPLETION: 'internal_wall_completion',
    FLOORING: 'flooring',
    POSSESSION: 'possession',
};

export const MILESTONE_NAMES = {
    [MILESTONE_KEYS.WITHIN_30_DAYS]: '1ST INSTALLMENT — Within 30 days of Booking',
    [MILESTONE_KEYS.PLINTH_COMPLETION]: '2ND INSTALLMENT — On Completion of Plinth Work',
    [MILESTONE_KEYS.GROUND_ROOF_CASTING]: '3RD INSTALLMENT — On Ground Roof Casting',
    [MILESTONE_KEYS.SLAB_2ND_CASTING]: '4TH INSTALLMENT — On 2nd Slab Casting',
    [MILESTONE_KEYS.SLAB_3RD_CASTING]: '5TH INSTALLMENT — On 3rd Slab Casting',
    [MILESTONE_KEYS.SLAB_4TH_CASTING]: '6TH INSTALLMENT — On 4th Slab Casting',
    [MILESTONE_KEYS.SLAB_5TH_CASTING]: '7TH INSTALLMENT — On 5th Slab Casting',
    [MILESTONE_KEYS.SLAB_6TH_CASTING]: '8TH INSTALLMENT — On 6th Slab Casting',
    [MILESTONE_KEYS.SLAB_7TH_CASTING]: '9TH INSTALLMENT — On 7th Slab Casting',
    [MILESTONE_KEYS.SLAB_8TH_CASTING]: '10TH INSTALLMENT — On 8th Slab Casting',
    [MILESTONE_KEYS.INTERNAL_WALL_COMPLETION]: '11TH INSTALLMENT — On Internal Wall Completion',
    [MILESTONE_KEYS.FLOORING]: '12TH INSTALLMENT — On Flooring',
    [MILESTONE_KEYS.POSSESSION]: '13TH INSTALLMENT — On Possession',
};