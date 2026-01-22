<?php 

return [
    // Stripe Price ID => Entitlements
    'price_1SrJunPAqkOdrASefkMapB4h' => [ // Cohort
        'role' => 'cohort',
        'courses' => [], // cohort includes no self-paced courses
        'cohort_access' => true,
    ],

    'price_1SrJu4PAqkOdrASegZWwohfD' => [ // Foundation
        'role' => null,
        'courses' => ['foundation'], // slug or ID
        'cohort_access' => false,
    ],

    'price_1SrJspPAqkOdrASebd3vsg1u' => [ // Bundle
        'role' => 'cohort',
        'courses' => ['foundation'],
        'cohort_access' => true,
    ],

    'price_reintro_xxxxx' => [ // Reintro
        'role' => null,
        'courses' => ['reintro'],
        'cohort_access' => false,
    ],
];
