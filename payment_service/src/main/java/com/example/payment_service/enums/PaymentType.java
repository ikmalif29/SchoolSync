package com.example.payment_service.enums;

public enum PaymentType {
    SPP_BULANAN,      // Rutin setiap bulan
    UANG_GANGKAL,     // Di awal masuk (bisa dicicil atau sekali bayar)
    BIAYA_UJIAN,      // Biasanya muncul di kelas 12 atau per semester
    SERAGAM,          // Biasanya di kelas 10
    STUDY_TOUR,       // Insidental
    LAIN_LAIN
}